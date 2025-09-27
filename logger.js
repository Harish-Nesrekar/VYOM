export const log = (msg, type = "info") => {
  const timestamp = new Date().toISOString();
  console.log(`[${type.toUpperCase()}] ${timestamp}: ${msg}`);
};
