export function s(strings: TemplateStringsArray, ...params: any[]): string {
  return strings
    .map((s, i) => {
      if (i < params.length) {
        return `${s}#${JSON.stringify(params[i])}`;
      }
      return s;
    })
    .join("");
}
