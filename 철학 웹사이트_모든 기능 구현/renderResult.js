function preloadAxisImages() {
  axes.forEach(axis => {
    const leftImage = new Image();
    leftImage.src = axis.leftImg;
    const rightImage = new Image();
    rightImage.src = axis.rightImg;
  });
  
}

function showResultPage() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    document.getElementById("question-section").style.display = "none";
    document.getElementById("progress-wrapper").style.display = "none";
    const resultContainer = document.getElementById("result-container");
    resultContainer.style.display = "block";
    resultContainer.innerHTML = `
      <div id="resultContent"></div>
      <div class="text-center mt-6" style="display: flex; justify-content: center; gap: 16px;">
        <button onclick="location.reload()" class="nav-button">처음부터 다시 하기</button>
        <button onclick="navigator.clipboard.writeText(window.location.href); alert('링크가 복사되었습니다!');" class="nav-button">공유하기</button>
      </div>
    `;
  
    // 저장된 결과 불러오기
    const resultCode = localStorage.getItem("ksti_result_code");
    const scores = JSON.parse(localStorage.getItem("ksti_scores"));
  
    // 결과 렌더링
    preloadAxisImages();
    renderResult(resultCode, scores);
  }

  const axes = [
  {
    leftLabel: 'R 리얼리스트',
    rightLabel: 'E 이론가',
    leftImg: './types/R.png',
    rightImg: './types/E.png',
    leftDesc: 'R 합리적 사유\n\n---\n\n<strong>합리형의 사람들은 감각보다 이성, 경험보다 개념을 신뢰하는 경향이 있습니다.</strong>\n\n복잡한 현상 뒤의 원리와 구조를 파악하는데 능하고, 명확한 근거와 논리를 통해 사유를 전개합니다.\n\n추상적 개념 속에서 진리를 탐색하고, 일관된 사고 체계를 지향하는 태도가 특징입니다.',
    rightDesc: 'E 체험적 사유\n\n---\n\n<strong>경험형의 사람들은 세계를 직접 부딪히며 이해하려는 경향이 있습니다.</strong>\n\n논리보다는 느낌을, 개념보다는 현실을 신뢰하며, 실제 삶 속에서 사유를 끌어내려는 태도를 보입니다.\n\n몸으로 겪은 생생한 경험을 통해 의미를 구성하고, 대체로 이론보다 이야기 속에 진리를 담아내는 능력이 있습니다.',
    value: 0
  },
  {
    leftLabel: 'I 내향형',
    rightLabel: 'A 사회형',
    leftImg: './types/I.png',
    rightImg: './types/A.png',
    leftDesc: 'I 가능성의 지향\n\n---\n\n<strong>이상형의 사람들은 본질과 가능성에 주목하며, 세상의 이면에 숨겨진 의미를 찾고자 하는 경향이 있습니다.</strong>\n\n구체적인 현실보다는 믿음의 힘과 개념의 완결성을 중시하며, 세계가 더 나아질 수 있다는 믿음을 아래 사유합니다.\n\n언제나 “지금보다 더 나은 무언가”를 꿈꾸는 이들입니다.',
    rightDesc: 'A 조건의 수용\n\n---\n\n<strong>현실형의 사람들은 지금 이곳, 눈앞의 조건들을 바탕으로 사유를 전개하는 경향이 있습니다.</strong>\n\n이상보다는 경험 가능한 현실, 당장 실현 가능한 것들에 집중하며, 철학을 삶의 도구로 활용하려는 경향이 있습니다.\n\n이들은 생각을 삶 속에 뿌리내리게 하고, 이상보다는 구체적인 변화를 이끌어내는 데서 의미를 찾는 이들입니다.',
    value: 0
  },
  {
    leftLabel: 'O 객관형',
    rightLabel: 'U 주관형',
    leftImg: './types/O.png',
    rightImg: './types/U.png',
    leftDesc: 'O 구조의 구성\n\n---\n\n<strong>체계형의 사람들은 사유 속에서도 정합성과 질서를 추구하는 경향이 있습니다.</strong>\n\n아이디어들을 정돈된 방식으로 연결하려 하고, 논리적 일관성과 형식적 완결성을 중요하게 여깁니다.\n\n혼란 속에서도 질서를 세우려는 태도를 가진 이들은, 철학적 건축가라고 볼 수 있습니다.',
    rightDesc: 'U 흐름의 구성\n\n---\n\n<strong>유연형의 사람들은 질서보다는 흐름 속에서 의미를 발견하는 경향이 있습니다.</strong>\n\n계획된 틀보다는 놓인 상황의 감각과 맥락을 중시하며, 생각이란 고정된 틀이 아니라 가변성 있는 경험이라고 여깁니다.\n\n이들은 변화에 민감하고 창의적이며, 때로는 모순 속에서 더 깊은 통찰을 길어올립니다.',
    value: 0
  },
  {
    leftLabel: 'T 체계형',
    rightLabel: 'P 역설형',
    leftImg: './types/T.png',
    rightImg: './types/P.png',
    leftDesc: 'T 구조의 구성\n\n---\n\n<strong>체계형의 사람들은 사유 속에서도 정합성과 질서를 추구하는 경향이 있습니다.</strong>\n\n아이디어들을 정돈된 방식으로 연결하려 하고, 논리적 일관성과 형식적 완결성을 중요하게 여깁니다.\n\n혼란 속에서도 질서를 세우려는 태도를 가진 이들은, 철학적 건축가라고 볼 수 있습니다.',
    rightDesc: 'P 흐름의 구성\n\n---\n\n<strong>유연형의 사람들은 질서보다는 흐름 속에서 의미를 발견하는 경향이 있습니다.</strong>\n\n계획된 틀보다는 놓인 상황의 감각과 맥락을 중시하며, 생각이란 고정된 틀이 아니라 가변성 있는 경험이라고 여깁니다.\n\n이들은 변화에 민감하고 창의적이며, 때로는 모순 속에서 더 깊은 통찰을 길어올립니다.',
    value: 0
  }
];

