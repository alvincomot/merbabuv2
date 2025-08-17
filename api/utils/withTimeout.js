// api/utils/withTimeout.js
export const withTimeout = (promise, ms = Number(process.env.DB_TIMEOUT_MS || 800)) =>
  Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("DB timeout")), ms)
    ),
  ]);
