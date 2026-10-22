"use strict";

// Questions use the ASME-style conventions stated on the page. Each has one best answer.
const topics = [
  {
    id: "callouts-and-zones",
    title: "Callouts and tolerance zones",
    description: "Read basic dimensions and identify what geometry a control limits.",
    questions: [
      {
        id: 1,
        prompt: "What does a boxed basic dimension do when locating a hole controlled by position?",
        options: [
          "It gives the theoretically exact hole location; the feature control frame supplies the geometric tolerance.",
          "It adds a second plus/minus tolerance to the feature control frame.",
          "It is an inspection-only reference dimension that may be ignored.",
          "It sets the maximum material size of the hole."
        ],
        answer: 0,
        explanation: "A basic dimension defines the theoretically exact location. The positional tolerance establishes the allowed variation about that location."
      },
      {
        id: 2,
        prompt: "Which reading of a feature control frame is correct?",
        options: [
          "Characteristic, then tolerance and applicable modifiers, then datum references in their stated order.",
          "Datum references first, followed by the tolerance and then the characteristic.",
          "Characteristic and tolerance only; datum order never matters.",
          "Every frame must contain three datum references."
        ],
        answer: 0,
        explanation: "The frame identifies the controlled characteristic and tolerance, then any applicable datum references. Their order establishes precedence."
      },
      {
        id: 3,
        prompt: "A flatness tolerance of 0.05 on a surface creates which zone?",
        options: [
          "Two parallel planes 0.05 apart, with no datum needed.",
          "A cylinder of diameter 0.05 about a datum axis.",
          "Two concentric circles 0.05 apart in every cross-section.",
          "Two parallel planes 0.05 apart, necessarily perpendicular to datum A."
        ],
        answer: 0,
        explanation: "Surface flatness is a form control: the entire controlled surface must fit between two parallel planes separated by the tolerance."
      },
      {
        id: 4,
        prompt: "What does circularity control on a cylindrical surface?",
        options: [
          "Each circular cross-section lies between two concentric circles separated radially by the stated tolerance.",
          "The complete surface lies between two coaxial cylinders.",
          "The cylinder axis stays within a diametrical zone located from datums.",
          "The diameter stays exactly at its nominal value."
        ],
        answer: 0,
        explanation: "Circularity (roundness) is assessed section by section. Cylindricity addresses the entire cylindrical surface."
      },
      {
        id: 5,
        prompt: "For a hole position callout of ⌀0.20 relative to A|B|C, what does the ⌀ indicate?",
        options: [
          "The derived axis must lie in a cylindrical tolerance zone 0.20 in diameter.",
          "The hole size may increase by 0.20.",
          "The axis may move 0.20 radially in any direction.",
          "The hole must have a diameter of exactly 0.20."
        ],
        answer: 0,
        explanation: "The ⌀ prefix makes the position zone cylindrical. Its maximum radial offset from true position is half the zone diameter when the axis is straight and parallel to the zone axis."
      }
    ]
  },
  {
    id: "datums-and-form",
    title: "Datums and form",
    description: "Separate physical datum features from ideal references and apply datum precedence.",
    questions: [
      {
        id: 6,
        prompt: "How do a datum feature and a datum differ?",
        options: [
          "The datum feature is a physical part feature; the datum is a theoretically exact reference established from it.",
          "Both names mean the same imperfect physical surface.",
          "The datum is physical, while the datum feature is a theoretical plane.",
          "Only a hole can be a datum feature."
        ],
        answer: 0,
        explanation: "The selected part feature is real and imperfect. A datum is the ideal point, axis, or plane used as a reference."
      },
      {
        id: 7,
        prompt: "In a simple rigid-part setup, which motions does a primary planar datum constrain?",
        options: [
          "Translation normal to the plane and rotation about the two axes lying in the plane.",
          "All three translations and all three rotations.",
          "Only translation within the plane.",
          "Rotation about the plane normal and two translations within the plane."
        ],
        answer: 0,
        explanation: "A primary plane removes three degrees of freedom: one normal translation and two tilts. Later datums constrain the remaining motions."
      },
      {
        id: 8,
        prompt: "Why can changing a datum sequence from A|B|C to A|C|B change an inspection result?",
        options: [
          "The secondary and tertiary features constrain the remaining motions in a different order.",
          "The feature's size limits automatically swap.",
          "Datum order changes only the printed label, never the setup.",
          "It changes a position control into a flatness control."
        ],
        answer: 0,
        explanation: "Datum precedence controls how the part is established against the datum simulators. Imperfect B and C features can produce a different reference frame when their order changes."
      },
      {
        id: 9,
        prompt: "A planar surface has a perpendicularity tolerance of 0.10 relative to datum plane A. Which zone applies?",
        options: [
          "Two parallel planes 0.10 apart, oriented perpendicular to A.",
          "Two concentric circles whose radii differ by 0.10.",
          "A cylinder 0.10 in diameter at a basic x–y location.",
          "A pair of planes parallel to A with no orientation requirement."
        ],
        answer: 0,
        explanation: "Perpendicularity is an orientation control. For a planar surface, the zone consists of parallel planes separated by 0.10 and oriented 90° to datum A."
      },
      {
        id: 10,
        prompt: "A shaft has size limits ⌀24.90–⌀25.00. All local diameters pass, but its minimum circumscribed cylinder is ⌀25.03. Under ASME Rule 1 with no exception, what is the result?",
        options: [
          "Fail: the surface breaks the perfect-form boundary at the shaft's MMC size of ⌀25.00.",
          "Pass: local diameter measurements are the only size requirement.",
          "Pass if the shaft has any circularity control.",
          "Fail only if a datum is referenced."
        ],
        answer: 0,
        explanation: "For this regular feature of size, the external surface must not exceed the perfect-form envelope at maximum material size. A ⌀25.03 enclosing cylinder exceeds the ⌀25.00 boundary."
      }
    ]
  },
  {
    id: "material-and-position",
    title: "Material condition and position",
    description: "Calculate bonus tolerance and distinguish radial from diametrical error.",
    questions: [
      {
        id: 11,
        prompt: "A hole has size limits ⌀10.00–⌀10.25. What is its maximum material condition (MMC) size?",
        options: ["⌀10.00", "⌀10.25", "⌀10.125", "It depends on the hole's position error."],
        answer: 0,
        explanation: "An internal feature contains the most material when it is smallest, so the hole's MMC size is ⌀10.00."
      },
      {
        id: 12,
        prompt: "A shaft has size limits ⌀19.90–⌀20.00. What is its MMC size?",
        options: ["⌀19.90", "⌀20.00", "⌀19.95", "It depends on the shaft's straightness error."],
        answer: 1,
        explanation: "An external feature contains the most material when it is largest, so the shaft's MMC size is ⌀20.00."
      },
      {
        id: 13,
        prompt: "A hole is ⌀10.00–⌀10.25 with position ⌀0.20 Ⓜ. Its actual mating size is ⌀10.16. What total positional tolerance is available?",
        options: ["⌀0.20", "⌀0.36", "⌀0.16", "⌀0.04"],
        answer: 1,
        explanation: "The hole departs from MMC by 10.16 − 10.00 = 0.16. Add that bonus to the stated 0.20 to obtain a 0.36 diametrical position tolerance."
      },
      {
        id: 14,
        prompt: "For that same ⌀10.00 MMC hole with position ⌀0.20 Ⓜ, what is the hole's virtual-condition boundary diameter?",
        options: ["⌀9.80", "⌀10.20", "⌀10.00", "⌀10.36"],
        answer: 0,
        explanation: "For an internal feature, virtual condition is MMC size minus the stated geometric tolerance at MMC: 10.00 − 0.20 = 9.80."
      },
      {
        id: 15,
        prompt: "A hole axis has coordinate offsets Δx = +0.06 and Δy = −0.08 from true position. What is its diametrical position error?",
        options: ["0.10", "0.14", "0.20", "0.28"],
        answer: 2,
        explanation: "The radial offset is √(0.06² + 0.08²) = 0.10. Diametrical position error is twice that distance: 0.20."
      }
    ]
  },
  {
    id: "inspection-and-application",
    title: "Inspection and application",
    description: "Apply zone shapes and interpret profile and runout measurements.",
    questions: [
      {
        id: 16,
        prompt: "A hole position tolerance is ⌀0.20 with no material-condition modifier. What happens to that geometric tolerance as the hole size changes within its limits?",
        options: [
          "It remains ⌀0.20; no size-dependent bonus is specified.",
          "It grows by the full size tolerance automatically.",
          "It becomes zero at the hole's MMC size.",
          "It changes to a radial tolerance of 0.20."
        ],
        answer: 0,
        explanation: "Without an MMC or LMC modifier on this geometric tolerance, it applies regardless of feature size; the allowed zone diameter stays 0.20."
      },
      {
        id: 17,
        prompt: "For the position of a slot's derived median plane, with tolerance 0.30 and no ⌀ symbol, which zone is appropriate?",
        options: [
          "Two parallel planes 0.30 apart about the theoretically exact median plane.",
          "A cylindrical zone 0.30 in diameter.",
          "Two concentric circles separated by 0.30.",
          "A sphere of radius 0.30 around the slot midpoint."
        ],
        answer: 0,
        explanation: "A slot is a noncylindrical feature of size. In this simplified position example, its derived median plane is controlled between two parallel planes, not by a cylindrical zone."
      },
      {
        id: 18,
        prompt: "A surface profile tolerance of 0.80 is equally disposed about the true profile. What are its signed normal limits?",
        options: ["−0.40 to +0.40", "−0.80 to +0.80", "0 to +0.80", "−0.20 to +0.60"],
        answer: 0,
        explanation: "An equally disposed 0.80 total profile zone extends 0.40 on each side of the true profile, measured along the local normal."
      },
      {
        id: 19,
        prompt: "At one section, radial indicator readings about datum axis A range from −0.014 to +0.041. Does the section meet circular runout 0.050?",
        options: [
          "No; total indicator variation is 0.055.",
          "Yes; the maximum positive reading is only 0.041.",
          "Yes; the average reading is below 0.050.",
          "No; circular runout is twice the maximum positive reading, or 0.082."
        ],
        answer: 0,
        explanation: "Circular runout at a section is the maximum reading minus the minimum reading during rotation: 0.041 − (−0.014) = 0.055, above 0.050."
      },
      {
        id: 20,
        prompt: "How does total runout of a cylindrical surface differ from circular runout?",
        options: [
          "Total runout evaluates the entire controlled surface relative to the datum axis, including variation along its length.",
          "Total runout is evaluated at only one circular cross-section.",
          "Total runout controls only feature size and needs no datum axis.",
          "Total runout permits each section to be independently recentered."
        ],
        answer: 0,
        explanation: "Circular runout is checked section by section. Total runout evaluates the complete controlled surface as it rotates about the specified datum axis."
      }
    ]
  }
];