function renderResult(resultCode, scores) {
  const philosopher = philosophers[resultCode];
  const container = document.getElementById("resultContent");

  const opposite = { R: 'E', I: 'A', O: 'U', T: 'P' };
  const axisColors = {
    R: '#2186d4',
    I: '#f2c94c',
    O: '#27ae60',
    T: '#a259ff'
  };

  // Build chart HTML
  let chartHtml = '<div class="ksti-outer-card"><div class="chart">';
  ['R','I','O','T'].forEach(axis => {
    const score = scores[axis] || 0;
    const opp = opposite[axis];
    const oppScore = scores[opp] || 0;
    const total = score + oppScore;
    const percent = total ? Math.round((score / total) * 100) : 50;
    const oppPercent = 100 - percent;

    // Update axes array value for hover info
    const axisIndex = ['R','I','O','T'].indexOf(axis);
    axes[axisIndex].value = percent;

    chartHtml += `
      <div class="axis-card" data-axis="${axis}">
        <div class="axis-labels">
          <span>${axes[axisIndex].leftLabel}</span>
          <span>${axes[axisIndex].rightLabel}</span>
        </div>
        <div class="axis-bar" style="--color:${axisColors[axis]}; --point-pos:${percent};">
          <div class="center-line"></div>
          <div class="point">${percent}%</div>
        </div>
        <div class="percent-labels">
          <span>${percent}%</span>
          <span>${oppPercent}%</span>
        </div>
      </div>`;
  });
  chartHtml += `
  </div>
  <div class="desc-panel" id="descPanel">
    <img class="desc-img" id="descImg" src="${axes[0].value >= 50 ? axes[0].leftImg : axes[0].rightImg}" alt=""/>
    <div class="desc-title" id="descTitle">${axes[0].value >= 50 ? axes[0].leftLabel : axes[0].rightLabel}</div>
    <div class="desc-pct" id="descPct">${axes[0].value >= 50 ? axes[0].value : 100 - axes[0].value}%</div>
    <div class="desc-txt" id="descTxt">${axes[0].value >= 50 ? axes[0].leftDesc : axes[0].rightDesc}</div>
  </div>
  </div>`;

  container.innerHTML = `
    <div class="result-title">당신의 철학 유형은?</div>
    <div class="result-profile">
      <img src="${philosopher.image}" alt="${philosopher.name}" class="result-image" />
      <h2 class="result-name">${philosopher.name}</h2>  
      <div class="result-tag">${philosopher.tag}</div>
      ${chartHtml}
    </div>
  `;

    // Append description, profile, others, and caut sections in the updated order with unique divider names
    const outerCard = document.querySelector('.ksti-outer-card');
    if (outerCard) {
      const divider1 = document.createElement('div');
      divider1.className = 'ksti-divider';
      const descSection = document.createElement('div');
      descSection.className = 'result-description-text';
      descSection.innerHTML = philosopher.description;

      const divider2 = document.createElement('div');
      divider2.className = 'ksti-divider';
      const profileSection = document.createElement('div');
      profileSection.className = 'profile-section';
      profileSection.innerHTML = philosopher.profile;

      const divider3 = document.createElement('div');
      divider3.className = 'ksti-divider';
      const othersSection = document.createElement('div');
      othersSection.className = 'others-section';
      othersSection.innerHTML = philosopher.others;

      const divider4 = document.createElement('div');
      divider4.className = 'ksti-divider';
      const cautSection = document.createElement('div');
      cautSection.className = 'caut-section';
      cautSection.innerHTML = philosopher.caut;

      outerCard.appendChild(divider1);
      outerCard.appendChild(descSection);
      outerCard.appendChild(divider2);
      outerCard.appendChild(profileSection);
      outerCard.appendChild(divider3);
      outerCard.appendChild(othersSection);
      outerCard.appendChild(divider4);
      outerCard.appendChild(cautSection);
    }
    
  // Add hover interactivity for axis cards
  const descTitle = document.getElementById('descTitle');
  const descImg = document.getElementById('descImg');
  const descPct = document.getElementById('descPct');
  const descTxt = document.getElementById('descTxt');
  const descPanel = document.getElementById('descPanel');

  document.querySelectorAll('.axis-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      const axis = card.getAttribute('data-axis');
      const axisIndex = ['R','I','O','T'].indexOf(axis);
      const axisInfo = axes[axisIndex];

      const isLeft = axisInfo.value >= 50;
      descPanel.style.display = 'flex';
      descTitle.innerText = isLeft ? axisInfo.leftLabel : axisInfo.rightLabel;
      descPct.innerText = isLeft ? `${axisInfo.value}%` : `${100 - axisInfo.value}%`;
      descTxt.innerHTML = isLeft ? axisInfo.leftDesc : axisInfo.rightDesc;
      descImg.src = isLeft ? axisInfo.leftImg : axisInfo.rightImg;
    });

    // click (PC)
    card.addEventListener('click', function() {
      const axis = card.getAttribute('data-axis');
      const axisIndex = ['R','I','O','T'].indexOf(axis);
      const axisInfo = axes[axisIndex];
      const isLeft = axisInfo.value >= 50;
      descPanel.style.display = 'flex';
      descTitle.innerText = isLeft ? axisInfo.leftLabel : axisInfo.rightLabel;
      descPct.innerText = isLeft ? `${axisInfo.value}%` : `${100 - axisInfo.value}%`;
      descTxt.innerHTML = isLeft ? axisInfo.leftDesc : axisInfo.rightDesc;
      descImg.src = isLeft ? axisInfo.leftImg : axisInfo.rightImg;
    });

    // touch (모바일)
    card.addEventListener('touchend', function() {
      const axis = card.getAttribute('data-axis');
      const axisIndex = ['R','I','O','T'].indexOf(axis);
      const axisInfo = axes[axisIndex];
      const isLeft = axisInfo.value >= 50;
      descPanel.style.display = 'flex';
      descTitle.innerText = isLeft ? axisInfo.leftLabel : axisInfo.rightLabel;
      descPct.innerText = isLeft ? `${axisInfo.value}%` : `${100 - axisInfo.value}%`;
      descTxt.innerHTML = isLeft ? axisInfo.leftDesc : axisInfo.rightDesc;
      descImg.src = isLeft ? axisInfo.leftImg : axisInfo.rightImg;
    });
  });
}