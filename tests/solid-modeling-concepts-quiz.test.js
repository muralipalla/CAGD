const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const quizDir = path.resolve(__dirname, "..", "self-assessment-quizzes", "solid-modeling");
const { topics, questions, scoreResponses } = require(path.join(quizDir, "quiz.js"));

test("Solid Modeling quiz has distinct, substantive questions with varied answer positions", () => {
  assert.equal(topics.length, 6);
  assert.equal(questions.length, 24);
  assert.deepEqual(questions.map(question => question.id), Array.from({ length: 24 }, (_, index) => index + 1));
  assert.equal(new Set(questions.map(question => question.prompt)).size, questions.length);
  const keyCounts = [0, 0, 0, 0];
  for (const question of questions) {
    assert.equal(question.options.length, 4, `Question ${question.id}: option count`);
    assert.equal(new Set(question.options).size, 4, `Question ${question.id}: duplicate choices`);
    assert.ok(Number.isInteger(question.answer) && question.answer >= 0 && question.answer < 4);
    assert.ok(question.explanation.length >= 70, `Question ${question.id}: explanation is too brief`);
    keyCounts[question.answer] += 1;
  }
  assert.ok(keyCounts.every(count => count >= 3), `Answer positions are overly concentrated: ${keyCounts}`);
});

test("Solid Modeling quiz scoring handles correct, wrong, unanswered and invalid choices", () => {
  const correct = Object.fromEntries(questions.map(question => [question.id, question.answer]));
  const perfect = scoreResponses(correct);
  assert.equal(perfect.total, 24);
  assert.equal(perfect.answered, 24);
  assert.equal(perfect.correct, 24);

  const mixed = scoreResponses({
    1: (questions[0].answer + 1) % 4,
    2: questions[1].answer,
    3: 99
  });
  assert.equal(mixed.total, 24);
  assert.equal(mixed.answered, 2);
  assert.equal(mixed.correct, 1);
  assert.deepEqual(mixed.results.slice(0, 3).map(result => result.selected), [
    (questions[0].answer + 1) % 4,
    questions[1].answer,
    null
  ]);
});

test("quiz and hub are wired to real lesson sections", () => {
  const quizPage = fs.readFileSync(path.join(quizDir, "index.html"), "utf8");
  const hub = fs.readFileSync(path.resolve(quizDir, "..", "index.html"), "utf8");
  assert.match(quizPage, /<h1>Solid Modeling <em>Quiz<\/em><\/h1>/);
  assert.match(quizPage, /src="quiz\.js"/);
  assert.match(quizPage, /href="quiz\.css"/);
  assert.match(hub, /href="solid-modeling\/index\.html"/);
  assert.doesNotMatch(quizPage, /coming soon|being prepared|placeholder/i);

  for (const href of [
    ...topics.map(topic => topic.lessonHref),
    ...questions.map(question => question.lessonHref).filter(Boolean)
  ]) {
    const [file, fragment] = href.split("#");
    assert.ok(fragment, `Missing lesson section in ${href}`);
    const lesson = fs.readFileSync(path.resolve(quizDir, file), "utf8");
    assert.ok(lesson.includes(`id="${fragment}"`), `Broken lesson link: ${href}`);
  }
});
