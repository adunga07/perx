import { useTranslationStore, getLangDict } from "../store/translationStore";

export function useT() {
  const lang = useTranslationStore((s) => s.lang);
  const dict = getLangDict(lang);
  return (key) => dict?.[key] ?? key;
}
