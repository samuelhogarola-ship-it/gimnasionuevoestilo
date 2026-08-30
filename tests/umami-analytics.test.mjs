import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import vm from "node:vm";

const projectRoot = process.cwd();
const bootstrapPath = path.join(projectRoot, "assets/js/umami-analytics.js");
const personalHost = "https://analytics.187.124.55.36.sslip.io";

function collectHtmlFiles(directory = projectRoot) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name === ".git" || entry.name === "node_modules") return [];
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return collectHtmlFiles(fullPath);
    return entry.isFile() && entry.name.endsWith(".html") ? [fullPath] : [];
  });
}

async function runBootstrap(config) {
  const source = readFileSync(bootstrapPath, "utf8");
  const appended = [];
  const document = {
    createElement() {
      return { dataset: {}, defer: false };
    },
    head: {
      appendChild(element) {
        appended.push(element);
      },
    },
    querySelector() {
      return null;
    },
  };
  const window = {};
  const context = vm.createContext({
    console,
    document,
    fetch: async () => ({ json: async () => config, ok: true }),
    window,
  });

  vm.runInContext(source, context);
  await window.NuevoEstiloUmami.ready;
  return appended[0] ?? null;
}

test("loads personal Umami and covers every HTML entry", async () => {
  const htmlFiles = collectHtmlFiles();
  const withoutSiteJs = htmlFiles
    .filter(
      (file) => !readFileSync(file, "utf8").includes("/assets/js/site.js"),
    )
    .map((file) => path.relative(projectRoot, file));
  const sharedSiteScript = readFileSync(
    path.join(projectRoot, "assets/js/site.js"),
    "utf8",
  );
  const tracker = await runBootstrap({
    hostUrl: "https://analytics.187.124.55.36.sslip.io",
    websiteId: "nuevo-estilo-test-id",
  });

  assert.equal(htmlFiles.length, 31);
  assert.deepEqual(withoutSiteJs, []);
  assert.match(sharedSiteScript, /\/assets\/js\/umami-analytics\.js/);
  assert.equal(
    tracker.src,
    "https://analytics.187.124.55.36.sslip.io/script.js",
  );
  assert.equal(tracker.dataset.websiteId, "nuevo-estilo-test-id");
});

test("versioned production config loads the real Gimnasio Nuevo Estilo website", async () => {
  const config = JSON.parse(
    readFileSync(path.join(projectRoot, "umami-config.json"), "utf8"),
  );
  const tracker = await runBootstrap(config);

  assert.equal(config.hostUrl, personalHost);
  assert.equal(config.websiteId, "0e7e29b4-169d-4d9a-97c3-6051087f405b");
  assert.equal(tracker?.src, personalHost + "/script.js");
  assert.equal(tracker?.dataset.websiteId, config.websiteId);
});

test("fails closed without a website id or with the wrong host", async () => {
  const tracker = await runBootstrap({
    hostUrl: "https://analytics.187.124.55.36.sslip.io",
    websiteId: "",
  });
  const wrongHostTracker = await runBootstrap({
    hostUrl: "https://analytics.2.24.10.239.sslip.io",
    websiteId: "0e7e29b4-169d-4d9a-97c3-6051087f405b",
  });

  assert.equal(tracker, null);
  assert.equal(wrongHostTracker, null);
});

test("deployment CSP permits only the personal Umami host", () => {
  const htaccess = readFileSync(path.join(projectRoot, ".htaccess"), "utf8");
  const csp = htaccess.match(/Content-Security-Policy "([^"]+)"/)?.[1] ?? "";

  assert.match(csp, new RegExp(`script-src[^;]*${personalHost}`));
  assert.match(csp, new RegExp(`connect-src[^;]*${personalHost}`));
});

test("legal pages disclose the cookieless self-hosted analytics", () => {
  for (const relativePath of ["legal/index.html", "en/legal/index.html"]) {
    const legal = readFileSync(path.join(projectRoot, relativePath), "utf8");
    assert.match(legal, /Umami/i);
    assert.match(
      legal,
      /no utiliza(?: ni instala)? cookies|does not (?:use|set)(?: or (?:use|set))? cookies/i,
    );
  }
});

test("the normal project check runs the Umami regression test", () => {
  const packageJson = JSON.parse(
    readFileSync(path.join(projectRoot, "package.json"), "utf8"),
  );

  assert.equal(
    packageJson.scripts["test:umami"],
    "node --test tests/umami-analytics.test.mjs",
  );
  assert.match(packageJson.scripts.check, /test:umami/);
});
