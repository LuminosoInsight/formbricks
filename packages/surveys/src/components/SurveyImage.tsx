import { cn } from "../lib/utils.ts";
import { useState } from "preact/hooks";

type Props = {
  image: string;
};

const SurveyImage = ({ image }: Props) => {
  const [imageHovered, setImageHovered] = useState(false);

  const openImageHandler = () => {
    window.open(image, "_blank");
  };

  return (
    <div
      onMouseEnter={() => setImageHovered(true)}
      onMouseLeave={() => setImageHovered(false)}
      onClick={openImageHandler}
      className="relative my-5 w-full cursor-pointer">
      <div
        className={cn(
          "absolute z-[1] flex h-full w-full items-center justify-center bg-[#00000073] transition-all",
          imageHovered ? "opacity-100" : "opacity-0"
        )}>
        <span className="text-white">
          <svg
            viewBox="64 64 896 896"
            focusable="false"
            data-icon="eye"
            width="2em"
            height="2em"
            fill="currentColor"
            aria-hidden="true">
            <path d="M942.2 486.2C847.4 286.5 704.1 186 512 186c-192.2 0-335.4 100.5-430.2 300.3a60.3 60.3 0 000 51.5C176.6 737.5 319.9 838 512 838c192.2 0 335.4-100.5 430.2-300.3 7.7-16.2 7.7-35 0-51.5zM512 766c-161.3 0-279.4-81.8-362.7-254C232.6 339.8 350.7 258 512 258c161.3 0 279.4 81.8 362.7 254C791.5 684.2 673.4 766 512 766zm-4-430c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm0 288c-61.9 0-112-50.1-112-112s50.1-112 112-112 112 50.1 112 112-50.1 112-112 112z"></path>
          </svg>
        </span>
      </div>
      <img src={image} alt={image} />
    </div>
  );
};

export default SurveyImage;
