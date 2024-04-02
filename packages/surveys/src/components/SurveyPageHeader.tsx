import { cn, isLight } from "../lib/utils.ts";

interface HeaderProps {
  headline?: string;
  subheader?: string;
  brandColor: string;
  pageId: string;
  style?: any;
  required?: boolean;
}

const SurveyPageHeader = ({ headline, subheader, brandColor, pageId, style }: HeaderProps) => {
  return (
    <>
      {(headline || subheader) && (
        <div className="mb-4 shadow-sm">
          <label
            htmlFor={pageId}
            className={cn(
              "border-rad block px-6 py-3 text-2xl font-semibold leading-6 text-slate-900",
              !subheader || !subheader.replace(/<\/?p>|<br\s*\/?>/gi, "").trim() ? "rounded-[0.375rem]" : ""
            )}
            style={{
              backgroundColor: brandColor,
              borderTopLeftRadius: "0.375rem",
              borderTopRightRadius: "0.375rem",
            }}>
            <div
              className={cn("flex justify-between gap-4", isLight(brandColor) ? "text-black" : "text-white")}
              style={style}>
              {headline && headline}
            </div>
          </label>

          {subheader && subheader.replace(/<\/?p>|<br\s*\/?>/gi, "").trim() && (
            <label htmlFor={pageId} className="block bg-white p-6 text-sm font-normal leading-6">
              <div dangerouslySetInnerHTML={{ __html: subheader }} />
            </label>
          )}
        </div>
      )}
    </>
  );
};

export default SurveyPageHeader;
