import { NextResponse } from "next/server";
import { authenticateRequest } from "@/app/api/v1/auth";
import { responses } from "@/lib/api/response";
import { ZSurvey, ZSurveyInput } from "@formbricks/types/v1/surveys";
import { transformErrorToDetails } from "@/lib/api/validator";
import { updateSurvey } from "@formbricks/lib/survey/service";
import console from "node:console";
import { DatabaseError } from "@formbricks/types/v1/errors";
import { fetchAndAuthorizeSurvey } from "@/app/api/v1/management/surveys/[surveyId]/route";
import { createDaylightProject } from "@/app/api/v1/management/surveys/route";

export async function POST(
  request: Request,
  { params }: { params: { surveyId: string } }
): Promise<NextResponse> {
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

    let survey = await fetchAndAuthorizeSurvey(authentication, params.surveyId);
    if (!survey) return responses.notFoundResponse("Survey", params.surveyId);
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
