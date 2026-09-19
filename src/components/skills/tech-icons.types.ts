import type { SimpleIcon } from "simple-icons";

export type LocalTechIcon = {
  kind: "image";
  src: string;
  hex: string;
  title: string;
};

export type TechIconData =
  | SimpleIcon
  | LocalTechIcon;
