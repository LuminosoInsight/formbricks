import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import FormOnboardingModal from "../../../components/form/FormOnboardingModal";
import LayoutFormBasics from "../../../components/layout/LayoutFormBasic";
import Loading from "../../../components/Loading";
import { useForm } from "../../../lib/forms";

export default function WelcomePage() {
  const router = useRouter();
  const formId = router.query.id.toString();
  const { form, isLoadingForm } = useForm(router.query.id);

  if (isLoadingForm) {
    return <Loading />;
  }

  if (!form.finishedOnboarding) {
    return (
      <LayoutFormBasics title={form.title} formId={formId} currentStep="form">
        <FormOnboardingModal open={true} formId={formId} />
      </LayoutFormBasics>
    );
  } else {
    router.push(`/forms/${formId}`);
    return <Loading />;
  }
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req });
  if (!session) {
    res.statusCode = 403;
  }
  return { props: {} };
};
