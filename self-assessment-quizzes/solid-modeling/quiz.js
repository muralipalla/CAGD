"use strict";

// The questions apply the conventions and examples in the Solid Modeling lesson.
// Every item has one best answer; display order of its four choices is shuffled.
const lesson = anchor => `../../cad-modules/solid-modeling/index.html#${anchor}`;
const q = (id, prompt, options, answer, explanation, lessonHref) => ({
  id, prompt, options, answer, explanation, ...(lessonHref ? { lessonHref } : {})
});

const topics = [
  {
    id: "solid-validity",
    title: "Geometry, topology and solid validity",
    description: "Distinguish shape data, connectivity and inside–outside classification.",
    lessonHref: "../../cad-modules/solid-modeling/index.html#geometry-vs-topology",
    questions: [
      q(1, "A scanned triangular boundary looks closed in the viewport, but one small face is missing. What is the central solid-modeling problem?", [
        "Its vertex coordinates must all be wrong because one face is missing.",
        "Consistent triangle normals alone still certify a unique enclosed solid.",
        "The open boundary may prevent reliable interior, boundary and exterior classification.",
        "A gap matters only to an orthographic drawing, not to the solid model."
      ], 2, "A meaningful solid needs a closed boundary that distinguishes interior from exterior. A small gap can defeat that classification even when shaded rendering hides it.", lesson("interior-boundary-and-exterior-of-a-solid")),
      q(2, "A cube is smoothly stretched into a rectangular cuboid without tearing, gluing or changing which faces share edges. Which statement is justified?", [
        "Its geometry changes, but its connectivity and genus remain the same.",
        "Both geometry and topology must change because its edge lengths change.",
        "Its geometry is unchanged because it still has six faces.",
        "Its genus increases because some edges become longer."
      ], 0, "Coordinates and lengths are geometric data. Face-edge adjacency and genus are topological data; this deformation preserves the latter."),
      q(3, "A sphere-like shell is stretched into a rounded cube without tearing or gluing. A second edit instead drills a complete through-hole. Which comparison follows?", [
        "Both results are homeomorphic to the original because both remain connected.",
        "Neither result is homeomorphic to the original because their surface geometry changed.",
        "Only the drilled result is homeomorphic to the original because its material volume decreased.",
        "The stretched result is homeomorphic; the through-hole changes the number of handles."
      ], 3, "Homeomorphism permits continuous deformation while preserving topological features such as holes. Stretching changes geometry; drilling a through-hole changes genus.", lesson("definition-of-homeomorphism")),
      q(4, "Two face-edge incidence pointers are accidentally swapped in a B-Rep, while every vertex coordinate and surface equation stays fixed. What changed directly?", [
        "Only the display color of the two faces.",
        "Topological connectivity data; the boundary may now be inconsistent despite unchanged geometry.",
        "Only geometric dimensions, because face equations are geometric.",
        "The number of handles must increase by exactly one."
      ], 1, "Incidence pointers encode which edges and faces meet. Their corruption can invalidate topology without changing coordinates, equations or global entity counts.")
    ]
  },
  {
    id: "euler-topology",
    title: "Euler characteristic, loops and genus",
    description: "Use the correct invariant and recognize its limits.",
    lessonHref: "../../cad-modules/solid-modeling/index.html#euler-poincare-with-loops",
    questions: [
      q(5, "A single closed orientable manifold shell has V = 20, E = 30 and F = 12, with one outer loop per face. If it is valid, what genus must it have?", [
        "Genus 1, because there are twelve faces.",
        "Genus 2, because V − E + F is positive.",
        "The genus cannot be inferred from these counts under the stated assumptions.",
        "Genus 0, because V − E + F = 2."
      ], 3, "For one closed orientable shell with one loop per face, V − E + F = 2 − 2g. Here 20 − 30 + 12 = 2, so g = 0. The count does not itself prove validity.", lesson("euler-characteristic")),
      q(6, "Compare a blind top pocket, a top-to-bottom through-hole and a completely sealed internal cavity in three otherwise identical blocks. Which topological account is sound?", [
        "All three add one handle because all three remove material.",
        "The pocket can add a face inner loop without a handle; the through-hole adds a handle; the cavity adds a boundary shell.",
        "The pocket adds a boundary shell; the through-hole adds only a face inner loop; the cavity adds a handle.",
        "None changes loops, shells or genus because the outer block stays connected."
      ], 1, "A blind pocket can add an inner face loop but no tunnel. A through-hole raises the boundary genus. A sealed cavity contributes a separate inward-oriented boundary shell."),
      q(7, "For a valid orientable boundary, V = 16, E = 26, F = 12, L = 14 and S = 1. Using V − E + 2F − L = 2(S − G), what is G?", [
        "1",
        "0",
        "2",
        "It cannot be determined because L differs from F."
      ], 0, "The left side is 16 − 26 + 24 − 14 = 0. Thus 0 = 2(1 − G), giving G = 1. The loop-aware equation is needed when L differs from F."),
      q(8, "A closed B-Rep satisfies the applicable Euler equation, but two nonadjacent faces intersect in 3D. What conclusion follows?", [
        "The solid is valid because the Euler equation checks every geometric condition.",
        "Its genus must be recomputed, but the intersection cannot affect validity.",
        "The Euler count passes, yet a separate geometric intersection test can still reject the model.",
        "Adding one face automatically removes the intersection while preserving topology."
      ], 2, "Euler relations are necessary topological count checks, not validity proofs. They do not detect face-face intersection, gaps, overlap or inconsistent geometry.", lesson("euler-characteristic"))
    ]
  },
  {
    id: "representation-layers",
    title: "Representation and design history",
    description: "Choose the right layer for geometry, topology and parametric dependencies.",
    lessonHref: "../../cad-modules/solid-modeling/index.html#types-of-solid-modeling",
    questions: [
      q(9, "A CAD file records a sketch, extrusion, fillet and pattern with dependency references; rebuilding produces a B-Rep body. Which description is most accurate?", [
        "The feature graph is itself the same geometric representation as a CSG Boolean tree.",
        "The graph records design history above the geometric kernel; the current body can be a B-Rep.",
        "The B-Rep can only exist after the feature graph is deleted.",
        "Every feature node must be a primitive solid or Boolean operator."
      ], 1, "A parametric feature graph stores ordered operations, parameters and references. Its nodes call kernel operations; the evaluated body is often B-Rep."),
      q(10, "A model is stored as a CSG expression, but a downstream tool asks which two finished faces meet at a particular edge. What is the sound approach?", [
        "Read the order of primitive leaves as the face adjacency table.",
        "Differentiate the primitive equations; no boundary topology is needed.",
        "Evaluate the result and derive a boundary representation with explicit face-edge incidence.",
        "Rasterize the CSG preview and treat neighboring pixels as exact CAD faces."
      ], 2, "A CSG tree encodes Boolean construction, not finished local face adjacency. B-Rep stores faces, edges and vertices with incidence data for such queries."),
      q(11, "A profile is swept along a path and the resulting solid is stored as faces, edges and vertices. Which inference is correct?", [
        "Sweep construction and B-Rep storage can coexist in one CAD workflow.",
        "The solid cannot be B-Rep because it was created by a sweep.",
        "Sweeping converts all edges into voxel cells by definition.",
        "The sweep path is a feature-history graph, so no geometric kernel is involved."
      ], 0, "A sweep is a construction scheme. A CAD system can evaluate it and store the resulting boundary as a B-Rep; representation schemes are not mutually exclusive."),
      q(12, "A broad-phase collision checker must quickly discard empty regions at several spatial resolutions before doing an exact boundary test. Which structure matches the lesson's spatial-decomposition scheme?", [
        "Only a 2D orthographic drawing, because its projected outline classifies all 3D points.",
        "A feature-history list of fillets and patterns, because dependency order partitions physical space.",
        "A raw list of CSG primitive names, because their order is an occupancy hierarchy.",
        "An octree that subdivides space into occupied and empty cells and refines where needed."
      ], 3, "Spatial decomposition represents occupied space with cells such as voxels or octree cells. A hierarchy can prune empty regions; exact boundary verification remains a separate step.", lesson("solid-representation-schemes"))
    ]
  },
  {
    id: "boundary-traversal",
    title: "Boundary data structures and traversal",
    description: "Reason about winged edges, half-edges and face loops.",
    lessonHref: "../../cad-modules/solid-modeling/index.html#winged-edge-data-structure",
    questions: [
      q(13, "A traversal needs the faces on both sides of an edge and the preceding and following edge around each face. Which record supplies these directly?", [
        "A half-edge record containing only origin, twin, next, previous and one incident face.",
        "A CSG node containing one primitive and one Boolean operator.",
        "A winged-edge record containing endpoints, left/right faces and both faces' previous/next edge pointers.",
        "A vertex coordinate record and a shaded image of the model."
      ], 2, "The winged-edge structure treats an edge as central and stores both endpoint vertices, two adjacent faces and neighboring edges along each face."),
      q(14, "In an oriented half-edge structure, h belongs to face A and has a twin across a shared interior edge. How can a query reach the face across that edge?", [
        "Follow h.twin and read the incident face of that opposite half-edge.",
        "Follow h.next until reaching the origin vertex; that vertex is the other face.",
        "Use h.prev as the adjacent face ID without following another half-edge.",
        "Compare the lengths of the two geometric edge curves."
      ], 0, "The twin represents the same edge in the opposite direction. Its incident face is the neighboring face across an interior edge.", lesson("half-edge-data-structure")),
      q(15, "A trimmed B-Rep face has one outer loop and one inner loop. A face-boundary traversal starts from only one outer-loop seed and stops on returning to it. What is missing?", [
        "Nothing; every face has exactly one edge cycle even with a hole.",
        "Only a vertex coordinate transformation.",
        "A CSG primitive for each edge of the inner loop.",
        "A separate seed and traversal for the inner loop."
      ], 3, "Each boundary loop is its own closed edge cycle. A traversal started on the outer loop cannot enumerate the inner loop without a separate seed."),
      q(16, "An otherwise ordinary half-edge mesh has an open boundary edge with no face on one side. What must a robust traversal account for?", [
        "A missing vertex coordinate necessarily changes every face normal.",
        "The boundary side needs explicit treatment, such as a sentinel or boundary half-edge, before following its face pointers.",
        "The edge automatically has two interior faces because all edges have twins.",
        "The mesh must be converted to a CSG tree before any edge can be traversed."
      ], 1, "Half-edge conventions may represent boundary twins or missing incident faces differently. A traversal must handle that boundary case rather than assume two interior faces.", lesson("half-edge-data-structure"))
    ]
  },
  {
    id: "constructive-modeling",
    title: "CSG and script-based construction",
    description: "Interpret Boolean expressions and their limits.",
    lessonHref: "../../cad-modules/solid-modeling/index.html#constructive-solid-geometry",
    questions: [
      q(17, "A cutting solid C overlaps material in both A and B. Which expression removes C from the entire union of A and B?", [
        "(A ∪ B) − C",
        "A ∪ (B − C)",
        "A ∩ (B − C)",
        "(A − B) ∪ C"
      ], 0, "The difference must be applied after the union. A ∪ (B − C) retains any material in A ∩ C, so grouping matters."),
      q(18, "In OpenSCAD, `difference() { cube(...); cylinder(...); }` uses a centered cylinder that passes fully through the cube. What solid is intended?", [
        "Only the overlap of the cube and cylinder.",
        "The union of the cube and cylinder.",
        "A cylinder with the cube removed from it.",
        "The cube with the cylinder's volume subtracted, forming a through-hole."
      ], 3, "OpenSCAD difference subtracts subsequent child solids from the first child. Here the cylinder cuts a through-hole in the cube.", lesson("introduction-to-openscad")),
      q(19, "An OpenSCAD script replaces a fixed cylinder radius with a variable. A student says this alone makes the file a feature-history graph like a sketch–fillet–pattern CAD model. Which response is best?", [
        "Yes; every variable is automatically a feature node with geometric references.",
        "No; the variable can parameterize generated CSG geometry without creating a CAD feature dependency graph.",
        "No; script variables cannot change generated geometry.",
        "Yes; parametric scripts cannot contain Boolean operations."
      ], 1, "A script can be parametric while still expressing CSG construction. A feature-history graph records operations and dependencies such as sketches, fillets and references at another layer.", lesson("introduction-to-openscad")),
      q(20, "A teammate treats the CSG intersection A ∩ B as a machining instruction. What does the operator actually specify?", [
        "A cutter path that removes A before B is machined.",
        "An additive joining sequence with tooling and tolerances.",
        "The geometric volume common to A and B; no manufacturing sequence follows from it alone.",
        "The volume in A but not in B."
      ], 2, "CSG union, intersection and difference are set-theoretic geometric operations. Intersection keeps common volume but specifies no tooling, access, sequence or process physics.")
    ]
  },
  {
    id: "controlled-edits",
    title: "Traversal, controlled edits and validity",
    description: "Follow stored topology pointers and track edits without overclaiming validity.",
    lessonHref: "../../cad-modules/solid-modeling/index.html#creation-of-half-edge-data-structure-using-euler-operators",
    questions: [
      q(21, "In the lesson's WEDS CSV convention, a traversal around face F is currently at edge e, and e.RightFace = F. Which pointer leads to the next edge on F's stored boundary order?", [
        "e.LeftPrevious",
        "e.RightNext",
        "e.LeftNext",
        "e.RightPrevious"
      ], 1, "The face traversal follows LeftNext when F is the left face and RightNext when F is the right face. The pointer names follow this lesson's stored face-boundary order.", lesson("weds-programming")),
      q(22, "MEF joins two existing vertices with a new edge and splits one face into two. Assuming its preconditions hold, what happens to V − E + F?", [
        "It rises by 2, because a face split creates two faces without removing the old one.",
        "It falls by 1, because adding an edge always changes genus.",
        "It stays unchanged: ΔE = +1 and ΔF = +1 cancel.",
        "It is undefined until the new edge curve is parameterized."
      ], 2, "MEF adds an edge and increases the face count by one. Their contributions −1 and +1 cancel in V − E + F."),
      q(23, "A topological edit removes an edge and leaves a new inner boundary ring on a face. Which Euler operator matches that edit?", [
        "MEV, which makes an edge and vertex.",
        "MEF, which makes an edge and face.",
        "MEKR, which makes an edge and kills a ring.",
        "KEMR, which kills an edge and makes a ring."
      ], 3, "KEMR means Kill Edge Make Ring. The new inner loop also changes L in the loop-aware Euler accounting."),
      q(24, "A kernel applies Euler operators with their required preconditions, and the final entity counts satisfy the extended Euler relation. What additional verification is still required?", [
        "Check local incidence and geometry, including gaps, overlap, self-intersection and surface consistency.",
        "None; the operator names and global counts prove that the model is a valid solid.",
        "Only a color check of the rendered faces.",
        "Only a count of the feature-history nodes, because geometry cannot invalidate topology."
      ], 0, "Euler operators manage topological edits and Euler relations provide necessary consistency checks. Neither guarantees correct adjacency or nonintersecting, gap-free geometry.")
    ]
  }
];

