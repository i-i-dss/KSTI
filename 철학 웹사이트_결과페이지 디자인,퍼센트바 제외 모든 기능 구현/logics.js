document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("question-container");
  const nextBtn = document.getElementById("next-button");
  const prevBtn = document.getElementById("prev-button");
  const QUESTIONS_PER_PAGE = 8;
  let currentPage = 0;
  const answers = Array(24).fill(undefined);

  function createRadioOption(index, value, className) {
    console.log(`🟡 선택지 생성: 질문 ${index + 1}, 값: ${value}`);

    const label = document.createElement("label");
    label.className = `radio-option ${className}`;
    label.style.position = "relative"; // 추가

    const input = document.createElement("input");
    input.type = "radio";
    input.name = `q${index + 1}`;
    input.value = value;
    input.style.opacity = "0";
    input.style.position = "absolute";
    input.style.width = "100%";
    input.style.height = "100%";
    input.style.zIndex = "2";
    input.style.cursor = "pointer";

    const span = document.createElement("span");
    span.className = "radio-circle";

    label.appendChild(input);
    label.appendChild(span);

    // Add text label under big circles
    if (className === "big-R") {
      const textYes = document.createElement("span");
      textYes.className = "radio-text";
      textYes.textContent = "그렇다";
      label.appendChild(textYes);
    } else if (className === "big-E") {
      const textNo = document.createElement("span");
      textNo.className = "radio-text";
      textNo.textContent = "아니다";
      label.appendChild(textNo);
    }

    // 초기 selected 상태 반영
    if (answers[index] === value) {
      label.classList.add("selected");
      input.checked = true; // 💥 이거 안 넣으면 선택 유지 안 됨
    }

    // 클릭 이벤트
    label.addEventListener("click", () => {
      console.log(`✅ 클릭됨 → 질문 ${index + 1}, 값: ${value}`);
      const siblings = label.parentElement.querySelectorAll(".radio-option");
      siblings.forEach(s => s.classList.remove("selected"));
      label.classList.add("selected");
      answers[index] = value;
      input.checked = true; // 💥 클릭 시에도 체크 명시
      updateProgress(); // ✅ 클릭 시 바로 진행률 업데이트

      // n번째 선택 후 n+1번째 질문 가운데 오도록 스크롤 (페이지 기반 인덱스)
      const questionFrames = document.querySelectorAll('.question-frame');
      const pageStart = currentPage * QUESTIONS_PER_PAGE;             // 현재 페이지 시작 인덱스
      const localIndex = index - pageStart;                           // 페이지 내 질문 인덱스
      const localNext = localIndex + 1;                               // 다음 질문의 로컬 인덱스
      const nextQuestion = questionFrames[localNext];                 // 로컬 인덱스 사용
      if (nextQuestion) {
        nextQuestion.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      // 페이지 내 질문 프레임 흐림 처리 (다음 질문만 또렷하게)
      questionFrames.forEach((frame, i) => {
        if (i === localNext) {
          frame.classList.remove("blurred");
        } else {
          frame.classList.add("blurred");
        }
      });
    });

    return label;
  }

  function calculateResult() {
    const scores = { R: 0, E: 0, I: 0, A: 0, O: 0, U: 0, T: 0, P: 0 };
    const weightCounts = { R: 0, E: 0, I: 0, A: 0, O: 0, U: 0, T: 0, P: 0 };
    const oppositeAxis = { R: "E", E: "R", I: "A", A: "I", O: "U", U: "O", T: "P", P: "T" };

    for (let i = 0; i < questions.length; i++) {
      const value = answers[i];
      if (value === undefined) {
        alert(`${i + 1}번 질문에 응답해주세요.`);
        setTimeout(() => {
          document.querySelector(`input[name='q${i}']`)?.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 0);
        return;
      }

      const axis = questions[i].axis;
      if (value === "3") {
        scores[axis] += 2;
        weightCounts[axis] += 1;
      } else if (value === "2") {
        scores[axis] += 1;
      } else if (value === "1") {
        scores[oppositeAxis[axis]] += 1;
      } else if (value === "0") {
        scores[oppositeAxis[axis]] += 2;
      }
    }

    const resultCode = ["R", "I", "O", "T"]
      .map(axis => {
        const opp = oppositeAxis[axis];
        const axisScore = scores[axis];
        const oppScore = scores[opp];

        if (axisScore > oppScore) return axis;
        if (axisScore < oppScore) return opp;

        if (weightCounts[axis] > weightCounts[opp]) return axis;
        if (weightCounts[axis] < weightCounts[opp]) return opp;

        scores[axis] += 0.01;
        return scores[axis] >= scores[opp] ? axis : opp;
      })
      .join("");

    // 결과 저장
    localStorage.setItem("ksti_result_code", resultCode);
    localStorage.setItem("ksti_scores", JSON.stringify(scores));
  }

  function createQuestionFrame(index, questionText) {
    console.log(`🎯 질문 ${index + 1} 렌더링 시작`);

    const frame = document.createElement("div");
    frame.className = "question-frame";

    const questionEl = document.createElement("div");
    questionEl.className = "question-text";
    questionEl.innerHTML = questionText;

    const options = document.createElement("div");
    options.className = "radio-options";

    const optionList = [
      { value: "1", class: "big-R" },
      { value: "2", class: "small-R" },
      { value: "4", class: "small-E" },
      { value: "5", class: "big-E" }
    ];

    optionList.forEach(opt => {
      options.appendChild(createRadioOption(index, opt.value, opt.class));
    });

    frame.appendChild(questionEl);
    frame.appendChild(options);
    return frame;
  }

  function updateProgress() {
    const answeredCount = answers.filter(ans => ans !== undefined).length;
    const percent = Math.round((answeredCount / answers.length) * 100);

    document.getElementById("progress-percent").textContent = `${percent}%`;

    const bar = document.getElementById("progress-bar");
    if (bar) {
      bar.style.width = `${percent}%`;
    }
  }

  function renderQuestions() {
    const introTop = document.querySelector('.intro-top');
    if (currentPage === 0) {
      introTop.style.display = 'block';
    } else {
      introTop.style.display = 'none';
    }
    
    container.innerHTML = "";
    const start = currentPage * QUESTIONS_PER_PAGE;
    const end = Math.min(start + QUESTIONS_PER_PAGE, questions.length);
    for (let i = start; i < end; i++) {
      const q = questions[i];
      const frame = createQuestionFrame(i, q.text);
      container.appendChild(frame);
      if (i < end - 1) {
        const divider = document.createElement("div");
        divider.className = "divider";
        container.appendChild(divider);
      }
    }

    prevBtn.disabled = currentPage === 0;

    updateProgress();

    // 마지막 페이지면 버튼 텍스트 변경
    if ((currentPage + 1) * QUESTIONS_PER_PAGE >= questions.length) {
      nextBtn.textContent = "결과 확인";
    } else {
      nextBtn.textContent = "다음 →";
    }
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
      calculateResult();     // ✅ 점수 계산 및 저장은 여기서 딱 1번만
      showResultPage();      // ✅ 결과는 저장된 데이터 기반으로만 렌더링
    } else {
      currentPage++;
      renderQuestions();
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
