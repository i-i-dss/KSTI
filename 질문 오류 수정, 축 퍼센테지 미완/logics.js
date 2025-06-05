document.addEventListener("DOMContentLoaded", () => {
  function preloadImagesWithLinkTag() {
    Object.values(philosophers).forEach(philo => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = philo.image;
      document.head.appendChild(link);
    });
  }
  preloadImagesWithLinkTag();

  const container = document.getElementById("question-container");
  const nextBtn = document.getElementById("next-button");
  const prevBtn = document.getElementById("prev-button");

  const QUESTIONS_PER_PAGE = 8;
  let currentPage = 0;
  const answers = Array(24).fill(undefined);

  function createRadioOption(index, value, className) {
    const label = document.createElement("label");
    label.className = `radio-option ${className}`;
    label.style.position = "relative";

    const input = document.createElement("input");
    input.type = "radio";
    input.name = `q${index + 1}`;
    input.value = value;
    Object.assign(input.style, {
      opacity: "0",
      position: "absolute",
      width: "100%",
      height: "100%",
      zIndex: "2",
      cursor: "pointer"
    });

    const circle = document.createElement("span");
    circle.className = "radio-circle";

    label.appendChild(input);
    label.appendChild(circle);

    if (className === "big-R") {
      const tx = document.createElement("span");
      tx.className = "radio-text";
      tx.textContent = "그렇다";
      tx.style.color = "#1E40AF";
      label.appendChild(tx);
    } else if (className === "big-E") {
      const tx = document.createElement("span");
      tx.className = "radio-text";
      tx.textContent = "아니다";
      tx.style.color = "#FDBA74";
      label.appendChild(tx);
    }

    if (answers[index] === value) {
      label.classList.add("selected");
      input.checked = true;
    }

    label.addEventListener("click", () => {
      label.parentElement.querySelectorAll(".radio-option").forEach(el => el.classList.remove("selected"));
      label.classList.add("selected");
      answers[index] = value;
      input.checked = true;
      updateProgress();

      const frames = document.querySelectorAll(".question-frame");
      const pageStart = currentPage * QUESTIONS_PER_PAGE;
      const localIdx = index - pageStart;
      const nextFrame = frames[localIdx + 1];
      if (nextFrame) nextFrame.scrollIntoView({ behavior: "smooth", block: "center" });

      frames.forEach((f, i) => {
        if (i === localIdx + 1) f.classList.remove("blurred");
        else f.classList.add("blurred");
      });
    });

    return label;
  }

  function calculateResult() {
    const scores = { R: 0, E: 0, I: 0, A: 0, O: 0, U: 0, T: 0, P: 0 };
    const weight = { R: 0, E: 0, I: 0, A: 0, O: 0, U: 0, T: 0, P: 0 };
    const opp = { R: "E", E: "R", I: "A", A: "I", O: "U", U: "O", T: "P", P: "T" };

    for (let i = 0; i < questions.length; i++) {
      const v = answers[i];
      if (v === undefined) {
        alert(`${i + 1}번 질문에 응답해주세요.`);
        document.querySelector(`input[name='q${i + 1}']`)?.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }
      const axis = questions[i].axis;
      if (v === "3") { scores[axis] += 2; weight[axis] += 1; }
      else if (v === "2") { scores[axis] += 1; }
      else if (v === "1") { scores[opp[axis]] += 1; }
      else if (v === "0") { scores[opp[axis]] += 2; weight[opp[axis]] += 1; }
    }

    const code = ["R", "I", "O", "T"].map(axis => {
      const o = opp[axis];
      if (scores[axis] > scores[o]) return axis;
      if (scores[axis] < scores[o]) return o;
      if (weight[axis] > weight[o]) return axis;
      if (weight[axis] < weight[o]) return o;
      scores[axis] += 0.01;
      return scores[axis] >= scores[o] ? axis : o;
    }).join("");

    localStorage.setItem("ksti_result_code", code);
    localStorage.setItem("ksti_scores", JSON.stringify(scores));
  }

  function createQuestionFrame(index, text) {
    const frame = document.createElement("div");
    frame.className = "question-frame";

    const qEl = document.createElement("div");
    qEl.className = "question-text";
    qEl.innerHTML = text;

    const opts = document.createElement("div");
    opts.className = "radio-options";

    const optionList = [
      { value: "3", class: "big-R" },
      { value: "2", class: "small-R" },
      { value: "1", class: "small-E" },
      { value: "0", class: "big-E" }
    ];
    optionList.forEach(opt => opts.appendChild(createRadioOption(index, opt.value, opt.class)));

    frame.appendChild(qEl);
    frame.appendChild(opts);
    return frame;
  }

  function updateProgress() {
    const answered = answers.filter(a => a !== undefined).length;
    const pct = Math.round(answered / answers.length * 100);
    document.getElementById("progress-percent").textContent = `${pct}%`;
    const bar = document.getElementById("progress-bar");
    if (bar) bar.style.width = `${pct}%`;
  }

  function renderQuestions() {
    document.querySelector(".intro-top").style.display = currentPage === 0 ? "block" : "none";

    container.innerHTML = "";
    const start = currentPage * QUESTIONS_PER_PAGE;
    const end = Math.min(start + QUESTIONS_PER_PAGE, questions.length);

    for (let i = start; i < end; i++) {
      container.appendChild(createQuestionFrame(i, questions[i].text));
      if (i < end - 1) {
        const div = document.createElement("div");
        div.className = "divider";
        container.appendChild(div);
      }
    }

    prevBtn.disabled = currentPage === 0;
    updateProgress();
    nextBtn.textContent = (currentPage + 1) * QUESTIONS_PER_PAGE >= questions.length ? "결과 확인" : "다음 →";
  }

  nextBtn.addEventListener("click", () => {
    const start = currentPage * QUESTIONS_PER_PAGE;
    const end = Math.min(start + QUESTIONS_PER_PAGE, questions.length);

    for (let i = start; i < end; i++) {
      if (answers[i] === undefined) {
        alert(`${i + 1}번 질문에 응답해주세요.`);
        return;
      }
    }

    if (end >= answers.length) {
      calculateResult();
      showResultPage();
    } else {
      currentPage++;
      renderQuestions();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });

  prevBtn.addEventListener("click", () => {
    if (currentPage > 0) {
      currentPage--;
      renderQuestions();
    }
  });

  renderQuestions();
});
