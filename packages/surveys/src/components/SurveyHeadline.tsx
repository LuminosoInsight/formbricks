interface HeadlineProps {
  headline?: string;
  surveyId: string;
  style?: any;
  required?: boolean;
}

export default function SurveyHeadline({ headline, surveyId, style }: HeadlineProps) {
  return (
    <label htmlFor={surveyId} className="mb-1.5 block text-2xl font-semibold leading-6 text-slate-900">
      <div className={"flex justify-between gap-4"} style={style}>
        {headline}
      </div>
    </label>
  );
}
