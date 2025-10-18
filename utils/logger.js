import winston from "winston";

const myCustomLevels = {
  levels: {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    http: 4,
    debug: 5,
  },
  colors: {
    fatal: "red",
    error: "magenta",
    warn: "yellow",
    info: "blue",
    http: "green",
    debug: "gray",
  },
};

winston.addColors(myCustomLevels.colors);

const loggerDev = winston.createLogger({
  levels: myCustomLevels.levels,
  format: winston.format.combine(
    winston.format.colorize({ all: true }),
    winston.format.timestamp(),
    winston.format.printf(
      (info) => `[${info.timestamp}] ${info.level}: ${info.message}`
    )
  ),
  transports: [
    new winston.transports.Console({
      level: "debug",
    }),
  ],
});

const loggerProd = winston.createLogger({
  levels: myCustomLevels.levels,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      level: "info",
    }),
    new winston.transports.File({
      level: "error",
      filename: "./logs/errors.log",
    }),
  ],
});

export const addLogger = (req, res, next) => {
  if (process.env.NODE_ENV === "production") {
    req.logger = loggerProd;
  } else {
    req.logger = loggerDev;
  }

  req.logger.http(
    `${req.method} en ${req.url} - IP: ${req.ip} - User-Agent: ${req.headers["user-agent"]}`
  );

  next();
};
