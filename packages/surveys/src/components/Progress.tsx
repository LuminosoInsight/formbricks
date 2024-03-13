export default function Progress({
  progress,
  brandColor,
  idx,
  length,
}: {
  progress: number;
  brandColor: string;
  idx?: number;
  length?: number;
}) {
  return (
    <div className="flex h-4 w-full items-center rounded-full bg-slate-200 text-xs font-bold">
      <div
        className="transition-width z-20 flex h-4 items-center justify-end rounded-full pr-[10px] text-white duration-500"
        style={{ backgroundColor: brandColor, width: `${Math.floor(progress * 100)}%` }}>
        {progress !== 1 && idx !== undefined && `${idx + 1} of`}
      </div>
      {progress !== 1 && idx !== undefined && length !== undefined && (
        <span style={{ color: brandColor }} className="ml-[5px]">
          {length}
        </span>
      )}
    </div>
  );
}
