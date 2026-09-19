import type { SimpleIcon } from "simple-icons";

import type { LocalTechIcon } from "./tech-icons.types";

type TechIconProps = {
  icon: SimpleIcon | LocalTechIcon;
  size?: number;
  label: string;
};

export default function TechIcon({
  icon,
  size = 24,
  label,
}: TechIconProps) {
  if ("kind" in icon) {
    return (
      <img
        src={icon.src}
        alt=""
        width={size}
        height={size}
        draggable={false}
        loading="eager"
      />
    );
  }

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      focusable="false"
    >
      <title>{label}</title>
      <path d={icon.path} />
    </svg>
  );
}
