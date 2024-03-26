import { renderSurveyInline, renderSurveyModal } from "@formbricks/surveys";
import { Survey } from "@formbricks/types/surveys";
import { TResponseData, TResponseUpdate } from "@formbricks/types/v1/responses";
import { TSurvey } from "@formbricks/types/v1/surveys";
import { useEffect, useMemo } from "react";
import ContentWrapper from "@/components/shared/ContentWrapper";
import { useSearchParams } from "next/navigation";

const createContainerId = () => `formbricks-survey-container`;

interface SurveyProps {
  survey: TSurvey | Survey;
  brandColor: string;
  formbricksSignature: boolean;
  activeQuestionId?: string;
  onDisplay?: () => void;
  onResponse?: (response: TResponseUpdate) => void;
  onFinished?: () => void;
  onActiveQuestionChange?: (questionId: string) => void;
  onClose?: () => void;
  autoFocus?: boolean;
  prefillResponseData?: TResponseData;
  isRedirectDisabled?: boolean;
  activePageId?: string;
  onActivePageChange?: (pageId: string) => void;
}

interface SurveyModalProps extends SurveyProps {
  placement?: "topRight" | "bottomRight" | "bottomLeft" | "topLeft" | "center";
  clickOutside?: boolean;
  darkOverlay?: boolean;
  highlightBorderColor?: string | null;
}

export const SurveyInline = ({
  survey,
  brandColor,
  formbricksSignature,
  activeQuestionId,
  onDisplay = () => {},
  onResponse = () => {},
  onActiveQuestionChange = () => {},
  onClose = () => {},
  autoFocus,
  prefillResponseData,
  isRedirectDisabled,
  onActivePageChange = () => {},
  activePageId,
}: SurveyProps) => {
  const containerId = useMemo(() => createContainerId(), []);
  useEffect(() => {
    renderSurveyInline({
      survey,
      brandColor,
      formbricksSignature,
      containerId,
      onDisplay,
      onResponse,
      onClose,
      activeQuestionId,
      onActiveQuestionChange,
      autoFocus,
      prefillResponseData,
      isRedirectDisabled,
      activePageId,
      onActivePageChange,
    });
  }, [
    activeQuestionId,
    brandColor,
    containerId,
    formbricksSignature,
    onActiveQuestionChange,
    onClose,
    onDisplay,
    onResponse,
    survey,
    autoFocus,
    prefillResponseData,
    isRedirectDisabled,
    activePageId,
    onActivePageChange,
  ]);
  const searchParams = useSearchParams();
  const isPreview = searchParams?.get("preview") === "true";
  return (
    <div
      className="h-full overflow-y-auto p-0"
      style={{
        background: `${survey?.styling?.background?.bg || "white"}`,
        paddingTop: isPreview ? "40px" : 0,
      }}>
      <ContentWrapper className={`h-full w-full p-0 md:max-w-3xl`}>
        <div id={containerId} className="h-full w-full" />
      </ContentWrapper>
    </div>
  );
};

export const SurveyModal = ({
  survey,
  brandColor,
  formbricksSignature,
  activeQuestionId,
  placement = "bottomRight",
  clickOutside = false,
  darkOverlay = false,
  highlightBorderColor = null,
  onDisplay = () => {},
  onResponse = () => {},
  onActiveQuestionChange = () => {},
  onClose = () => {},
  autoFocus,
  isRedirectDisabled,
}: SurveyModalProps) => {
  useEffect(() => {
    renderSurveyModal({
      survey,
      brandColor,
      formbricksSignature,
      placement,
      clickOutside,
      darkOverlay,
      highlightBorderColor,
      onDisplay,
      onResponse,
      onClose,
      activeQuestionId,
      onActiveQuestionChange,
      autoFocus,
      isRedirectDisabled,
    });
  }, [
    activeQuestionId,
    brandColor,
    clickOutside,
    darkOverlay,
    formbricksSignature,
    highlightBorderColor,
    onActiveQuestionChange,
    onClose,
    onDisplay,
    onResponse,
    placement,
    survey,
    autoFocus,
    isRedirectDisabled,
  ]);
  return <div id="formbricks-survey"></div>;
};
