/**
 * Tag for stylesheets written as template literals. Returns the text exactly
 * as written (backslashes included), so `css\`...\`` reads as CSS to editors
 * and to the build, which turns these modules into the site's one stylesheet
 * (build/plugins.ts).
 */
export const css = (
  strings: TemplateStringsArray,
  ...values: Array<string | number>
): string => String.raw({ raw: strings.raw }, ...values);
