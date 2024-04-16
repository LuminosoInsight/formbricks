import { TSurvey } from "@formbricks/types/v1/surveys";
import { useEffect, useState } from "preact/hooks";
import Progress from "./Progress";

interface ProgressBarProps {
  survey: TSurvey;
  questionId?: string;
  brandColor: string;
  pageId?: string;
}

export default function ProgressBar({ survey, questionId, brandColor, pageId }: ProgressBarProps) {
  const PROGRESS_INCREMENT = 0.1;

  const [progress, setProgress] = useState(0); // [0, 1]
  const [prevQuestionIdx, setPrevQuestionIdx] = useState(0); // [0, survey.questions.length
  const [prevPageIdx, setPrevPageIdx] = useState(0); // [0, survey.questions.length

  useEffect(() => {
    // calculate progress
    if (questionId) setProgress(calculateProgressByQuestion(questionId, survey, progress));
    if (pageId) setProgress(calculateProgressByPage(pageId, survey, progress));

    function calculateProgressByQuestion(questionId: string, survey: TSurvey, progress: number) {
      if (survey.questions.length === 0) return 0;
      if (questionId === "end") return 1;

      let currentQustionIdx = survey.questions.findIndex((e) => e.id === questionId);
      if (progress > 0 && currentQustionIdx === prevQuestionIdx) return progress;
      if (currentQustionIdx === -1) currentQustionIdx = 0;
      const currentQuestion = survey.questions[currentQustionIdx];
      const surveyLength = survey.questions.length;
      const middleIdx = Math.floor(surveyLength / 2);
      const possibleNextQuestions = currentQuestion.logic?.map((l) => l.destination) || [];

      const getLastQuestionIndex = () => {
        const lastQuestion = survey.questions
          .filter((q) => possibleNextQuestions.includes(q.id))
          .sort((a, b) => survey.questions.indexOf(a) - survey.questions.indexOf(b))
          .pop();
        return survey.questions.findIndex((e) => e.id === lastQuestion?.id);
      };

      let elementIdx = currentQustionIdx || 0.5;
      const lastprevQuestionIdx = getLastQuestionIndex();

      if (lastprevQuestionIdx > 0) elementIdx = Math.min(middleIdx, lastprevQuestionIdx - 1);
      if (possibleNextQuestions.includes("end")) elementIdx = middleIdx;

      const newProgress = elementIdx / survey.questions.length;

      // Determine if user went backwards in the survey
      const didUserGoBackwards = currentQustionIdx < prevQuestionIdx;

      // Update the progress array based on user's navigation
      let updatedProgress = progress;
      if (didUserGoBackwards) {
        updatedProgress = progress - (prevQuestionIdx - currentQustionIdx) * PROGRESS_INCREMENT;
      } else if (newProgress > progress) {
        updatedProgress = newProgress;
      } else if (newProgress <= progress && progress + PROGRESS_INCREMENT <= 1) {
        updatedProgress = progress + PROGRESS_INCREMENT;
      }

      setPrevQuestionIdx(currentQustionIdx);
      return updatedProgress;
    }

    function calculateProgressByPage(pageId: string, survey: TSurvey, progress: number) {
      if (survey.pages.length === 0) return 0;
      if (pageId === "end") return 1;

      let currentPageIdx = survey.pages.findIndex((e) => e.id === pageId);
      if (progress > 0 && currentPageIdx === prevPageIdx) return progress;
      if (currentPageIdx === -1) currentPageIdx = 0;
      const currentPage = survey.pages[currentPageIdx];
      const surveyLength = survey.pages.length;
      const middleIdx = Math.floor(surveyLength / 2);
      // const possibleNextQuestions = currentPage.logic?.map((l) => l.destination) || [];

      const getLastPageIndex = () => {
        const copyPages = [...survey.pages];
        const lastPage = copyPages
          // .filter((q) => possibleNextQuestions.includes(q.id))
          .sort((a, b) => survey.pages.indexOf(a) - survey.pages.indexOf(b))
          .pop();
        return survey.pages.findIndex((e) => e.id === lastPage?.id);
      };

      let elementIdx = currentPageIdx;
      const lastprevPageIdx = getLastPageIndex();

      // if (lastprevPageIdx > 0) elementIdx = Math.min(middleIdx, lastprevPageIdx - 1);
      // if (possibleNextQuestions.includes("end")) elementIdx = middleIdx;

      const newProgress = elementIdx / survey.pages.length;

      // Determine if user went backwards in the survey
      const didUserGoBackwards = currentPageIdx < prevPageIdx;

      // Update the progress array based on user's navigation
      let updatedProgress = progress;
      if (didUserGoBackwards) {
        updatedProgress = progress - (prevPageIdx - currentPageIdx) * PROGRESS_INCREMENT;
      } else if (newProgress > progress) {
        updatedProgress = newProgress;
      } else if (newProgress <= progress && progress + PROGRESS_INCREMENT <= 1) {
        updatedProgress = progress + PROGRESS_INCREMENT;
      }

      setPrevPageIdx(currentPageIdx);
      return updatedProgress;
    }
  }, [pageId, survey, setPrevPageIdx]);

  return (
    <Progress idx={prevPageIdx} length={survey?.pages.length} progress={progress} brandColor={brandColor} />
  );
}
