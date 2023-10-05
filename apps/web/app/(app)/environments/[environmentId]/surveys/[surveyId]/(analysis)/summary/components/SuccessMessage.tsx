"use client";

import { TSurvey } from "@formbricks/types/v1/surveys";
import { Confetti } from "@formbricks/ui";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ShareEmbedSurvey from "./ShareEmbedSurvey";
import { TProduct } from "@formbricks/types/v1/product";
import LinkSingleUseSurveyModal from "@/app/(app)/environments/[environmentId]/surveys/[surveyId]/(analysis)/summary/components/LinkSingleUseSurveyModal";
import { TEnvironment } from "@formbricks/types/v1/environment";
import { TProfile } from "@formbricks/types/v1/profile";

interface SummaryMetadataProps {
  environment: TEnvironment;
  survey: TSurvey;
  surveyBaseUrl: string;
  product: TProduct;
  profile: TProfile;
  singleUseIds?: string[];
}

export default function SuccessMessage({
  environment,
  survey,
  surveyBaseUrl,
  product,
  profile,
  singleUseIds,
}: SummaryMetadataProps) {
  const isSingleUse = survey.singleUse?.enabled ?? false;

  const searchParams = useSearchParams();
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [confetti, setConfetti] = useState(false);

  useEffect(() => {
    const newSurveyParam = searchParams?.get("success");
    if (newSurveyParam && survey && environment) {
      setConfetti(true);
      toast.success(
        survey.type === "web" && !environment.widgetSetupCompleted
          ? "Almost there! Install widget to start receiving responses."
          : "Congrats! Your survey is live.",
        {
          icon: survey.type === "web" && !environment.widgetSetupCompleted ? "🤏" : "🎉",
          duration: 5000,
          position: "bottom-right",
        }
      );
      if (survey.type === "link") {
        setShowLinkModal(true);
      }
      // Remove success param from url
      const url = new URL(window.location.href);
      url.searchParams.delete("success");
      window.history.replaceState({}, "", url.toString());
    }
  }, [environment, searchParams, survey]);

  return (
    <>
      {showLinkModal && isSingleUse && singleUseIds ? (
        <LinkSingleUseSurveyModal survey={survey} open={showLinkModal} setOpen={setShowLinkModal} />
      ) : (
        <ShareEmbedSurvey
          survey={survey}
          open={showLinkModal}
          setOpen={setShowLinkModal}
          surveyBaseUrl={surveyBaseUrl}
          product={product}
          profile={profile}
        />
      )}
      {confetti && <Confetti />}
    </>
  );
}
