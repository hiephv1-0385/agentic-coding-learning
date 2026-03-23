import sanitize from "sanitize-html";

const ALLOWED_TAGS = [
  "p",
  "strong",
  "em",
  "s",
  "ol",
  "li",
  "a",
  "blockquote",
  "span",
];

const ALLOWED_ATTRIBUTES: Record<string, string[]> = {
  a: ["href", "target", "rel"],
  span: ["data-mention", "data-id"],
};

export function sanitizeKudosContent(html: string): string {
  return sanitize(html, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: ALLOWED_ATTRIBUTES,
    disallowedTagsMode: "discard",
  });
}
