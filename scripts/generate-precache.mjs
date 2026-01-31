import { promises as fs } from "fs";
import path from "path";

const ROOT_DIR = process.cwd();
const PUBLIC_DIR = path.join(ROOT_DIR, "public");
const GENERATED_DIR = path.join(ROOT_DIR, "src", "generated");

const CACHE_VERSION = process.env.CACHE_VERSION || "v1";
const MAX_PRECACHE_BYTES =
  Number.parseInt(process.env.PRECACHE_MAX_BYTES || "", 10) || 30 * 1024 * 1024;
const WARMUP_MIN_BYTES =
  Number.parseInt(process.env.WARMUP_MIN_BYTES || "", 10) || 1 * 1024 * 1024;

const PRECACHE_EXTS = new Set([
  "png",
  "jpg",
  "jpeg",
  "webp",
  "svg",
  "gif",
  "mp3",
  "wav",
  "ogg",
  "m4a",
  "aac",
  "woff",
  "woff2",
  "ttf",
  "otf"
]);
const AUDIO_EXTS = new Set(["mp3", "wav", "ogg", "m4a", "aac"]);

const normalizeUrl = (relativePath) => `/${relativePath.split(path.sep).join("/")}`;

const fileExists = async (filePath) => {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
};

const walk = async (dir) => {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(fullPath)));
    } else if (entry.isFile()) {
      files.push(fullPath);
    }
  }

  return files;
};

const generate = async () => {
  const precacheSet = new Set();
  const warmupSet = new Set();

  if (await fileExists(path.join(PUBLIC_DIR, "index.html"))) {
    precacheSet.add("/index.html");
  }

  const files = (await fileExists(PUBLIC_DIR)) ? await walk(PUBLIC_DIR) : [];

  for (const filePath of files) {
    const ext = path.extname(filePath).slice(1).toLowerCase();
    if (!PRECACHE_EXTS.has(ext)) {
      continue;
    }

    const stat = await fs.stat(filePath);
    const url = normalizeUrl(path.relative(PUBLIC_DIR, filePath));

    if (stat.size <= MAX_PRECACHE_BYTES) {
      precacheSet.add(url);
    }

    if (AUDIO_EXTS.has(ext) && (stat.size >= WARMUP_MIN_BYTES || stat.size > MAX_PRECACHE_BYTES)) {
      warmupSet.add(url);
    }
  }

  const precacheUrls = Array.from(precacheSet).sort();
  const warmupUrls = Array.from(warmupSet).sort();

  await fs.mkdir(GENERATED_DIR, { recursive: true });

  await fs.writeFile(
    path.join(PUBLIC_DIR, "sw-precache-urls.js"),
    `self.__PRECACHE_URLS = ${JSON.stringify(precacheUrls, null, 2)};\n`
  );

  await fs.writeFile(
    path.join(PUBLIC_DIR, "sw-warmup-urls.js"),
    `self.__WARMUP_URLS = ${JSON.stringify(warmupUrls, null, 2)};\n`
  );

  await fs.writeFile(
    path.join(PUBLIC_DIR, "sw-version.js"),
    `self.__SW_VERSION = ${JSON.stringify(CACHE_VERSION)};\n`
  );

  await fs.writeFile(
    path.join(GENERATED_DIR, "warmupUrls.ts"),
    `export const warmupUrls: string[] = ${JSON.stringify(warmupUrls, null, 2)};\n`
  );
};

generate();
