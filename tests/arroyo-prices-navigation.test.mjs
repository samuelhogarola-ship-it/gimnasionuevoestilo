import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const pageCases = [
  {
    path: "../arroyo/index.html",
    linkLabel: /Horarios\s*<br>\s*y tarifas/i,
    targetId: "tarifas",
  },
  {
    path: "../en/arroyo/index.html",
    linkLabel: /Hours\s*<br>\s*and prices/i,
    targetId: "prices",
  },
];

test("the Arroyo prices navigation opens the prices section directly", async () => {
  for (const { path, linkLabel, targetId } of pageCases) {
    const html = await readFile(new URL(path, import.meta.url), "utf8");
    const navigation = html.match(/<nav class="site-nav"[\s\S]*?<\/nav>/i)?.[0];

    assert.ok(navigation, `${path} must have a primary navigation`);

    const priceLink = [
      ...navigation.matchAll(/<a\s+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi),
    ].find(([, , label]) => linkLabel.test(label));

    assert.ok(priceLink, `${path} must have a prices navigation link`);
    assert.equal(priceLink[1], `#${targetId}`);
    assert.match(html, new RegExp(`id="${targetId}"`));
  }
});
