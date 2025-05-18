let currentPage = 0;
const questionsPerPage = 10;

// 점수부여
function calculateResult() {
  const scores = { R: 0, E: 0, I: 0, A: 0, O: 0, U: 0, T: 0, P: 0 };
  const weightCounts = { R: 0, E: 0, I: 0, A: 0, O: 0, U: 0, T: 0, P: 0 };
  const oppositeAxis = { R: "E", E: "R", I: "A", A: "I", O: "U", U: "O", T: "P", P: "T" };

  for (let i = 0; i < questions.length; i++) {
    const value = answers[i];
    if (value === undefined) {
      alert(`${i + 1}번 질문에 응답해주세요.`);
      document.querySelector(`input[name='q${i}']`)?.scrollIntoView({ behavior: "smooth", block: "center" });
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

      scores[axis] += 0.01; // 동점일 경우 우선순위 보정
      return scores[axis] >= scores[opp] ? axis : opp;
    })
    .join("");

  document.body.innerHTML = `
    <div id="result" class="text-center p-6 max-w-2xl mx-auto bg-white rounded shadow"></div>
  `;
  renderResult(resultCode, scores);
}

// 질문 렌더링
function renderQuestions() {
  const container = document.getElementById("question-container");
  container.innerHTML = "";

  const start = currentPage * questionsPerPage;
  const end = Math.min(start + questionsPerPage, questions.length);

  for (let i = start; i < end; i++) {
    const q = questions[i];
    const el = document.createElement("div");
    el.className = "mb-4 p-4 bg-white rounded shadow";
    el.innerHTML = `
      <p class="font-semibold mb-2">${i + 1}. ${q.text}</p>
      <label class="block">
        <input type="radio" name="q${i}" value="3" ${answers[i] === "3" ? "checked" : ""} onchange="answers[${i}] = '3'" class="mr-2">
        매우 그렇다
      </label>
      <label class="block">
        <input type="radio" name="q${i}" value="2" ${answers[i] === "2" ? "checked" : ""} onchange="answers[${i}] = '2'" class="mr-2">
        다소 그렇다
      </label>
      <label class="block">
        <input type="radio" name="q${i}" value="1" ${answers[i] === "1" ? "checked" : ""} onchange="answers[${i}] = '1'" class="mr-2">
        다소 아니다
      </label>
      <label class="block">
        <input type="radio" name="q${i}" value="0" ${answers[i] === "0" ? "checked" : ""} onchange="answers[${i}] = '0'" class="mr-2">
        매우 아니다
      </label>
    `;
    container.appendChild(el);
  }

  const buttonContainer = document.createElement("div");
  buttonContainer.className = "mt-6";

  if (end >= questions.length) {
    const resultButton = document.createElement("button");
    resultButton.textContent = "결과 보기";
    resultButton.onclick = calculateResult;
    resultButton.className = "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded";
    buttonContainer.appendChild(resultButton);
  } else {
    const nextButton = document.createElement("button");
    nextButton.textContent = "다음 →";
    nextButton.onclick = () => {
      for (let i = start; i < end; i++) {
        if (answers[i] === undefined) {
          alert(`${i + 1}번 질문에 응답해주세요.`);
          document.querySelector(`input[name='q${i}']`)?.scrollIntoView({ behavior: "smooth", block: "center" });
          return;
        }
      }
      currentPage++;
      renderQuestions();
    };
    nextButton.className = "bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded";
    buttonContainer.appendChild(nextButton);
  }

  container.appendChild(buttonContainer);
}


// 결과화면
function renderResult(code, rawScores) {
  const result = philosophers[code];
  if (!result) {
    document.getElementById("result").textContent = "결과를 찾을 수 없습니다.";
    return;
  }

  const axisPairs = [
    { pair: ["R", "E"], desc: "이성적 사고 vs 감정적 직관" },
    { pair: ["I", "A"], desc: "내면 중심 vs 외부 반응" },
    { pair: ["O", "U"], desc: "객관적 사실 vs 주관적 해석" },
    { pair: ["T", "P"], desc: "체계적 구조 vs 역설적 탐색" }
  ];

  let resultHTML = `
    <div class="flex flex-col items-center mb-6">
      <img src="${result.image}" alt="${result.name} 이미지" class="w-40 h-40 object-cover rounded-full shadow mb-4" />
      <p class="text-3xl font-bold text-blue-700 mb-2">${code}</p>
      <h2 class="text-xl font-bold">${result.name}</h2>
    </div>
    <p class="text-gray-700 mt-2">${result.description}</p>
    <div class="mt-6">
      <h3 class="text-lg font-semibold mb-4 text-center">검사 항목별 비율</h3>
      <div class="space-y-4">
  `;

  axisPairs.forEach(({ pair, desc }) => {
    const a = Math.max(0, rawScores[pair[0]] || 0);
    const b = Math.max(0, rawScores[pair[1]] || 0);
    const total = a + b;

    if (total > 0) {
      const percentA = Math.round((a / total) * 100);
      const percentB = 100 - percentA;
      resultHTML += `
        <div class="mb-6">
          <div class="flex justify-between text-sm font-semibold mb-1">
            <span class="text-blue-600">${pair[0]} ${desc.split(" vs ")[0]} ${percentA}%</span>
            <span class="text-red-500">${pair[1]} ${desc.split(" vs ")[1]} ${percentB}%</span>
          </div>
          <div class="w-full h-3 bg-gray-200 rounded overflow-hidden flex">
            <div class="bg-blue-400" style="width: ${percentA}%"></div>
            <div class="bg-red-300" style="width: ${percentB}%"></div>
          </div>
        </div>`;
    } else {
      resultHTML += `<p>${pair[0]} vs ${pair[1]}: 데이터 없음</p>`;
    }
  });

  resultHTML += "</div></div>";
  if (result.profile) {
    resultHTML += `
      <div class="mt-8 border-t pt-6 text-left space-y-4 text-sm leading-relaxed">
        ${result.profile}
      </div>
    `;
  }
  document.getElementById("result").innerHTML = resultHTML;
}