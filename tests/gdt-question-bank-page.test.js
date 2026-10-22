const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const bankDir = path.resolve(__dirname, "..", "self-assessment-quizzes", "gd-and-t-question-bank");
const pagePath = path.join(bankDir, "index.html");

test("all 30 graded GD&T questions and downloadable sources are published", () => {
  const html = fs.readFileSync(pagePath, "utf8");
  const tex = fs.readFileSync(path.join(bankDir, "question-bank.tex"), "utf8");
  const pdf = fs.readFileSync(path.join(bankDir, "question-bank.pdf"));
  assert.equal((html.match(/<article class="question-card"/g) || []).length, 30);
  assert.equal((tex.match(/^\\question\{/gm) || []).length, 30);
  for (let i = 1; i <= 30; i += 1) {
    assert.match(html, new RegExp(`id="question-${i}"`));
    assert.match(html, new RegExp(`href="#question-${i}"`));
  }
  assert.equal(pdf.subarray(0, 5).toString(), "%PDF-");
});

test("feature-control frames show GD&T symbols with readable names for assistive technology", () => {
  const html = fs.readFileSync(pagePath, "utf8");
  const cells = [...html.matchAll(/<span class="frame-cell frame-characteristic"><span class="frame-symbol" aria-hidden="true">([^<]+)<\/span><span class="visually-hidden">([^<]+)<\/span><\/span>/g)]
    .map(([, symbol, label]) => `${label}:${symbol}`);
  assert.equal(cells.length, 15);
  assert.equal(cells.filter(cell => cell === "Position:⌖").length, 12);
  for (const cell of ["Straightness:⏤", "Perpendicularity:⟂", "Total runout:⌰"]) {
    assert.ok(cells.includes(cell), `Missing ${cell}`);
  }
  assert.doesNotMatch(html, /<span class="frame-cell"><span class="small-caps">(?:Position|Straightness|Perpendicularity|Total runout)<\/span><\/span>/);
  assert.equal((html.match(/class="frame-row frame-row-inset"/g) || []).length, 2);
});

test("question-bank navigation and downloads resolve within the site", () => {
  const html = fs.readFileSync(pagePath, "utf8");
  const links = [...html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)].map(match => match[1]);
  for (const href of links) {
    if (/^https?:\/\//.test(href)) continue;
    const [relative, fragment] = href.split("#");
    const target = relative ? path.resolve(bankDir, relative) : pagePath;
    assert.ok(fs.existsSync(target), `Missing target for ${href}`);
    if (fragment) {
      const targetHtml = fs.readFileSync(target, "utf8");
      assert.ok(targetHtml.includes(`id="${fragment}"`), `Missing fragment for ${href}`);
    }
  }
});
