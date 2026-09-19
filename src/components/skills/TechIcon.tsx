import type { SimpleIcon } from "simple-icons";

type TechIconProps = {
  icon: SimpleIcon;
  size?: number;
  label: string;
};

export default function TechIcon({
  icon,
  size = 24,
  label,
}: TechIconProps) {
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
