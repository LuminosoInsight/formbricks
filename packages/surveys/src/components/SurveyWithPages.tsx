import type { TResponseData } from "@formbricks/types/v1/responses";
import { useEffect, useRef, useState } from "preact/hooks";
// import { evaluateCondition } from "../lib/logicEvaluator";
import { cn } from "../lib/utils";
import { SurveyBaseProps } from "../types/props";
import { AutoCloseWrapper } from "./AutoCloseWrapper";
// import FormbricksSignature from "./FormbricksSignature";
import ProgressBar from "./ProgressBar";
// import QuestionConditional from "./QuestionConditional";
import ThankYouCard from "./ThankYouCard";
import SurveyHeadline from "./SurveyHeadline";
import Subheader from "./Subheader";
import SurveyPage from "./SurveyPage.tsx";

export function SurveyWithPages({
  survey,
  brandColor,
  // formbricksSignature,
  // activeQuestionId,
  activePageId,
  onActivePageChange = () => {},
  onDisplay = () => {},
  onActiveQuestionChange = () => {},
  onResponse = () => {},
  onClose = () => {},
  onFinished = () => {},
  isRedirectDisabled = false,
  prefillResponseData,
}: SurveyBaseProps) {
  const [pageId, setPageId] = useState(activePageId || survey.pages[0]?.id);
  const [loadingElement, setLoadingElement] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [responseData, setResponseData] = useState<TResponseData>({});
  const currentPageIndex = survey.pages.findIndex((p) => p.id === pageId);
  // const currentPage = survey.pages[currentPageIndex];
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setPageId(activePageId || survey.pages[0].id);
  }, [activePageId, survey.pages]);

  useEffect(() => {
    // scroll to top when question changes
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [pageId]);

  // call onDisplay when component is mounted
  useEffect(() => {
    onDisplay();
    if (prefillResponseData) {
      onSubmit(prefillResponseData);
    }
  }, []);

  function getNextPageId(data: TResponseData): string {
    const pages = survey.pages;
    const responseValue = data[pageId];
    if (currentPageIndex === -1) throw new Error("Question not found");

    // if (currentPage?.logic && currentPage?.logic.length > 0) {
    //   for (let logic of currentPage.logic) {
    //     if (!logic.destination) continue;
    //
    //     if (evaluateCondition(logic, responseValue)) {
    //       return logic.destination;
    //     }
    //   }
    // }
    return pages[currentPageIndex + 1]?.id || "end";
  }

  const onChange = (responseDataUpdate: TResponseData) => {
    const updatedResponseData = { ...responseData, ...responseDataUpdate };
    setResponseData(updatedResponseData);
  };

  const onSubmit = (responseData: TResponseData) => {
    setLoadingElement(true);
    const nextPageId = getNextPageId(responseData);
    const finished = nextPageId === "end";
    onResponse({ data: responseData, finished });
    if (finished) {
      onFinished();
    }
    setPageId(nextPageId);
    // add to history
    setHistory([...history, pageId]);
    setLoadingElement(false);
    onActivePageChange(nextPageId);
  };

  const onBack = (): void => {
    let prevPageId;
    // use history if available
    if (history?.length > 0) {
      const newHistory = [...history];
      prevPageId = newHistory.pop();
      if (prefillResponseData && prevPageId === survey.pages[0].id) return;
      setHistory(newHistory);
    } else {
      // otherwise go back to previous page in array
      prevPageId = survey.pages[currentPageIndex - 1]?.id;
    }
    if (!prevPageId) throw new Error("Page not found");
    setPageId(prevPageId);
    onActivePageChange(prevPageId);
  };

  return (
    <>
      <AutoCloseWrapper survey={survey} brandColor={brandColor} onClose={onClose}>
        <div className="flex h-full w-full flex-col justify-between bg-[transparent] px-6 pb-3 pt-6">
          <div ref={contentRef} className={cn(loadingElement ? "animate-pulse opacity-60" : "", "my-auto")}>
            {/*{pageId === "end" && survey.thankYouCard.enabled ? (*/}
            {pageId === "end" ? (
              <ThankYouCard
                headline={survey.thankYouCard.headline}
                subheader={survey.thankYouCard.subheader}
                brandColor={brandColor}
                redirectUrl={survey.redirectUrl}
                isRedirectDisabled={isRedirectDisabled}
              />
            ) : (
              <>
                <SurveyHeadline surveyId={survey.id} headline={survey.name} />
                {survey?.description && pageId === survey.pages[0]?.id && (
                  <Subheader questionId={survey.id} subheader={survey?.description} />
                )}
                {survey?.image && <img src={survey.image} className="mt-5 w-full" alt={survey.image} />}
                <div
                  className="mt-5 h-[2px] w-full rounded-full"
                  style={{ background: brandColor || survey?.productOverwrites?.brandColor }}></div>
                <div className="mt-10">
                  {survey.pages.map(
                    (page, idx) =>
                      currentPageIndex === idx && (
                        <SurveyPage
                          // onNextPage={onSubmit}
                          isLastPage={idx === survey.pages.length - 1}
                          pageIndex={idx}
                          onPrevPage={onBack}
                          page={page}
                          brandColor={brandColor}
                          responseData={responseData}
                          onChange={onChange}
                          onSubmit={onSubmit}
                        />
                      )
                  )}
                </div>
              </>
            )}
          </div>
          <div className="mt-8 pb-8">
            {/* {formbricksSignature && <FormbricksSignature />} */}
            <ProgressBar survey={survey} pageId={pageId} brandColor={brandColor} />
          </div>
        </div>
      </AutoCloseWrapper>
    </>
  );
}

const PageIndex = () => {
  return <div></div>;
};
