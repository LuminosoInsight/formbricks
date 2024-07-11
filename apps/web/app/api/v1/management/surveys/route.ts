import { responses } from "@/lib/api/response";
import { authenticateRequest, handleErrorResponse } from "@/app/api/v1/auth";
import { NextResponse } from "next/server";
import { transformErrorToDetails } from "@/lib/api/validator";
import { createSurvey, getSurveys, updateSurvey } from "@formbricks/lib/survey/service";
import { ZSurvey, ZSurveyInput } from "@formbricks/types/v1/surveys";
import { DatabaseError } from "@formbricks/types/v1/errors";
import { LUMI_API_URL } from "@formbricks/lib/constants";
import { TDaylightProject, TDaylightProjectCreate } from "@formbricks/types/v1/daylight";
import * as console from "node:console";

async function createDaylightProject(
  token: string,
  projectData: TDaylightProjectCreate
): Promise<TDaylightProject | NextResponse> {
  try {
    const response = await fetch(`${LUMI_API_URL}/projects`, {
      method: "POST",
      body: JSON.stringify(projectData),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    });
    const resObj = await response.json();
    if (response.ok) {
      return resObj;
    } else {
      throw new Error("Something went wrong!");
    }
  } catch (e) {
    return handleErrorResponse(e);
  }
}

export async function GET(request: Request) {
  try {
    const requestUrl = request.url;
    const url = new URL(requestUrl);
    const searchParams = new URLSearchParams(url.search);
    const page = searchParams.get("page");
    const publicity = searchParams.get("publicity");

    const params = { page, publicity };

    const authentication = await authenticateRequest(request);
    if (!authentication) return responses.notAuthenticatedResponse();
    const surveys = await getSurveys(authentication.environmentId!, params);
    return responses.successResponse(surveys);
  } catch (error) {
    if (error instanceof DatabaseError) {
      return responses.badRequestResponse(error.message);
    }
    throw error;
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const apiKey = request.headers.get("x-api-key");
    const authentication = await authenticateRequest(request);
    if (!authentication) return responses.notAuthenticatedResponse();
    const surveyInput = await request.json();
    const inputValidation = ZSurveyInput.safeParse(surveyInput);

    if (!inputValidation.success) {
      return responses.badRequestResponse(
        "Fields are missing or incorrectly formatted",
        transformErrorToDetails(inputValidation.error),
        true
      );
    }

    const environmentId = authentication.environmentId;
    const surveyData = { ...inputValidation.data, environmentId: undefined };

    let survey = await createSurvey(environmentId, { ...surveyData });
    const daylightProject = await createDaylightProject(apiKey!, {
      name: `Survey - ${survey.name}`,
      language: "en",
    });
    if (daylightProject) {
      const surveyData = { ...survey, projects: [daylightProject.project_id] };
      const inputValidation = ZSurvey.safeParse(surveyData);
      if (!inputValidation.success) {
        return responses.badRequestResponse(
          "Fields are missing or incorrectly formatted",
          transformErrorToDetails(inputValidation.error)
        );
      }
      survey = await updateSurvey(inputValidation.data);
    } else {
      console.error("Daylight project creation failed!");
    }
    return responses.successResponse(survey);
  } catch (error) {
    if (error instanceof DatabaseError) {
      return responses.badRequestResponse(error.message);
    }
    throw error;
  }
}
