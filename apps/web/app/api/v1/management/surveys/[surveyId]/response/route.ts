import { authenticateRequest } from "@/app/api/v1/auth";
import { responses } from "@/lib/api/response";
import { getSurveyResponses } from "@formbricks/lib/response/service";
import { DatabaseError } from "@formbricks/types/v1/errors";

export async function GET(request: Request, { params }: { params: { surveyId: string } }) {
  try {
    const authentication = await authenticateRequest(request);
    if (!authentication) return responses.notAuthenticatedResponse();
    const surveyResponses = await getSurveyResponses(params.surveyId);
    return responses.successResponse(surveyResponses);
  } catch (error) {
    if (error instanceof DatabaseError) {
      return responses.badRequestResponse(error.message);
    }
    throw error;
  }
}
