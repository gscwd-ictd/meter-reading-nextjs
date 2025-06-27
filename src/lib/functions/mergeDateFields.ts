export default function mergeDateFields(
  a: string | string[] | undefined,
  b: string | string[] | undefined,
): string | string[] | undefined {
  const toFlat = (val: typeof a): string[] => (val === undefined ? [] : Array.isArray(val) ? val : [val]);

  const result = [...toFlat(a), ...toFlat(b)];

  // Remove duplicates and empty values, then return correctly
  const unique = [...new Set(result)].filter(Boolean);

  if (unique.length === 0) return undefined;
  if (unique.length === 1) return unique[0];
  return unique;
}
