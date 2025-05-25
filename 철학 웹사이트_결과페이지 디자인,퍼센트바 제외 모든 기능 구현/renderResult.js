function showResultPage() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.getElementById("question-section").style.display = "none";
    document.getElementById("progress-wrapper").style.display = "none";
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

  const opposite = { R: 'E', I: 'A', O: 'U', T: 'P' };
  const labels = {
    R: ['R 이성적 사고', 'E 감정적 직관'],
    I: ['I 내면 중심', 'A 외부 반응'],
    O: ['O 객관적 사실', 'U 주관적 해석'],
    T: ['T 체계적 구조', 'P 역설적 탐색']
  };

  // Build chart HTML
  let chartHtml = '<div class="chart">';
  ['R','I','O','T'].forEach(axis => {
    const score = scores[axis] || 0;
    const opp = opposite[axis];
    const oppScore = scores[opp] || 0;
    const total = score + oppScore;
    const percent = total ? Math.round((score / total) * 100) : 50;
    const oppPercent = 100 - percent;

    chartHtml += `
      <div class="row">
        <div class="label-left-group">
          <span class="label-left" style="${axis === "I" ? 'transform: translateX(5px); display: inline-block;' : ''}">${labels[axis][0]}</span>
          <span class="percent">${percent}%</span>
        </div>
        <div class="bar">
          <div class="segment left" style="width:${percent}%"></div>
          <div class="segment right" style="width:${oppPercent}%"></div>
        </div>
        <div class="label-right-group">
          <span class="label-right" style="${axis === "I" ? 'transform: translateX(-14px); display: inline-block;' : ''}">${labels[axis][1]}</span>
          <span class="percent">${oppPercent}%</span>
        </div>
      </div>`;
  });
  chartHtml += '</div>';

  container.innerHTML = `
    <div class="result-title">당신의 철학 유형은?</div>
    <div class="result-profile">
      <img src="${philosopher.image}" alt="${philosopher.name}" class="result-image" />
      <h2 class="result-name">${philosopher.name}</h2>
      <p class="result-description">${philosopher.description}</p>
      ${chartHtml}
      <div class="result-analysis">${philosopher.profile}</div>
    </div>
  `;
}
