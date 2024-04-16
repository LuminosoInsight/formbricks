"use client";

import React, { useEffect, useState } from "react";
import { TSurvey } from "@formbricks/types/v1/surveys";
import { Survey } from "@formbricks/types/surveys";
import PreviewSurvey from "@/app/(app)/environments/[environmentId]/surveys/PreviewSurvey";
import { TEnvironment } from "@formbricks/types/v1/environment";
import { TProduct } from "@formbricks/types/v1/product";
import { getData } from "@/app/preview/actions";

const PreviewPage = () => {
  const [survey, setSurvey] = useState<TSurvey | Survey | null>(null);
  const [environment, setEnvironment] = useState<TEnvironment | null>(null);
  const [product, setProduct] = useState<TProduct | null>(null);
  const [activeQuestionId, setActiveQuestionId] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    const handleMessage = async (event) => {
      if (event.data.survey) {
        setSurvey(event.data.survey);
        if (event.data.selectedPage) {
          setActiveQuestionId(event.data.selectedPage);
        }
      }

      if (event.data.environmentId) {
        const { initialEnvironment, initialProduct } = await getData(event.data.environmentId);
        setEnvironment(initialEnvironment);
        setProduct(initialProduct);
      }
    };
    window.parent.postMessage({ status: "ready" }, "*");
    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return (
    <>
      {survey && environment && product && (
        <PreviewSurvey
          survey={survey}
          environment={environment}
          product={product}
          activeQuestionId={activeQuestionId}
          setActiveQuestionId={setActiveQuestionId}
          previewType="fullwidth"
        />
      )}
    </>
  );
};

export default PreviewPage;
