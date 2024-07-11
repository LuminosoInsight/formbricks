import { responses } from "@/lib/api/response";
import { NextResponse } from "next/server";
import { getSurveyByProjectId, getSurveysByProjectId } from "@formbricks/lib/survey/service";
import { TSurvey } from "@formbricks/types/v1/surveys";
import { authenticateRequest } from "@/app/api/v1/auth";
import { DatabaseError } from "@formbricks/types/v1/errors";

export async function fetchAndAuthorizeSurvey(
  authentication: any,
  projectId: string
): Promise<TSurvey | null> {
  const survey = await getSurveyByProjectId(projectId);
  if (!survey) {
    return null;
  }
  if (survey.environmentId !== authentication.environmentId) {
    throw new Error("Unauthorized");
  }
  return survey;
}

export async function GET(
  request: Request,
  { params }: { params: { projectId: string } }
): Promise<NextResponse> {
  try {
    const authentication = await authenticateRequest(request);
    if (!authentication) return responses.notAuthenticatedResponse();
    const surveys = await getSurveysByProjectId(authentication.environmentId!, params.projectId);
    return responses.successResponse(surveys);
  } catch (error) {
    if (error instanceof DatabaseError) {
      return responses.badRequestResponse(error.message);
    }
    throw error;
  }
}