const questions = topics.flatMap(topic => topic.questions);
const questionById = new Map(questions.map(question => [question.id, question]));

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
    section.className = "sm-topic";
    section.id = topic.id;
    section.setAttribute("aria-labelledby", `${topic.id}-title`);
    const header = document.createElement("header");
    header.className = "sm-topic-heading";
    const title = addTextElement(header, "h2", "", topic.title);
    title.id = `${topic.id}-title`;
    addTextElement(header, "p", "", topic.description);
    const lessonLink = addTextElement(header, "a", "sm-topic-review", "Review this lesson section");
    lessonLink.href = topic.lessonHref;
    section.append(header);

    for (const question of topic.questions) {
      const fieldset = document.createElement("fieldset");
      fieldset.className = "sm-question";
      fieldset.id = `question-${question.id}`;
      fieldset.dataset.questionId = String(question.id);
      const legend = document.createElement("legend");
      addTextElement(legend, "span", "sm-question-number", String(question.id).padStart(2, "0"));
      addTextElement(legend, "span", "sm-question-prompt", question.prompt);
      fieldset.append(legend);
      const choices = document.createElement("div");
      choices.className = "sm-choices";
      shuffledOptionIndices(question.options.length).forEach(index => {
        const label = document.createElement("label");
        label.className = "sm-choice";
        const input = document.createElement("input");
        input.type = "radio";
        input.name = `question-${question.id}`;
        input.value = String(index);
        label.append(input);
        addTextElement(label, "span", "", question.options[index]);
        choices.append(label);
      });
      fieldset.append(choices);
      const feedback = addTextElement(fieldset, "p", "sm-feedback", "");
      feedback.hidden = true;
      section.append(fieldset);
    }
    container.append(section);
  }
}

