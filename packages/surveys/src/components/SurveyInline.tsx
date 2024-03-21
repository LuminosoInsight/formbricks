import { SurveyBaseProps } from "../types/props";
import { SurveyWithPages } from "./SurveyWithPages.tsx";

export function SurveyInline({
  survey,
  brandColor,
  formbricksSignature,
  activeQuestionId,
  onDisplay = () => {},
  onActiveQuestionChange = () => {},
  onResponse = () => {},
  onClose = () => {},
  prefillResponseData,
  isRedirectDisabled = false,
  onActivePageChange = () => {},
  activePageId,
}: SurveyBaseProps) {
  return (
    <div id="fbjs" className="h-full w-full">
      <SurveyWithPages
        survey={survey}
        brandColor={brandColor}
        formbricksSignature={formbricksSignature}
        activeQuestionId={activeQuestionId}
        onDisplay={onDisplay}
        onActiveQuestionChange={onActiveQuestionChange}
        onResponse={onResponse}
        onClose={onClose}
        prefillResponseData={prefillResponseData}
        isRedirectDisabled={isRedirectDisabled}
        activePageId={activePageId}
        onActivePageChange={onActivePageChange}
      />
    </div>
  );
}
