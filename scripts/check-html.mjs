import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const ignoredDirs = new Set([".git", ".husky", ".tools", "node_modules"]);
const errors = [];

function walk(dir) {
  const entries = readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (!ignoredDirs.has(entry.name)) {
        files.push(...walk(path.join(dir, entry.name)));
      }
      continue;
    }

    if (entry.isFile() && entry.name.endsWith(".html")) {
      files.push(path.join(dir, entry.name));
    }
  }

  return files;
}

function lineForOffset(text, offset) {
  return text.slice(0, offset).split("\n").length;
}

function checkLocalAsset(file, attr, value, offset) {
  if (!value.startsWith("/") || value.startsWith("//")) return;
  if (value.startsWith("/en/") || value.includes("#") || value.includes("?"))
    return;

  const normalized = value.replace(/^\/+/, "");
  const target = path.join(root, normalized);
  if (!existsSync(target)) {
    errors.push(
      `${path.relative(root, file)}:${lineForOffset(readFileSync(file, "utf8"), offset)} ${attr} target does not exist: ${value}`,
    );
  }
}

for (const file of walk(root)) {
  const rel = path.relative(root, file);
  const html = readFileSync(file, "utf8");

  if (!/<title>[^<]+<\/title>/i.test(html)) {
    errors.push(`${rel}: missing <title>`);
  }

  for (const match of html.matchAll(
    /<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/g,
  )) {
    try {
      JSON.parse(match[1]);
    } catch (error) {
      errors.push(
        `${rel}:${lineForOffset(html, match.index)} invalid JSON-LD: ${error.message}`,
      );
    }
  }

  for (const match of html.matchAll(/\b(src|href)="([^"]+)"/g)) {
    const [, attr, value] = match;
    checkLocalAsset(file, attr, value, match.index);
  }
}

if (statSync(path.join(root, "sitemap.xml")).isFile()) {
  const sitemap = readFileSync(path.join(root, "sitemap.xml"), "utf8");
  for (const match of sitemap.matchAll(
    /<loc>https:\/\/gimnasionuevoestilo\.com\/([^<]*)<\/loc>/g,
  )) {
    const route = match[1];
    const target = route === "" ? "index.html" : path.join(route, "index.html");
    if (!existsSync(path.join(root, target))) {
      errors.push(`sitemap.xml: route missing local page: /${route}`);
    }
  }
}

if (errors.length) {
  console.error("HTML checks failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("HTML checks OK");
