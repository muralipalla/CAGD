#!/usr/bin/env node
"use strict";

// Regenerate the online bank from the reviewed LaTeX source copied beside it.
// Run: node tooling/generate-gdt-question-bank.js
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const bankDir = process.argv[3] ? path.resolve(process.argv[3]) : path.join(root, "self-assessment-quizzes", "gd-and-t-question-bank");
const sourcePath = process.argv[2] ? path.resolve(process.argv[2]) : path.join(bankDir, "question-bank.tex");
const source = fs.readFileSync(sourcePath, "utf8").replace(/\r\n/g, "\n");
const unknownCommands = new Set();

function escapeHtml(value) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function readBraced(value, open) {
  if (value[open] !== "{") throw new Error(`Expected { at ${open}`);
  let depth = 0;
  for (let i = open; i < value.length; i += 1) {
    if (value[i] === "{" && value[i - 1] !== "\\") depth += 1;
    if (value[i] === "}" && value[i - 1] !== "\\") depth -= 1;
    if (depth === 0) return { content: value.slice(open + 1, i), end: i + 1 };
  }
  throw new Error(`Unclosed { at ${open}`);
}

function renderInline(value) {
  let html = "";
  for (let i = 0; i < value.length;) {
    const ch = value[i];
    if (ch === "$" && value[i - 1] !== "\\") {
      const end = value.indexOf("$", i + 1);
      if (end < 0) throw new Error(`Unclosed inline math: ${value.slice(i)}`);
      html += `\\(${escapeHtml(value.slice(i + 1, end))}\\)`;
      i = end + 1;
      continue;
    }
    if (ch === "\\") {
      const match = /^\\([A-Za-z]+|.)/.exec(value.slice(i));
      if (!match) throw new Error(`Stray backslash in ${value}`);
      const name = match[1];
      i += match[0].length;
      if (["textbf", "textsc", "emph"].includes(name)) {
        const parsed = readBraced(value, i);
        const tag = name === "textbf" ? "strong" : name === "emph" ? "em" : "span";
        const className = name === "textsc" ? ' class="small-caps"' : "";
        html += `<${tag}${className}>${renderInline(parsed.content)}</${tag}>`;
        i = parsed.end;
        continue;
      }
      const replacements = {
        dia: "⌀", MMC: '<span class="material-symbol">Ⓜ</span>',
        MMB: '<span class="material-symbol">Ⓜ</span>',
        LMC: '<span class="material-symbol">Ⓛ</span>',
        PZT: '<span class="material-symbol">Ⓟ</span>',
        "&": "&amp;", "%": "%", ",": "&#8239;", " ": " ",
        quad: " ", qquad: "  ",
        small: "", noindent: "", normalls: "",
        "\\": "<br>",
      };
      if (!(name in replacements)) unknownCommands.add(name);
      html += replacements[name] ?? escapeHtml(match[0]);
      continue;
    }
    if (value.startsWith("---", i)) { html += "—"; i += 3; continue; }
    if (value.startsWith("--", i)) { html += "–"; i += 2; continue; }
    if (/\s/.test(ch)) {
      html += " ";
      while (i < value.length && /\s/.test(value[i])) i += 1;
      continue;
    }
    html += escapeHtml(ch);
    i += 1;
  }
  return html.trim();
}

function renderParagraphs(value) {
  return value.trim().split(/\n\s*\n/).filter(Boolean).map(p => `<p>${renderInline(p.trim())}</p>`).join("\n");
}

function renderList(block, kind, questionNumber) {
  const begin = /^\\begin\{(?:enumerate|itemize)\}(?:\[[^\]]*\])?/.exec(block);
  const end = `\\end{${kind}}`;
  const content = block.slice(begin[0].length, -end.length);
  const items = content.split(/\\item\s*/).slice(1).map(item => {
    const marks = /\\qmarks\{(\d+)\}/.exec(item);
    const clean = item.replace(/\\qmarks\{\d+\}/g, "").trim();
    return `<li>${renderBlocks(clean, questionNumber)}${marks ? ` <span class="marks">${marks[1]} ${marks[1] === "1" ? "mark" : "marks"}</span>` : ""}</li>`;
  });
  const numbered = kind === "enumerate" && /\\arabic/.test(begin[0]);
  const tag = kind === "itemize" ? "ul" : "ol";
  return `<${tag} class="${kind === "itemize" ? "feature-list" : numbered ? "numbered-list" : "parts"}"${tag === "ol" && !numbered ? ' type="a"' : ""}>\n${items.join("\n")}\n</${tag}>`;
}

