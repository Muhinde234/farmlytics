// i18n/index.ts
import "server-only";
import { Dictionary } from "@/types/Dictionary";

const dictionaries = {
  en: () => import("../messages/en.json").then((module) => module.default),
  fr: () => import("../messages/fr.json").then((module) => module.default),
  rw: () => import("../messages/rw.json").then((module) => module.default),
};

export const getDictionary = async (locale: string): Promise<Dictionary> => {
  const loader =
    dictionaries[locale as keyof typeof dictionaries] ?? dictionaries["en"];
  return loader();
};