import { TSurveyPage } from "@formbricks/types/v1/surveys.ts";
import type { TResponseData } from "@formbricks/types/v1/responses.ts";
import SubmitButton from "./SubmitButton.tsx";
import { BackButton } from "./BackButton.tsx";
import QuestionConditional from "./QuestionConditional.tsx";
import SurveyPageHeader from "./SurveyPageHeader.tsx";

type Props = {
  page: TSurveyPage;
  onNextPage?: (data: TResponseData) => void;
  onPrevPage: () => void;
  onChange: (responseDataUpdate: TResponseData) => void;
  brandColor: string;
  onSubmit?: (responseData: TResponseData) => void;
  responseData: TResponseData;
  pageIndex: number;
  isLastPage: boolean;
};

const SurveyPage = ({
  page,
  // onNextPage,
  onPrevPage,
  onSubmit,
  brandColor,
  onChange,
  responseData,
  pageIndex,
  isLastPage,
}: Props) => {
  const submitPageHandler = (e: any) => {
    e.preventDefault();
    onSubmit ? onSubmit(responseData) : {};
  };

  return (
    <form
      onSubmit={submitPageHandler}
      onKeyDown={(e) => {
        if (e.key == "Enter")
          if (onSubmit) {
            onSubmit(responseData);
          }
      }}>
      <SurveyPageHeader
        pageId={page.id}
        headline={page.headline}
        subheader={page.subheader}
        brandColor={brandColor}
      />
      <div className="flex flex-col gap-6">
        {page.questions.map((question, idx) => (
          <QuestionConditional
            question={question}
            value={responseData[question.id]}
            onChange={onChange}
            onSubmit={() => undefined}
            onBack={() => undefined}
            isFirstQuestion={
              // if prefillResponseData is provided, check if we're on the first "real" question
              false
            }
            isLastQuestion={idx === page.questions.length - 1}
            brandColor={brandColor}
          />
        ))}
      </div>
      <div className="mt-4 flex w-full justify-between">
        <div>
          {pageIndex !== 0 && (
            <BackButton
              backButtonLabel="Back"
              onClick={() => {
                onPrevPage();
              }}
            />
          )}
        </div>
        <SubmitButton type="submit" isLastQuestion={isLastPage} brandColor={brandColor} onClick={() => {}} />
      </div>
    </form>
  );
};

export default SurveyPage;
