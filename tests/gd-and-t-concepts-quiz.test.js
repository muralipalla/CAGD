const assert = require("node:assert/strict");
const test = require("node:test");

const { topics, questions, scoreResponses } = require("../self-assessment-quizzes/gd-and-t-concepts/quiz.js");

test("GD&T quiz questions have distinct form IDs and valid answers", () => {
  assert.equal(topics.length, 4);
  assert.equal(questions.length, 20);
  assert.deepEqual(questions.map(question => question.id), Array.from({ length: 20 }, (_, index) => index + 1));
  for (const question of questions) {
    assert.equal(question.options.length, 4);
    assert.ok(Number.isInteger(question.answer) && question.answer >= 0 && question.answer < question.options.length);
    assert.ok(question.explanation.length > 30);
  }
});

test("GD&T quiz scores a complete correct attempt", () => {
  const responses = Object.fromEntries(questions.map(question => [question.id, question.answer]));
  const score = scoreResponses(responses);
  assert.equal(score.answered, 20);
  assert.equal(score.correct, 20);
  assert.ok(score.results.every(result => result.correct));
});

test("GD&T quiz distinguishes wrong and unanswered responses", () => {
  const score = scoreResponses({ 1: 1, 12: 1, 15: 2, 19: 4 });
  assert.equal(score.total, 20);
  assert.equal(score.answered, 3);
  assert.equal(score.correct, 2);
  assert.deepEqual(score.results.slice(0, 1), [{ id: 1, selected: 1, correct: false }]);
  assert.deepEqual(score.results[18], { id: 19, selected: null, correct: false });
});
