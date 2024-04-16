import { TResponseData } from "@formbricks/types/v1/responses";
import type { TSurveyGridChoiceSingleQuestion } from "@formbricks/types/v1/surveys";
import { useMemo } from "preact/hooks";
import { cn } from "../lib/utils.ts";
import Headline from "./Headline.tsx";
import Subheader from "./Subheader.tsx";
import SurveyImage from "./SurveyImage.tsx";

interface GridChoiceSingleQuestionProps {
  question: TSurveyGridChoiceSingleQuestion;
  value: Record<string, string>;
  onChange: (responseData: TResponseData) => void;
  brandColor: string;
}

export default function GridChoiceSingleQuestion({
  question,
  value,
  onChange,
  brandColor,
}: GridChoiceSingleQuestionProps) {
  const questionChoices = useMemo(() => {
    if (!question.choices) {
      return [];
    }
    return question.choices;
  }, [question.choices]);

  return (
    <div className="w-full rounded-md bg-white p-7 shadow-sm">
      <Headline headline={question.headline} questionId={question.id} required={question.required} />
      <Subheader subheader={question.subheader} questionId={question.id} />
      {question?.image && <SurveyImage image={question.image} />}
      <div className="mt-10">
        <table class="w-full table-fixed">
          <thead>
            <tr className="text-sm">
              <th></th>
              {questionChoices.map((item) => (
                <th className="px-2" key={item.id}>
                  {item.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {question.rows.map((row) => (
              <tr>
                <td>
                  <div className="p-4">{row.label}</div>
                </td>
                {questionChoices.map((choice, idx) => (
                  <td key={`${row.id}-${choice.id}`}>
                    <label
                      tabIndex={idx + 1}
                      onKeyDown={(e) => {
                        if (e.key == "Enter") {
                          onChange({ [question.id]: { ...value, [row.id]: choice.label } });
                        }
                      }}
                      className={cn(
                        value?.[row.id] === choice.label
                          ? "z-10 border border-slate-400 bg-slate-50"
                          : "border-gray-200",
                        "relative flex cursor-pointer flex-col rounded-md p-4 text-slate-800 focus-within:border-slate-400  focus-within:bg-slate-50 hover:bg-slate-50 focus:outline-none "
                      )}>
                      <span className="flex items-center justify-center text-sm">
                        <input
                          tabIndex={-1}
                          type="radio"
                          id={`${row.id}-${choice.id}`}
                          name={`${row.id}`}
                          value={choice.label}
                          className="h-4 w-4 border border-slate-300 focus:ring-0 focus:ring-offset-0"
                          aria-labelledby={`${row.id}-${choice.id}-label`}
                          onChange={() => {
                            onChange({ [question.id]: { ...value, [row.id]: choice.label } });
                          }}
                          checked={value?.[row.id] === choice.label}
                          style={{ borderColor: brandColor, color: brandColor }}
                          required={question.required}
                        />
                      </span>
                    </label>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
