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
  });

  return label;
}
  
  function showResultPage() {
    document.getElementById("question-section").style.display = "none";
    const resultContainer = document.getElementById("result-container");
    resultContainer.style.display = "block";
    resultContainer.innerHTML = `
      <div class="result">
        <h2>테스트 결과</h2>
        <p>아직 결과 구현 중입니다!</p>
        <button onclick="location.reload()">처음부터 다시 하기</button>
      </div>
    `;
  }


  function createQuestionFrame(index, questionText) {
    console.log(`🎯 질문 ${index + 1} 렌더링 시작`);

    const frame = document.createElement("div");
    frame.className = "question-frame";

    const questionEl = document.createElement("div");
    questionEl.className = "question-text";
    questionEl.textContent = `${questionText}`;

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

  document.getElementById("progress-count").textContent = `${answeredCount} / ${answers.length}`;
  document.getElementById("progress-percent").textContent = `${percent}%`;

  const bar = document.getElementById("progress-bar");
  if (bar) {
    bar.style.width = `${percent}%`;

    
  }
}

  function renderQuestions() {
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
  showResultPage(); // ✅ 마지막 질문 다음 페이지는 결과 화면으로
} else {
  currentPage++;
  renderQuestions();
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
