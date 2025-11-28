import pino from "pino";

const isDevelopment = process.env.NODE_ENV === "development";

const logger = pino({
  level: process.env.LOG_LEVEL || (isDevelopment ? "debug" : "info"),
  transport: isDevelopment
    ? {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "yyyy-mm-dd HH:MM:ss",
          ignore: "pid,hostname",
        },
      }
    : undefined,
  // aquí puedes agregar base fields, redacción, etc.
  base: {
    env: process.env.NODE_ENV,
  },
  // redact: { paths: ["password", "token"] }  // ejemplo si tienes campos sensibles
});

export default logger;