const questions = topics.flatMap(topic => topic.questions);

function scoreResponses(responses) {
  const results = questions.map(question => {
    const selected = responses[question.id];
    const answered = Number.isInteger(selected) && selected >= 0 && selected < question.options.length;
    return {
      id: question.id,
      selected: answered ? selected : null,
      correct: answered && selected === question.answer
    };
  });
  return {
    total: questions.length,
    answered: results.filter(result => result.selected !== null).length,
    correct: results.filter(result => result.correct).length,
    results
  };
}

function addTextElement(parent, tag, className, value) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  element.textContent = value;
  parent.append(element);
  return element;
}

function shuffledOptionIndices(count) {
  const order = Array.from({ length: count }, (_, index) => index);
  for (let index = order.length - 1; index > 0; index--) {
    const swapWith = Math.floor(Math.random() * (index + 1));
    [order[index], order[swapWith]] = [order[swapWith], order[index]];
  }
  return order;
}

function renderQuiz(container) {
  for (const topic of topics) {
    const section = document.createElement("section");
    section.className = "gdt-topic";
    section.setAttribute("aria-labelledby", `${topic.id}-title`);
    section.id = topic.id;
    const header = document.createElement("header");
    header.className = "gdt-topic-heading";
    const title = addTextElement(header, "h2", "", topic.title);
    title.id = `${topic.id}-title`;
    addTextElement(header, "p", "", topic.description);
    section.append(header);

    for (const question of topic.questions) {
      const fieldset = document.createElement("fieldset");
      fieldset.className = "gdt-question";
      fieldset.id = `question-${question.id}`;
      fieldset.dataset.questionId = String(question.id);
      const legend = document.createElement("legend");
      addTextElement(legend, "span", "gdt-question-number", String(question.id).padStart(2, "0"));
      addTextElement(legend, "span", "gdt-question-prompt", question.prompt);
      fieldset.append(legend);
      const choices = document.createElement("div");
      choices.className = "gdt-choices";
      shuffledOptionIndices(question.options.length).forEach(index => {
        const label = document.createElement("label");
        label.className = "gdt-choice";
        const input = document.createElement("input");
        input.type = "radio";
        input.name = `question-${question.id}`;
        input.value = String(index);
        label.append(input);
        addTextElement(label, "span", "", question.options[index]);
        choices.append(label);
      });
      fieldset.append(choices);
      const feedback = addTextElement(fieldset, "p", "gdt-feedback", "");
      feedback.hidden = true;
      section.append(fieldset);
    }
    container.append(section);
  }
}

