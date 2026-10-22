import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const pageCases = [
  {
    path: "../arroyo/index.html",
    linkLabel: /Horarios\s*<br>\s*y tarifas/i,
    targetId: "tarifas",
    expectedHours: [
      "Lunes a viernes",
      "6:30-23:00",
      "Sábados",
      "9:00-14:00",
      "Domingos",
      "Cerrado",
    ],
    forbiddenCopy: /Mismo precio para mujeres y hombres/i,
  },
  {
    path: "../en/arroyo/index.html",
    linkLabel: /Hours\s*<br>\s*and prices/i,
    targetId: "prices",
    expectedHours: [
      "Monday to Friday",
      "6:30-23:00",
      "Saturday",
      "9:00-14:00",
      "Sunday",
      "Closed",
    ],
    forbiddenCopy: /The same price for women and men/i,
  },
];

test("the Arroyo hours and prices navigation shows both at its target", async () => {
  for (const {
    path,
    linkLabel,
    targetId,
    expectedHours,
    forbiddenCopy,
  } of pageCases) {
    const html = await readFile(new URL(path, import.meta.url), "utf8");
    const navigation = html.match(/<nav class="site-nav"[\s\S]*?<\/nav>/i)?.[0];

    assert.ok(navigation, `${path} must have a primary navigation`);

    const priceLink = [
      ...navigation.matchAll(/<a\s+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi),
    ].find(([, , label]) => linkLabel.test(label));

    assert.ok(priceLink, `${path} must have a prices navigation link`);
    assert.equal(priceLink[1], `#${targetId}`);

    const targetSection = html.match(
      new RegExp(`<section[^>]*id="${targetId}"[\\s\\S]*?<\\/section>`, "i"),
    )?.[0];
    assert.ok(targetSection, `${path} must have the linked section`);

    const visibleText = targetSection
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ");
    for (const expected of expectedHours) {
      assert.match(visibleText, new RegExp(expected, "i"));
    }
    assert.doesNotMatch(html, forbiddenCopy);
  }
});
