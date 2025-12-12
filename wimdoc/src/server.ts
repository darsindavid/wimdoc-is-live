// src/server.ts
import dotenv from "dotenv";
dotenv.config();

import http, { Server } from "http";
import app from "./app.js";
import { db } from "./core/db.js";

import { fileURLToPath } from "url";
import path from "path";

const HOST = process.env.HOST || "0.0.0.0";
const PORT = Number(process.env.PORT || 4000);
const NODE_ENV = process.env.NODE_ENV || "development";

function prettyLog(...args: any[]) {
  console.log("[wimdoc-backend]", ...args);
}

/* -------------------------------------------------------
   DATABASE HEALTH CHECK
-------------------------------------------------------- */
async function checkDatabaseConnection(timeoutMs = 2500) {
  try {
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("DB ping timeout")), timeoutMs)
    );

    await Promise.race([db.query("SELECT 1"), timeout]);
    prettyLog("Database connection OK");
    return true;
  } catch (err) {
    prettyLog("Database connectivity check failed:", (err as Error).message);
    return false;
  }
}

/* -------------------------------------------------------
   SERVER ERROR HANDLER
-------------------------------------------------------- */
function onServerError(err: NodeJS.ErrnoException) {
  if (err.syscall !== "listen") throw err;

  const bind = typeof PORT === "string" ? `Pipe ${PORT}` : `Port ${PORT}`;
  switch (err.code) {
    case "EACCES":
      prettyLog(`${bind} requires elevated privileges`);
      process.exit(1);
    case "EADDRINUSE":
      prettyLog(`${bind} is already in use`);
      process.exit(1);
    default:
      throw err;
  }
}

/* -------------------------------------------------------
   START SERVER
-------------------------------------------------------- */

async function start() {
  prettyLog(`Starting wimdoc-backend (${NODE_ENV})...`);

  const dbOk = await checkDatabaseConnection();
  if (!dbOk && NODE_ENV === "production") {
    prettyLog("Database not available in production — aborting startup.");
    process.exit(1);
  }

  const server: Server = http.createServer(app);

  server.on("error", onServerError);

  server.listen(PORT, HOST, () => {
    prettyLog(`Server listening on http://${HOST}:${PORT}`);
    prettyLog(`NODE_ENV=${NODE_ENV}`);
  });

  /* -------------------------------------------------------
     GRACEFUL SHUTDOWN
  -------------------------------------------------------- */
  const shutdown = (signal: string) => async () => {
    prettyLog(`Received ${signal} — gracefully shutting down...`);

    try {
      server.close(async (err) => {
        if (err) {
          prettyLog("Error closing server:", err);
          process.exit(1);
        }

        prettyLog("Closing DB pool...");
        await db.end();

        prettyLog("Shutdown complete.");
        process.exit(0);
      });
    } catch (e) {
      prettyLog("Shutdown error:", (e as Error).message);
      process.exit(1);
    }
  };

  process.on("SIGTERM", shutdown("SIGTERM"));
  process.on("SIGINT", shutdown("SIGINT"));

  process.on("uncaughtException", (err) => {
    prettyLog("Uncaught exception:", err);
    process.exit(1);
  });

  process.on("unhandledRejection", (reason) => {
    prettyLog("Unhandled rejection:", reason);
  });

  return server;
}

/* -------------------------------------------------------
   AUTO-START WHEN EXECUTED DIRECTLY (ESM SAFE)
-------------------------------------------------------- */

// Convert module URL to actual file path
const currentFile = fileURLToPath(import.meta.url);
// Resolve the script that Node executed
const executedFile = path.resolve(process.cwd(), process.argv[1] || "");

// Compare absolute paths
const isMainModule = currentFile === executedFile;

if (isMainModule) {
  start().catch((err) => {
    prettyLog("Failed to start server:", err);
    process.exit(1);
  });
}

/* -------------------------------------------------------
   EXPORT FOR TESTS/TOOLS
-------------------------------------------------------- */
export default { start };