function startQuiz() {
  const form = document.querySelector("#gdt-quiz-form");
  const container = document.querySelector("#gdt-questions");
  const result = document.querySelector("#gdt-quiz-result");
  if (!form || !container || !result) return;
  renderQuiz(container);

  form.addEventListener("submit", event => {
    event.preventDefault();
    const responses = {};
    for (const question of questions) {
      const selected = form.querySelector(`input[name="question-${question.id}"]:checked`);
      if (selected) responses[question.id] = Number(selected.value);
    }
    const score = scoreResponses(responses);
    for (const item of score.results) {
      const question = questions[item.id - 1];
      const fieldset = document.getElementById(`question-${item.id}`);
      const feedback = fieldset.querySelector(".gdt-feedback");
      fieldset.dataset.result = item.selected === null ? "unanswered" : item.correct ? "correct" : "incorrect";
      const lead = item.selected === null ? "Unanswered." : item.correct ? "Correct." : "Incorrect.";
      const answerText = item.correct ? "" : ` Correct answer: ${question.options[question.answer]}`;
      feedback.textContent = `${lead}${answerText} ${question.explanation}`;
      feedback.hidden = false;
    }
    const unanswered = score.total - score.answered;
    result.textContent = `Score: ${score.correct} of ${score.total} correct. ${score.answered} answered${unanswered ? `; ${unanswered} unanswered` : ""}. Review the explanation below each question.`;
    result.hidden = false;
    result.focus();
  });

  form.addEventListener("change", event => {
    const fieldset = event.target.closest(".gdt-question");
    if (!fieldset) return;
    delete fieldset.dataset.result;
    fieldset.querySelector(".gdt-feedback").hidden = true;
    result.hidden = true;
  });

  form.addEventListener("reset", () => {
    form.querySelectorAll(".gdt-question").forEach(fieldset => {
      delete fieldset.dataset.result;
      fieldset.querySelector(".gdt-feedback").hidden = true;
    });
    result.hidden = true;
  });
}

if (typeof module !== "undefined" && module.exports) module.exports = { topics, questions, scoreResponses };
if (typeof document !== "undefined") startQuiz();
