import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

let isLoaded = false;

function parseEnvFile(content: string): Record<string, string> {
  const parsed: Record<string, string> = {};

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();

    if (!line || line.startsWith("#")) {
      continue;
    }

    const separatorIndex = line.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim().replace(/^"|"$/g, "");

    parsed[key] = value;
  }

  return parsed;
}

export function loadEnvironment(): void {
  if (isLoaded) {
    return;
  }

  const candidates = [
    resolve(process.cwd(), ".env"),
    resolve(process.cwd(), ".env.local"),
  ];

  for (const filePath of candidates) {
    if (!existsSync(filePath)) {
      continue;
    }

    const content = readFileSync(filePath, "utf-8");
    const parsed = parseEnvFile(content);

    for (const [key, value] of Object.entries(parsed)) {
      if (process.env[key] === undefined) {
        process.env[key] = value;
      }
    }
  }

  isLoaded = true;
}
