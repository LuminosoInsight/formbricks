export const revalidate = REVALIDATION_INTERVAL;

import ResponsesLimitReachedBanner from "@/app/(app)/environments/[environmentId]/surveys/[surveyId]/(analysis)/components/ResponsesLimitReachedBanner";
import { getAnalysisData } from "@/app/(app)/environments/[environmentId]/surveys/[surveyId]/(analysis)/data";
import SummaryPage from "@/app/(app)/environments/[environmentId]/surveys/[surveyId]/(analysis)/summary/components/SummaryPage";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { REVALIDATION_INTERVAL, SURVEY_BASE_URL } from "@formbricks/lib/constants";
import { getEnvironment } from "@formbricks/lib/services/environment";
import { getProductByEnvironmentId } from "@formbricks/lib/services/product";
import { getTagsByEnvironmentId } from "@formbricks/lib/tag/service";
import { getServerSession } from "next-auth";

export default async function Page({ params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("Unauthorized");
  }
  const [{ responses, survey }, environment] = await Promise.all([
    getAnalysisData(params.surveyId, params.environmentId),
    getEnvironment(params.environmentId),
  ]);
  if (!environment) {
    throw new Error("Environment not found");
  }

  const product = await getProductByEnvironmentId(environment.id);
  if (!product) {
    throw new Error("Product not found");
  }
  const tags = await getTagsByEnvironmentId(params.environmentId);

  return (
    <>
      <ResponsesLimitReachedBanner environmentId={params.environmentId} surveyId={params.surveyId} />
      <SummaryPage
        environment={environment}
        responses={responses}
        survey={survey}
        surveyId={params.surveyId}
        surveyBaseUrl={SURVEY_BASE_URL}
        product={product}
        environmentTags={tags}
      />
    </>
  );
}
