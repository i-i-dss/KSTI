function showResultPage() {
    document.getElementById("question-section").style.display = "none";
    const resultContainer = document.getElementById("result-container");
    resultContainer.style.display = "block";
    resultContainer.innerHTML = `
      <div id="resultContent"></div>
      <div class="text-center mt-6">
        <button onclick="location.reload()" class="nav-button"> 처음부터 다시 하기</button>
      </div>
    `;
  
    // 저장된 결과 불러오기만! 계산은 X
    const resultCode = localStorage.getItem("ksti_result_code");
    const scores = JSON.parse(localStorage.getItem("ksti_scores"));
  
    // 결과 렌더링
    renderResult(resultCode, scores);
  }

function renderResult(resultCode, scores) {
  const philosopher = philosophers[resultCode];
  const container = document.getElementById("resultContent");

  container.innerHTML = `
    <div class="result-title">당신의 철학 유형은?</div>
    <div class="result-profile">
      <img src="${philosopher.image}" alt="${philosopher.name}" class="result-image" />
      <h2 class="result-name">${philosopher.name}</h2>
      <p class="result-description">${philosopher.description}</p>
      <div class="result-analysis">${philosopher.profile}</div>
    </div>
  `;
}