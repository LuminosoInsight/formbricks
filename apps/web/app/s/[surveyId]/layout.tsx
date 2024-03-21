import LegalFooter from "@/app/s/[surveyId]/LegalFooter";

export default function SurveyLayout({ children }) {
  return (
    <div className="flex h-full flex-col justify-between bg-white">
      {children}
      <LegalFooter />
    </div>
  );
}