function renderTable(center, questionNumber) {
  const match = /\\begin\{tabular\}\{[^\n]+\}([\s\S]*?)\\end\{tabular\}/.exec(center);
  if (!match) throw new Error(`Question ${questionNumber}: malformed table`);
  const rows = match[1]
    .replace(/\\(?:toprule|midrule|bottomrule|small)\b/g, "")
    .split(/\\\\(?:\[[^\]]*\])?/)
    .map(row => row.trim())
    .filter(Boolean)
    .map(row => row.split("&").map(cell => renderInline(cell.trim())));
  if (rows.length < 2) throw new Error(`Question ${questionNumber}: table has no data`);
  const width = rows[0].length;
  if (rows.some(row => row.length !== width)) throw new Error(`Question ${questionNumber}: inconsistent table columns`);
  const head = `<thead><tr>${rows[0].map(cell => `<th scope="col">${cell}</th>`).join("")}</tr></thead>`;
  const body = `<tbody>${rows.slice(1).map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join("")}</tr>`).join("")}</tbody>`;
  return `<div class="table-scroll" role="region" aria-label="Question ${questionNumber} data table" tabindex="0"><table>${head}${body}</table></div>`;
}

function renderFrames(center) {
  const clean = center.replace(/\\(?:small|noindent)\b/g, "").trim();
  const rows = clean.split(/\\\\(?:\[[^\]]*\])?/).map(row => row.trim()).filter(Boolean);
  const result = [];
  for (const row of rows) {
    const pieces = row.split(/\\qquad\s*or\s*\\qquad/);
    for (let p = 0; p < pieces.length; p += 1) {
      if (p) result.push('<span class="frame-or">or</span>');
      const segment = pieces[p].replace(/\\hspace\{[^}]+\}/g, "");
      const cells = [];
      for (let i = 0; i < segment.length;) {
        const next = segment.indexOf("\\fc{", i);
        if (next < 0) break;
        const parsed = readBraced(segment, next + 3);
        cells.push(`<span class="frame-cell">${renderInline(parsed.content)}</span>`);
        i = parsed.end;
      }
      if (cells.length) result.push(`<div class="feature-control-frame" role="group" aria-label="Feature control frame">${cells.join("")}</div>`);
    }
  }
  return `<div class="frame-group">${result.join("\n")}</div>`;
}

function renderBlocks(body, questionNumber) {
  const clean = body.replace(/^%[^\n]*\n/gm, "").replace(/\\end\{document\}/g, "").trim();
  const pattern = /\\begin\{(center|enumerate|itemize)\}(?:\[[^\]]*\])?[\s\S]*?\\end\{\1\}|\\\[[\s\S]*?\\\]/g;
  const output = [];
  let cursor = 0;
  let match;
  while ((match = pattern.exec(clean))) {
    const before = clean.slice(cursor, match.index);
    if (before.trim()) output.push(renderParagraphs(before));
    const block = match[0];
    if (block.startsWith("\\[")) {
      output.push(`<div class="display-math">\\[${escapeHtml(block.slice(2, -2).trim())}\\]</div>`);
    } else if (match[1] === "center") {
      const middle = block.slice("\\begin{center}".length, -"\\end{center}".length);
      output.push(middle.includes("\\begin{tabular}") ? renderTable(middle, questionNumber) : renderFrames(middle));
    } else {
      output.push(renderList(block, match[1], questionNumber));
    }
    cursor = pattern.lastIndex;
  }
  const tail = clean.slice(cursor);
  if (tail.trim()) output.push(renderParagraphs(tail));
  return output.join("\n");
}

const questionRegex = /^\\question\{([^{}]+)\}\{Level (I{1,3})\}/gm;
const matches = [...source.matchAll(questionRegex)];
if (matches.length !== 30) throw new Error(`Expected 30 questions; found ${matches.length}`);
const questions = matches.map((match, index) => {
  const next = matches[index + 1]?.index ?? source.length;
  const body = source.slice(match.index + match[0].length, next);
  const marks = [...body.matchAll(/\\qmarks\{(\d+)\}/g)].reduce((sum, m) => sum + Number(m[1]), 0);
  if (marks !== 10) throw new Error(`Question ${index + 1} has ${marks} marks, expected 10`);
  return { number: index + 1, title: match[1], level: match[2], body };
});

const coverageBody = /\\begin\{longtable\}[\s\S]*?\\endhead([\s\S]*?)\\bottomrule/.exec(source)?.[1] ?? "";
const coverage = new Map([...coverageBody.matchAll(/^\s*(\d+)\s*&\s*(.*?)\s*&\s*(.*?)\s*&\s*(I{1,3})\\\\/gm)]
  .map(m => [Number(m[1]), { topic: m[2].trim(), skill: m[3].trim(), level: m[4] }]));
if (coverage.size !== 30) throw new Error(`Expected 30 coverage entries; found ${coverage.size}`);

const levelInfo = {
  I: ["Foundation and interpretation", "1–10"],
  II: ["Applied analysis and assembly", "11–20"],
  III: ["Advanced synthesis and inspection", "21–30"],
};
const instructionsSection = /\\section\*\{Instructions and conventions\}([\s\S]*?)\\section\*\{Difficulty and coverage map\}/.exec(source)?.[1];
if (!instructionsSection) throw new Error("Missing instructions section");
const instructionOpen = instructionsSection.indexOf("\\instructionbox{");
if (instructionOpen < 0) throw new Error("Missing instruction box");
const instructionText = readBraced(instructionsSection, instructionOpen + "\\instructionbox".length);
const instructionBody = instructionText.content.replace(/^%[^\n]*\n/gm, "").trim();
const instructionList = renderBlocks(instructionsSection.slice(instructionText.end), 0);
const toc = Object.entries(levelInfo).map(([level, [description, range]]) => `
  <section class="level-index" aria-labelledby="index-level-${level}">
    <h3 id="index-level-${level}">Level ${level} <span>${description}</span></h3>
    <p class="level-range">Questions ${range}</p>
    <ol start="${level === "I" ? 1 : level === "II" ? 11 : 21}">${questions.filter(q => q.level === level).map(q => `
      <li><a href="#question-${q.number}">${escapeHtml(q.title)}</a><small>${renderInline(coverage.get(q.number).skill)}</small></li>`).join("")}
    </ol>
  </section>`).join("");

const questionSections = Object.entries(levelInfo).map(([level, [description]]) => `
  <section class="section compact question-level" id="level-${level}" aria-labelledby="level-${level}-title">
    <div class="section-heading"><div><p class="section-kicker">Questions ${level === "I" ? "1–10" : level === "II" ? "11–20" : "21–30"}</p><h2 id="level-${level}-title">Level ${level}: ${description}</h2></div><a class="level-back" href="#contents">Back to contents ↑</a></div>
    ${questions.filter(q => q.level === level).map(q => `
    <article class="question-card" id="question-${q.number}" aria-labelledby="question-${q.number}-title">
      <div class="question-heading"><div><p class="question-number">Question ${q.number} · 10 marks</p><h3 id="question-${q.number}-title">${escapeHtml(q.title)}</h3></div><span class="level-badge">Level ${level}</span></div>
      <div class="question-content">${renderBlocks(q.body, q.number)}</div>
    </article>`).join("\n")}
  </section>`).join("\n");

const output = `<!doctype html>
<html lang="en">
<head>
  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-V7VVFX9X21"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-V7VVFX9X21');
  </script>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="Thirty graded GD&amp;T questions on form, orientation, position, datum systems, profile, runout, assembly, functional gaging, and inspection.">
  <meta name="theme-color" content="#fdf6ec">
  <title>CAD · GD&amp;T Question Bank</title>
  <link rel="stylesheet" href="../../assets/css/style.css">
  <link rel="stylesheet" href="question-bank.css">
  <script src="../../assets/js/main.js" defer></script>
  <script>window.MathJax={tex:{inlineMath:[["\\\\(","\\\\)"]],displayMath:[["\\\\[","\\\\]"]]},options:{skipHtmlTags:["script","noscript","style","textarea","pre","code"]}};</script>
  <script src="https://cdn.jsdelivr.net/npm/mathjax@3.2.2/es5/tex-chtml.js" defer></script>
