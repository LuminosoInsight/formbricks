import WebhookRowData from "@/app/(app)/environments/[environmentId]/integrations/custom-webhook/WebhookRowData";
import WebhookTable from "@/app/(app)/environments/[environmentId]/integrations/custom-webhook/WebhookTable";
import WebhookTableHeading from "@/app/(app)/environments/[environmentId]/integrations/custom-webhook/WebhookTableHeading";
import GoBackButton from "@/components/shared/GoBackButton";
import { getSurveys } from "@formbricks/lib/services/survey";
import { getWebhooks } from "@formbricks/lib/services/webhook";

export default async function CustomWebhookPage({ params }) {
  const webhooks = (await getWebhooks(params.environmentId)).sort((a, b) => {
    if (a.createdAt > b.createdAt) return -1;
    if (a.createdAt < b.createdAt) return 1;
    return 0;
  });
  const surveys = await getSurveys(params.environmentId);
  return (
    <>
      <GoBackButton />
      <WebhookTable environmentId={params.environmentId} webhooks={webhooks} surveys={surveys}>
        <WebhookTableHeading />
        {webhooks.map((webhook) => (
          <WebhookRowData key={webhook.id} webhook={webhook} surveys={surveys} />
        ))}
      </WebhookTable>
    </>
  );
}
