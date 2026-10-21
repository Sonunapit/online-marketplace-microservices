export const safeParse = (value, fallback = null) => {
  if (!value || value === "undefined" || value === "null") return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};