function startQuiz() {
  const form = document.querySelector("#sm-quiz-form");
  const container = document.querySelector("#sm-questions");
  const result = document.querySelector("#sm-quiz-result");
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
      const question = questionById.get(item.id);
      const fieldset = document.getElementById(`question-${item.id}`);
      const feedback = fieldset.querySelector(".sm-feedback");
      fieldset.dataset.result = item.selected === null ? "unanswered" : item.correct ? "correct" : "incorrect";
      const lead = item.selected === null ? "Unanswered." : item.correct ? "Correct." : "Incorrect.";
      const correctOption = question.options[question.answer];
      const answerText = item.correct ? "" : ` Correct answer: ${correctOption}${/[.!?]$/.test(correctOption) ? "" : "."}`;
      feedback.textContent = `${lead}${answerText} ${question.explanation} `;
      const topic = topics.find(candidate => candidate.questions.includes(question));
      const link = addTextElement(feedback, "a", "", "Review theory");
      link.href = question.lessonHref || topic.lessonHref;
      feedback.hidden = false;
    }
    const unanswered = score.total - score.answered;
    result.textContent = `Score: ${score.correct} of ${score.total} correct. ${score.answered} answered${unanswered ? `; ${unanswered} unanswered` : ""}. Review the explanation below each question.`;
    result.hidden = false;
    result.focus();
  });

  form.addEventListener("change", event => {
    const fieldset = event.target.closest(".sm-question");
    if (!fieldset) return;
    delete fieldset.dataset.result;
    fieldset.querySelector(".sm-feedback").hidden = true;
    result.hidden = true;
  });

  form.addEventListener("reset", () => {
    form.querySelectorAll(".sm-question").forEach(fieldset => {
      delete fieldset.dataset.result;
      fieldset.querySelector(".sm-feedback").hidden = true;
    });
    result.hidden = true;
  });
}

if (typeof module !== "undefined" && module.exports) module.exports = { topics, questions, scoreResponses };
if (typeof document !== "undefined") startQuiz();