</head>
<body class="question-bank-page">
  <a class="skip-link" href="#main-content">Skip to content</a>
  <header class="page-header">
    <nav class="top-nav" aria-label="Main navigation">
      <a class="brand" href="../../index.html" aria-label="CAD home"><span class="brand-mark" aria-hidden="true"></span><span class="brand-copy"><strong>CAD</strong></span></a>
      <div class="nav-links"><a href="../../cad-modules/index.html">Mathematical Foundations</a><a href="../../programming-modules/index.html">Programming Modules</a><a href="../index.html" aria-current="page">Self Assessment</a></div>
    </nav>
    <div class="page-hero">
      <ol class="breadcrumb" aria-label="Breadcrumb"><li><a href="../../index.html">Home</a></li><li><a href="../index.html">Self Assessment</a></li><li aria-current="page">GD&amp;T Question Bank</li></ol>
      <p class="eyebrow">Graded practice</p>
      <h1>GD&amp;T <em>Question Bank</em></h1>
      <p class="page-lead">Thirty ten-mark problems, from reading feature-control frames to designing datum schemes and functional inspection plans.</p>
      <div class="bank-actions"><a class="button primary" href="#contents">Browse questions</a><a class="button secondary" href="question-bank.pdf" download>Download PDF</a><a class="button ghost" href="../gd-and-t-concepts/index.html">Try the concepts quiz</a></div>
    </div>
  </header>
  <main id="main-content">
    <section class="section compact" id="instructions" aria-labelledby="instructions-title">
      <div class="instructions-panel"><p class="section-kicker">Before you begin</p><h2 id="instructions-title">Instructions and conventions</h2>
      <p>${renderInline(instructionBody)}</p>
      ${instructionList}
      <p class="practice-note">Allow about 25–30 minutes <strong>per question</strong>. Each question is worth 10 marks. This bank contains questions only; use the <a href="../gd-and-t-concepts/index.html">concepts quiz</a> for immediate feedback.</p>
      <div class="bank-resource-links"><a href="question-bank.pdf" download>Printable PDF</a><a href="question-bank.tex" download>LaTeX source</a><a href="../../cad-modules/cad-workflow/index.html#gd-and-t">Review GD&amp;T lesson</a></div></div>
    </section>
    <section class="section compact" id="contents" aria-labelledby="contents-title">
      <div class="section-heading"><div><p class="section-kicker">Choose a question</p><h2 id="contents-title">Difficulty and coverage</h2></div><p>Use the levels to move from interpretation to design and inspection.</p></div>
      <div class="level-index-grid">${toc}</div>
    </section>
    ${questionSections}
  </main>
  <footer class="site-footer"><p><strong>CAD</strong> · GD&amp;T Question Bank</p><ul class="footer-nav" aria-label="Footer navigation"><li><a href="../../index.html">Home</a></li><li><a href="../index.html">Self Assessment</a></li><li><a href="../gd-and-t-concepts/index.html">GD&amp;T Concepts Quiz</a></li><li><a href="#contents">Question contents</a></li></ul><p><a href="../../cad-modules/references/index.html#licensing">Licensing and Attributions</a> · Created by Murali Palla · <span data-year>2026</span></p></footer>
</body>
</html>
`;

if (unknownCommands.size) throw new Error(`Unhandled LaTeX commands outside math: ${[...unknownCommands].join(", ")}`);
fs.writeFileSync(path.join(bankDir, "index.html"), output.replace(/[ \t]+$/gm, ""), "utf8");
console.log(`Generated ${questions.length} questions from question-bank.tex`);
