;(() => {
  'use strict';

  // ---------- Helpers ----------
  function markOnce(target, key) {
    if (!target) return false;
    if (target.dataset?.[key] === '1') return false;
    if (target.dataset) target.dataset[key] = '1';
    return true;
  }

  const PROGRAM_DATA = {
    'sunrise-walk': {
      title: '새벽 산책 명상',
      subtitle: '숲의 첫 공기를 마시며 리듬을 깨우는 75분 보행 명상.',
      ctaHref: 'https://forms.gle/2SunriseWalk',
      ctaLabel: '신청하기',
      gallery: [
        { src: 'assets/img/main.jpg', alt: '새벽 햇살이 비치는 가시림 숲길' },
        { src: 'assets/img/유리온실.jpg', alt: '숲 해설가와 함께 걷는 참가자들' },
        { src: 'assets/img/카페.jpg', alt: '산책 명상 후 티를 즐기는 모습' },
        { src: 'assets/img/가든센터.jpg', alt: '프로그램 전 가드닝 센터에서 준비하는 참가자' }
      ],
      bodyHtml: `
        <h3 class="program-modal__section-title">프로그램 소개</h3>
        <p class="program-modal__paragraph">새벽의 차분한 숲길을 천천히 걷고, 호흡과 걸음의 리듬을 맞추며 감각을 깨우는 보행 명상입니다. 해맞이 호흡과 스트레칭으로 하루를 부드럽게 여는 루틴을 설계했습니다.</p>
        <dl class="program-modal__facts">
          <div class="program-modal__fact"><dt>진행 요일</dt><dd>매주 화 · 목 07:30 (75분)</dd></div>
          <div class="program-modal__fact"><dt>장소</dt><dd>가시림 메타세쿼이아 산책길</dd></div>
          <div class="program-modal__fact"><dt>정원</dt><dd>회차당 10명 (선착순)</dd></div>
          <div class="program-modal__fact"><dt>참가비</dt><dd>28,000원 (허브티 포함)</dd></div>
        </dl>
        <section class="program-modal__section">
          <h4 class="program-modal__section-title">커리큘럼</h4>
          <ol class="program-modal__list">
            <li>호흡 정렬 &amp; 가벼운 스트레칭 15분</li>
            <li>새벽 숲길 보행 명상 35분</li>
            <li>선 라이트 스탠딩 명상 15분</li>
            <li>허브티 &amp; 저널링 10분</li>
          </ol>
        </section>
        <section class="program-modal__section">
          <h4 class="program-modal__section-title">준비물</h4>
          <ul class="program-modal__list">
            <li>따뜻한 겉옷과 편한 운동화</li>
            <li>개인 물병 또는 텀블러</li>
            <li>필요 시 가벼운 장갑</li>
          </ul>
        </section>
        <aside class="program-modal__notice">
          <h4 class="program-modal__section-title">안내 사항</h4>
          <ul class="program-modal__list">
            <li>일출 시각에 따라 시작 시간이 10분 내외로 조정될 수 있습니다.</li>
            <li>우천 시에는 온실 내 걷기 명상으로 대체 진행합니다.</li>
            <li>노약자는 스태프의 별도 안내에 따라 진행합니다.</li>
          </ul>
          <p class="program-modal__note">문의: walk@gasirim.kr / 070-4281-0906</p>
        </aside>
      `
    },
    'forest-immersion': {
      title: '숲 명상: 오감으로 느끼는 메타세쿼이아 숲',
      subtitle: '계절의 향과 소리를 따라 깊이 몰입하는 주말 집중 명상 여정.',
      ctaHref: 'https://forms.gle/4V2ForestImmersion',
      ctaLabel: '신청하기',
      gallery: [
        { src: 'assets/img/유리온실.jpg', alt: '메타세쿼이아 숲길을 천천히 걷는 참가자들' },
        { src: 'assets/img/main.jpg', alt: '나무 사이로 내리쬐는 햇살과 물안개' },
        { src: 'assets/img/카페.jpg', alt: '숲 명상 후 티 브레이크를 즐기는 공간' },
        { src: 'assets/img/가든센터.jpg', alt: '해설가와 함께 숲 식생을 살피는 모습' }
      ],
      bodyHtml: `
        <h3 class="program-modal__section-title">프로그램 소개</h3>
        <p class="program-modal__paragraph">울창한 메타세쿼이아 숲을 가이드와 함께 천천히 걷고, 향과 소리를 세밀하게 탐색하며 감각을 열어가는 주말 집중 프로그램입니다. 계절에 따라 달라지는 숲의 스토리를 담은 해설과 함께 깊은 몰입을 경험해 보세요.</p>
        <dl class="program-modal__facts">
          <div class="program-modal__fact"><dt>진행 요일</dt><dd>계절별 주말 10:00 (120분)</dd></div>
          <div class="program-modal__fact"><dt>장소</dt><dd>가시림 메타세쿼이아 숲길 &amp; 야외 명상존</dd></div>
          <div class="program-modal__fact"><dt>정원</dt><dd>회차당 16명 (사전 예약 필수)</dd></div>
          <div class="program-modal__fact"><dt>참가비</dt><dd>25,000원 (숲 해설 &amp; 허브 블렌딩 포함)</dd></div>
        </dl>
        <section class="program-modal__section">
          <h4 class="program-modal__section-title">커리큘럼</h4>
          <ol class="program-modal__list">
            <li>사운드 어웨어니스 25분 — 새소리와 바람을 듣는 호흡 정렬</li>
            <li>포커스 워크 35분 — 식생 해설과 함께 감각 확장</li>
            <li>야외 바디스캔 30분 — 자연물과 함께하는 촉각 명상</li>
            <li>향 테라피 &amp; 쉐어링 30분 — 계절 허브 블렌딩과 나눔</li>
          </ol>
        </section>
        <section class="program-modal__section">
          <h4 class="program-modal__section-title">준비물</h4>
          <ul class="program-modal__list">
            <li>편안한 운동화 및 우천 대비 우비</li>
            <li>개인 방석 또는 접이식 시트 (현장 대여 가능)</li>
            <li>모기 기피제, 개인 보온 음료</li>
          </ul>
        </section>
        <aside class="program-modal__notice">
          <h4 class="program-modal__section-title">안내 사항</h4>
          <ul class="program-modal__list">
            <li>기상 상황에 따라 일부 코스는 숲 해설 데크로 대체될 수 있습니다.</li>
            <li>자연 보호를 위해 개인 쓰레기는 반드시 되가져가 주세요.</li>
            <li>10세 이하 아동은 보호자 동반 시 참여 가능합니다.</li>
          </ul>
          <p class="program-modal__note">문의: programs@gasirim.kr / 070-4281-0906</p>
        </aside>
      `
    },
    'regular-class': {
      title: '정규 명상 수업',
      subtitle: '숲길을 걷고 온실에서 호흡을 정리하며 하루의 호흡을 여는 90분 프로그램.',
      ctaHref: 'https://forms.gle/7K6YRegularMeditation',
      ctaLabel: '신청하기',
      gallery: [
        { src: 'assets/img/유리온실2.jpg', alt: '아침 햇살이 드는 온실에서 명상 중인 참가자들' },
        { src: 'assets/img/유리온실.jpg', alt: '숲길에서 호흡을 맞추며 걷는 정규 명상 수업' },
        { src: 'assets/img/main.jpg', alt: '햇살이 스며드는 가시림 산책길' },
        { src: 'assets/img/가든센터.jpg', alt: '온실 앞 휴식 공간에서 허브차를 즐기는 모습' }
      ],
      bodyHtml: `
        <h3 class="program-modal__section-title">프로그램 소개</h3>
        <p class="program-modal__paragraph">숲의 기운을 몸에 채우는 걷기 명상과 온실에서의 집중 호흡으로 구성된 가시림의 시그니처 정규 수업입니다. 호흡과 몸의 움직임을 섬세하게 정리하여 초심자도 안정적으로 몰입할 수 있도록 구성했습니다.</p>
        <dl class="program-modal__facts">
          <div class="program-modal__fact"><dt>진행 요일</dt><dd>매주 화 · 목 08:30 (90분)</dd></div>
          <div class="program-modal__fact"><dt>장소</dt><dd>가시림 메타세쿼이아 산책길 &amp; 유리온실 명상실</dd></div>
          <div class="program-modal__fact"><dt>정원</dt><dd>회차당 12명 내외 (선착순 마감)</dd></div>
          <div class="program-modal__fact"><dt>참가비</dt><dd>25,000원 (허브티 &amp; 온실 입장 포함)</dd></div>
        </dl>
        <section class="program-modal__section">
          <h4 class="program-modal__section-title">커리큘럼</h4>
          <ol class="program-modal__list">
            <li>숲길 호흡 워밍업 30분 — 보행 명상과 감각 깨우기</li>
            <li>온실 프라이빗 스트레칭 20분 — 관절 이완과 중심 잡기</li>
            <li>앉은 명상 &amp; 바디스캔 25분 — 호흡 리듬에 집중하며 내면 관찰</li>
            <li>티 세레머니 15분 — 허브차와 함께 일상으로 부드럽게 복귀</li>
          </ol>
        </section>
        <section class="program-modal__section">
          <h4 class="program-modal__section-title">준비물</h4>
          <ul class="program-modal__list">
            <li>움직임이 편한 복장, 가벼운 겉옷</li>
            <li>개인 물병 (온실 내 정수기 이용 가능)</li>
            <li>필요 시 개인 요가 매트 (현장 대여 가능)</li>
          </ul>
        </section>
        <aside class="program-modal__notice">
          <h4 class="program-modal__section-title">안내 사항</h4>
          <ul class="program-modal__list">
            <li>시작 10분 전까지 가든센터 리셉션에서 체크인 해 주세요.</li>
            <li>지각 시 안전을 위해 다음 회차로 이동될 수 있습니다.</li>
            <li>우천 시에도 온실 내 프로그램은 정상 진행됩니다.</li>
          </ul>
          <p class="program-modal__note">문의: contact@gasirim.kr / 070-4281-0906</p>
        </aside>
      `
    },
    'deep-rest': {
      title: '사운드 배스 명상: 딥레스트 세션',
      subtitle: '촛불과 싱잉볼 사운드로 몸과 마음을 깊이 이완하는 야간 명상.',
      ctaHref: 'https://forms.gle/6DeepRestSound',
      ctaLabel: '신청하기',
      gallery: [
        { src: 'assets/img/카페.jpg', alt: '촛불이 켜진 명상 공간' },
        { src: 'assets/img/유리온실2.jpg', alt: '온실 내부의 조용한 명상 공간' },
        { src: 'assets/img/유리온실.jpg', alt: '사운드 배스를 준비하는 퍼실리테이터' },
        { src: 'assets/img/main.jpg', alt: '석양이 비추는 가시림' }
      ],
      bodyHtml: `
        <h3 class="program-modal__section-title">프로그램 소개</h3>
        <p class="program-modal__paragraph">일몰 후 촛불과 싱잉볼의 공명 소리에 집중하여 몸과 마음을 깊이 이완하는 야간 명상 세션입니다. 전자기기 사용을 잠시 멈추고 감각을 휴식 모드로 전환합니다.</p>
        <dl class="program-modal__facts">
          <div class="program-modal__fact"><dt>진행 요일</dt><dd>매주 토요일 18:30 (100분)</dd></div>
          <div class="program-modal__fact"><dt>장소</dt><dd>가시림 온실 명상실</dd></div>
          <div class="program-modal__fact"><dt>정원</dt><dd>회차당 14명</dd></div>
          <div class="program-modal__fact"><dt>참가비</dt><dd>32,000원 (허브 블렌딩 티 포함)</dd></div>
        </dl>
        <section class="program-modal__section">
          <h4 class="program-modal__section-title">커리큘럼</h4>
          <ol class="program-modal__list">
            <li>웜업 스트레칭 &amp; 프라나야마 20분</li>
            <li>촛불 응시 명상 15분</li>
            <li>사운드 배스 &amp; 바디스캔 45분</li>
            <li>저널링 &amp; 나눔 20분</li>
          </ol>
        </section>
        <section class="program-modal__section">
          <h4 class="program-modal__section-title">준비물</h4>
          <ul class="program-modal__list">
            <li>편안한 복장과 두꺼운 양말</li>
            <li>개인 안대 또는 스카프 (선택)</li>
            <li>물병 또는 따뜻한 차</li>
          </ul>
        </section>
        <aside class="program-modal__notice">
          <h4 class="program-modal__section-title">안내 사항</h4>
          <ul class="program-modal__list">
            <li>프로그램 시작 15분 전까지 전자기기를 보관함에 보관해 주세요.</li>
            <li>사운드 배스 특성상 중도 입장이 어렵습니다.</li>
            <li>특정 사운드에 민감하다면 사전 문의 부탁드립니다.</li>
          </ul>
          <p class="program-modal__note">문의: meditation@gasirim.kr / 070-4281-0906</p>
        </aside>
      `
    },
    'horticulture-lab': {
      title: '감각원예 워크숍',
      subtitle: '계절 식물을 손끝으로 돌보며 식물 케어 루틴을 배우는 가드닝 클래스.',
      ctaHref: 'https://forms.gle/3HortiLab',
      ctaLabel: '신청하기',
      gallery: [
        { src: 'assets/img/가든센터.jpg', alt: '분갈이 도구와 식물을 준비하는 모습' },
        { src: 'assets/img/유리온실2.jpg', alt: '온실에서 식물을 살피는 참가자' },
        { src: 'assets/img/유리온실.jpg', alt: '가드닝 강사가 설명하는 장면' },
        { src: 'assets/img/카페.jpg', alt: '워크숍 이후 휴식을 즐기는 참가자' }
      ],
      bodyHtml: `
        <h3 class="program-modal__section-title">프로그램 소개</h3>
        <p class="program-modal__paragraph">식물 디렉터와 함께 계절별 식물을 분갈이하고 손질하며 식물과 교감하는 원예 워크숍입니다. 흙 배합부터 물주기, 빛 관리까지 생활 속 식물 케어 루틴을 익힙니다.</p>
        <dl class="program-modal__facts">
          <div class="program-modal__fact"><dt>진행 요일</dt><dd>매주 수요일 14:00 (90분)</dd></div>
          <div class="program-modal__fact"><dt>장소</dt><dd>가시림 가드닝 스튜디오</dd></div>
          <div class="program-modal__fact"><dt>정원</dt><dd>회차당 8명</dd></div>
          <div class="program-modal__fact"><dt>참가비</dt><dd>38,000원 (재료 포함)</dd></div>
        </dl>
        <section class="program-modal__section">
          <h4 class="program-modal__section-title">커리큘럼</h4>
          <ol class="program-modal__list">
            <li>식물 컨디션 진단 &amp; 흙 배합 이론</li>
            <li>분갈이 실습과 뿌리 관리</li>
            <li>잎 관리 &amp; 미세 분무법</li>
            <li>공간 연출 &amp; 일상 루틴 설계</li>
          </ol>
        </section>
        <section class="program-modal__section">
          <h4 class="program-modal__section-title">준비물</h4>
          <ul class="program-modal__list">
            <li>앞치마 (현장 대여 가능)</li>
            <li>편한 복장과 운동화</li>
            <li>필요 시 개인 장갑</li>
          </ul>
        </section>
        <aside class="program-modal__notice">
          <h4 class="program-modal__section-title">안내 사항</h4>
          <ul class="program-modal__list">
            <li>재료 준비를 위해 예약은 최소 2일 전까지 완료해 주세요.</li>
            <li>알레르기 정보가 있다면 신청 시 알려 주세요.</li>
            <li>완성 작품은 안전 포장 후 가져가실 수 있습니다.</li>
          </ul>
          <p class="program-modal__note">문의: garden@gasirim.kr / 070-4281-0906</p>
        </aside>
      `
    },
    'terrarium-clinic': {
      title: '테라리움 클리닉',
      subtitle: '자신만의 미니 정원을 디자인하고 오래도록 건강하게 돌보는 클래스.',
      ctaHref: 'https://forms.gle/5TerrariumClinic',
      ctaLabel: '신청하기',
      gallery: [
        { src: 'assets/img/가든센터.jpg', alt: '테라리움 재료를 고르는 참가자' },
        { src: 'assets/img/카페.jpg', alt: '완성된 테라리움을 감상하는 모습' },
        { src: 'assets/img/유리온실2.jpg', alt: '온실에서 테라리움을 관리하는 장면' },
        { src: 'assets/img/유리온실.jpg', alt: '강사가 테라리움 제작법을 설명하는 모습' }
      ],
      bodyHtml: `
        <h3 class="program-modal__section-title">프로그램 소개</h3>
        <p class="program-modal__paragraph">자갈과 이끼, 공기정화 식물을 활용해 감각적인 테라리움을 직접 제작합니다. 식물 배치부터 미니어처 연출, 사후 관리까지 한번에 익히는 집중 클래스입니다.</p>
        <dl class="program-modal__facts">
          <div class="program-modal__fact"><dt>진행 요일</dt><dd>매월 첫째 주 일요일 11:00 (110분)</dd></div>
          <div class="program-modal__fact"><dt>장소</dt><dd>가시림 가드닝 스튜디오</dd></div>
          <div class="program-modal__fact"><dt>정원</dt><dd>회차당 6명</dd></div>
          <div class="program-modal__fact"><dt>참가비</dt><dd>45,000원 (전 재료 포함)</dd></div>
        </dl>
        <section class="program-modal__section">
          <h4 class="program-modal__section-title">커리큘럼</h4>
          <ol class="program-modal__list">
            <li>테라리움 구조 이해 &amp; 재료 선택</li>
            <li>층 구성과 식재 실습</li>
            <li>미니어처 연출 &amp; 마감</li>
            <li>관리 루틴 &amp; Q&amp;A</li>
          </ol>
        </section>
        <section class="program-modal__section">
          <h4 class="program-modal__section-title">준비물</h4>
          <ul class="program-modal__list">
            <li>오염이 걱정될 경우 앞치마</li>
            <li>섬세한 작업을 위한 핀셋 (선택)</li>
            <li>작품 운반용 에코백 (현장 구매 가능)</li>
          </ul>
        </section>
        <aside class="program-modal__notice">
          <h4 class="program-modal__section-title">안내 사항</h4>
          <ul class="program-modal__list">
            <li>어린이는 보호자 동반 시 참여 가능합니다.</li>
            <li>완성 작품은 안전 포장해 드립니다.</li>
            <li>예약 변경은 3일 전까지 가능합니다.</li>
          </ul>
          <p class="program-modal__note">문의: garden@gasirim.kr / 070-4281-0906</p>
        </aside>
      `
    }
  };

  function initProgramModals() {
    const modal = document.querySelector('[data-program-modal]');
    const cards = document.querySelectorAll('[data-program-id]');
    if (!modal || !cards.length || !markOnce(modal, 'programModalBound')) return;

    const dialog = modal.querySelector('.program-modal__dialog');
    const content = modal.querySelector('[data-program-modal-content]');
    let activeTrigger = null;
    
    const bindCloseTargets = () => {
      const closers = modal.querySelectorAll('[data-program-modal-close]');
      closers.forEach((target) => {
        if (!markOnce(target, 'programModalCloseBound')) return;
        target.addEventListener('click', (event) => {
          event.preventDefault();
          closeModal();
        });
        target.addEventListener('keydown', (event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            closeModal();
          }
        });
      });
    };

    const updateGallery = (galleryRoot, images) => {
      const stageImg = galleryRoot.querySelector('[data-program-modal-stage]');
      const thumbButtons = Array.from(galleryRoot.querySelectorAll('.program-modal__thumb'));
      const prev = galleryRoot.querySelector('[data-program-modal-prev]');
      const next = galleryRoot.querySelector('[data-program-modal-next]');
      let activeIndex = 0;

      const setActive = (index) => {
        if (!images[index]) return;
        activeIndex = index;
        stageImg.src = images[index].src;
        stageImg.alt = images[index].alt;
        thumbButtons.forEach((btn, idx) => {
          btn.classList.toggle('is-active', idx === index);
          if (idx === index) {
            btn.setAttribute('aria-current', 'true');
            btn.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
          } else {
            btn.removeAttribute('aria-current');
          }
        });
      };

      thumbButtons.forEach((btn, idx) => {
        btn.addEventListener('click', () => setActive(idx));
      });

      prev?.addEventListener('click', () => {
        const nextIndex = (activeIndex - 1 + images.length) % images.length;
        setActive(nextIndex);
      });

      next?.addEventListener('click', () => {
        const nextIndex = (activeIndex + 1) % images.length;
        setActive(nextIndex);
      });

      setActive(0);
    };

    const renderModal = (id) => {
      const data = PROGRAM_DATA[id];
      if (!data) return false;
      content.innerHTML = '';

      const header = document.createElement('header');
      header.className = 'program-modal__header';
      header.innerHTML = `
        <div class="program-modal__header-top">
          <h2 class="program-modal__title" id="program-modal-title">${data.title}</h2>
          <a class="program-modal__cta" href="${data.ctaHref}" target="_blank" rel="noopener noreferrer">${data.ctaLabel}</a>
        </div>
        <p class="program-modal__subtitle">${data.subtitle}</p>
      `;
      content.appendChild(header);

      if (Array.isArray(data.gallery) && data.gallery.length) {
        const gallery = document.createElement('section');
        gallery.className = 'program-modal__gallery';
        gallery.setAttribute('aria-label', '프로그램 이미지 갤러리');
        gallery.innerHTML = `
          <figure class="program-modal__stage">
            <img src="${data.gallery[0].src}" alt="${data.gallery[0].alt}" data-program-modal-stage>
          </figure>
          <div class="program-modal__thumbs">
            <button type="button" class="program-modal__thumb-arrow" data-program-modal-prev aria-label="이전 이미지">&#8592;</button>
            <div class="program-modal__thumb-track" data-program-modal-track>
              ${data.gallery.map((image, index) => `
                <button type="button" class="program-modal__thumb${index === 0 ? ' is-active' : ''}" data-index="${index}">
                  <img src="${image.src}" alt="${image.alt}">
                </button>
              `).join('')}
            </div>
            <button type="button" class="program-modal__thumb-arrow" data-program-modal-next aria-label="다음 이미지">&#8594;</button>
          </div>
        `;
        content.appendChild(gallery);
        updateGallery(gallery, data.gallery);
      }

      const article = document.createElement('article');
      article.className = 'program-modal__article';
      article.innerHTML = data.bodyHtml;
      content.appendChild(article);

      content.scrollTop = 0;
      return true;
    };

    const closeModal = () => {
      if (modal.hasAttribute('hidden')) return;
      modal.setAttribute('hidden', '');
      modal.classList.remove('is-open');
      document.body.classList.remove('modal-open');
      content.innerHTML = '';
      if (activeTrigger) {
        activeTrigger.focus();
        activeTrigger = null;
      }
    };

    bindCloseTargets();

    const openModal = (id, trigger) => {
      if (!renderModal(id)) return;
      activeTrigger = trigger || null;
      modal.classList.add('is-open');
      modal.removeAttribute('hidden');
      document.body.classList.add('modal-open');
      if (dialog) {
        dialog.scrollTop = 0;
      }
      dialog?.focus({ preventScroll: true });
    };

    modal.addEventListener('click', (event) => {
      if (event.target.closest('[data-program-modal-close]')) {
        event.preventDefault();
        closeModal();
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !modal.hasAttribute('hidden')) {
        event.preventDefault();
        closeModal();
      }
    });

    cards.forEach((card) => {
      card.addEventListener('click', () => {
        const id = card.dataset.programId;
        openModal(id, card);
      });

      card.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          const id = card.dataset.programId;
          openModal(id, card);
        }
      });
    });
  }

  // ---------- Reveal on scroll ----------
  function initReveal() {
    const root = document.documentElement;
    if (!markOnce(root, 'revealInit')) return;

    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;

    if (!('IntersectionObserver' in window)) {
      els.forEach(el => el.classList.add('is-visible'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    els.forEach(el => io.observe(el));
  }

  // ---------- Parallax for hero image ----------
  function initParallax() {
    const el = document.querySelector('.intro-hero.parallax');
    if (!el || !markOnce(el, 'parallaxBound')) return;

    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const offset = (window.innerHeight - rect.top) * 0.06;
      el.style.transform = `translateY(${offset.toFixed(2)}px)`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ---------- Intro video autoplay ----------
  function initIntroVideo() {
    const hero = document.querySelector('.intro-hero[data-video]');
    const video = hero?.querySelector('video');
    const toggle = hero?.querySelector('[data-video-toggle]');
    const toggleText = toggle?.querySelector('.intro-video__toggle-text');
    if (!hero || !video || !markOnce(hero, 'introVideoBound')) return;

    video.muted = true;
    video.loop = true;
    video.autoplay = true;
    video.controls = false;
    video.setAttribute('muted', '');
    video.setAttribute('autoplay', '');
    video.setAttribute('loop', '');

    const updateToggle = (isPlaying) => {
      if (!toggle) return;
      toggle.classList.toggle('is-paused', !isPlaying);
      toggle.setAttribute('aria-pressed', String(!isPlaying));
      const label = isPlaying ? '영상 일시 정지' : '영상 재생';
      toggle.setAttribute('aria-label', label);
      if (toggleText) {
        toggleText.textContent = isPlaying ? '일시 정지' : '재생';
      }
    };

    const attemptPlay = () => {
      video.play().catch(() => {
        /* Some browsers require user interaction before autoplay */
        updateToggle(!video.paused);
      });
    };

    const onVisibilityChange = () => {
      if (!document.hidden) {
        attemptPlay();
      }
    };

    const onToggleClick = () => {
      if (video.paused) {
        video.play().catch(() => {
          updateToggle(false);
        });
      } else {
        video.pause();
      }
    };

    if (toggle) {
      toggle.addEventListener('click', onToggleClick);
      toggle.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onToggleClick();
        }
      });
    }

    video.addEventListener('canplay', attemptPlay, { once: true });
    document.addEventListener('visibilitychange', onVisibilityChange);
    video.addEventListener('play', () => updateToggle(true));
    video.addEventListener('pause', () => updateToggle(false));

    updateToggle(!video.paused);
    attemptPlay();
  }

  // ---------- Dropdown menus (keyboard + click) ----------
  function initNavDropdowns() {
    const root = document.documentElement;
    if (!markOnce(root, 'dropdownsBound')) return;

    const items = document.querySelectorAll('.nav-item');
    if (!items.length) return;

    items.forEach(item => {
      const submenu = item.querySelector('.nav-sub');

      item.addEventListener('keydown', (e) => {
        if ((e.key === 'Enter' || e.key === ' ') && submenu) {
          e.preventDefault();
          const willOpen = !submenu.classList.contains('is-active');
          document.querySelectorAll('.nav-sub.is-active').forEach(s => s.classList.remove('is-active'));
          submenu.classList.toggle('is-active', willOpen);
          item.setAttribute('aria-expanded', String(willOpen));
        }
        if (e.key === 'Escape' && submenu?.classList.contains('is-active')) {
          submenu.classList.remove('is-active');
          item.setAttribute('aria-expanded', 'false');
          item.blur();
        }
      });

      item.addEventListener('click', () => {
        if (!submenu) return;
        const willOpen = !submenu.classList.contains('is-active');
        document.querySelectorAll('.nav-sub.is-active').forEach(s => s.classList.remove('is-active'));
        submenu.classList.toggle('is-active', willOpen);
        item.setAttribute('aria-expanded', String(willOpen));
      });
    });

    // Click-away to close any open submenus
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.nav-item')) {
        document.querySelectorAll('.nav-sub.is-active').forEach(s => s.classList.remove('is-active'));
        document.querySelectorAll('.nav-item[aria-expanded="true"]')
          .forEach(i => i.setAttribute('aria-expanded', 'false'));
      }
    });
  }

  // ---------- Mobile hamburger (animated, top-right popover) ----------
  function initMobileMenu() {
    // If header is injected into #landing-header or #site-header, bind within it; otherwise fall back to document
    const host = document.querySelector('#landing-header, #site-header') || document;

    const toggle = host.querySelector('.nav-toggle');
    const navbar = host.querySelector('.navbar');
    if (!toggle || !navbar) return;

    // prevent double-binding if partials fire multiple times
    if (!markOnce(toggle, 'menuBound')) return;

    const close = () => {
      navbar.classList.remove('is-open');
      toggle.classList.remove('is-active');
      toggle.setAttribute('aria-expanded', 'false');
    };

    toggle.addEventListener('click', () => {
      const open = !navbar.classList.contains('is-open');
      navbar.classList.toggle('is-open', open);
      toggle.classList.toggle('is-active', open); // rotates the icon via CSS
      toggle.setAttribute('aria-expanded', String(open));
    });

    // Click-away to close
    document.addEventListener('click', (e) => {
      if (!navbar.classList.contains('is-open')) return;
      if (!navbar.contains(e.target) && !toggle.contains(e.target)) close();
    });

    // Escape to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') close();
    });
  }

  // ---------- Guard: close hamburger when resizing to desktop ----------
  function initNavResizeGuard() {
    if (window.__resizeGuardBound) return;
    window.__resizeGuardBound = true;

    const onResize = () => {
      const navbar = document.querySelector('.navbar');
      const toggle = document.querySelector('.nav-toggle');
      if (!navbar || !toggle) return;

      if (window.innerWidth > 992 && navbar.classList.contains('is-open')) {
        navbar.classList.remove('is-open');
        toggle.classList.remove('is-active');
        toggle.setAttribute('aria-expanded', 'false');
      }
    };
    window.addEventListener('resize', onResize, { passive: true });
  }


  // ---------- Header scroll behavior ----------
  function initHeaderScroll() {

    const header = document.querySelector('[data-header]');
    if (!header) return;
    let lastY = window.scrollY;
    const HYST = 3; // small deadzone

    const setHidden   = () => { header.classList.add('is-hidden'); header.classList.remove('is-scrolled','is-gradient'); document.documentElement.classList.remove('hdr-overlay'); };
    const setWhite    = () => { header.classList.remove('is-hidden'); header.classList.add('is-scrolled'); header.classList.remove('is-gradient'); document.documentElement.classList.add('hdr-overlay'); };
    const setGradient = () => { header.classList.remove('is-hidden'); header.classList.remove('is-scrolled'); header.classList.add('is-gradient'); document.documentElement.classList.add('hdr-overlay'); };

    function onScroll(){
      const y = window.scrollY;
      const goingDown = y > lastY + HYST;
      const goingUp   = y < lastY - HYST;

      if (goingDown){
        if (y > 0) setHidden();
      } else if (goingUp){
        if (y <= 0) setGradient();
        else setWhite();
      }

      lastY = y;
    }

    // Initial state: gradient at top, otherwise hidden (until a scroll-up occurs)
    if (window.scrollY <= 0) setGradient(); else setHidden();

    addEventListener('scroll', () => { requestAnimationFrame(onScroll); }, { passive:true });
  }

  // ---------- Hero carousel ----------
  function initHeroCarousel() {
    const hero = document.querySelector('.embla');
    if (!hero || !markOnce(hero, 'heroCarouselBound')) return;

    const autoplay = EmblaCarouselAutoplay({ delay: 5000 });
    const embla = EmblaCarousel(hero.querySelector('.embla__viewport'), { loop: true }, [autoplay]);

    const prev = hero.querySelector('.embla__prev');
    const next = hero.querySelector('.embla__next');
    prev?.addEventListener('click', embla.scrollPrev);
    next?.addEventListener('click', embla.scrollNext);

    const assetTexts = hero.querySelectorAll('.asset-text');
    const setAsset = (i) => {
      assetTexts.forEach((el, idx) => el.classList.toggle('is-active', idx === i));
    };
    setAsset(embla.selectedScrollSnap());
    embla.on('select', () => setAsset(embla.selectedScrollSnap()));
  }

  // ---------- Intro gallery slider ----------
  function initIntroGalleries() {
    const galleries = document.querySelectorAll('[data-gallery]');
    if (!galleries.length) return;

    galleries.forEach((gallery) => {
      if (!markOnce(gallery, 'introGalleryBound')) return;

      const track = gallery.querySelector('.intro-gallery-track');
      const viewport = gallery.querySelector('.intro-gallery-viewport');
      const baseSlides = track ? Array.from(track.children) : [];
      const prev = gallery.querySelector('[data-gallery-prev]');
      const next = gallery.querySelector('[data-gallery-next]');

      if (!track || !viewport || baseSlides.length <= 1) {
        prev?.setAttribute('disabled', '');
        next?.setAttribute('disabled', '');
        return;
      }

      // Clone slides to create a seamless loop
      baseSlides.forEach((slide) => {
        const clone = slide.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        clone.dataset.clone = 'true';
        track.appendChild(clone);
      });

      let itemWidth = 0;
      let loopWidth = 0;
      let offset = 0;
      let animationId = null;
      let lastTs = null;
      let pendingStart = false;
      const requestedSpeed = Number(gallery.dataset.gallerySpeed);
      const hasExplicitSpeed = Number.isFinite(requestedSpeed) && requestedSpeed > 0;
      const requestedDuration = Number(gallery.dataset.galleryDuration || 35);
      let pixelsPerSecond = hasExplicitSpeed ? requestedSpeed : 0;
      const motionQuery = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
      let allowAutoplay = !(motionQuery?.matches);
      const getTransitionDuration = () => {
        const raw = window.getComputedStyle(gallery).getPropertyValue('--intro-gallery-transition').trim();
        if (!raw) return 600;
        if (raw.endsWith('ms')) {
          const value = parseFloat(raw);
          return Number.isFinite(value) ? value : 600;
        }
        if (raw.endsWith('s')) {
          const value = parseFloat(raw);
          return Number.isFinite(value) ? value * 1000 : 600;
        }
        const value = parseFloat(raw);
        return Number.isFinite(value) ? value : 600;
      };
      const transitionDurationMs = getTransitionDuration();

      const wrapOffset = (value) => {
        if (!loopWidth) return value;
        let wrapped = value % loopWidth;
        if (wrapped < 0) wrapped += loopWidth;
        return wrapped;
      };

      const applyTransform = () => {
        track.style.transform = `translate3d(${-offset}px, 0, 0)`;
      };

      const measure = () => {
        if (!baseSlides.length) return;
        const rect = baseSlides[0].getBoundingClientRect();
        if (!rect.width) {
          requestAnimationFrame(measure);
          return;
        }
        const style = window.getComputedStyle(baseSlides[0]);
        const margin = (parseFloat(style.marginLeft) || 0) + (parseFloat(style.marginRight) || 0);
        itemWidth = rect.width + margin;
        loopWidth = itemWidth * baseSlides.length;
        if (!hasExplicitSpeed) {
          const duration = Number.isFinite(requestedDuration) && requestedDuration > 0 ? requestedDuration : 20;
          pixelsPerSecond = loopWidth / duration;
        }
        offset = wrapOffset(offset);
        applyTransform();
        if (pendingStart && allowAutoplay && !animationId && !document.hidden) {
          pendingStart = false;
          startAutoplay();
        }
      };

      const step = (ts) => {
        if (!allowAutoplay) {
          animationId = null;
          return;
        }
        if (lastTs == null) lastTs = ts;
        const delta = ts - lastTs;
        lastTs = ts;
        if (loopWidth && delta > 0 && pixelsPerSecond > 0) {
          const advance = (pixelsPerSecond * delta) / 1000;
          offset = wrapOffset(offset + advance);
          applyTransform();
        }
        animationId = requestAnimationFrame(step);
      };

      const startAutoplay = () => {
        if (!allowAutoplay || animationId) return;
        if (!itemWidth || !loopWidth) {
          pendingStart = true;
          measure();
          return;
        }
        gallery.classList.add('is-autoplaying');
        lastTs = null;
        animationId = requestAnimationFrame(step);
      };

      const stopAutoplay = () => {
        if (animationId) {
          cancelAnimationFrame(animationId);
          animationId = null;
        }
        lastTs = null;
        pendingStart = false;
        gallery.classList.remove('is-autoplaying');
      };

      const snapToNearest = () => {
        if (!itemWidth || !loopWidth) return;
        offset = wrapOffset(Math.round(offset / itemWidth) * itemWidth);
        applyTransform();
      };

      const shiftBy = (deltaSlides) => {
        if (!itemWidth || !loopWidth) return;
        stopAutoplay();
        snapToNearest();
        offset = wrapOffset(offset + deltaSlides * itemWidth);
        track.classList.add('is-animating');
        applyTransform();
        const onEnd = () => {
          track.classList.remove('is-animating');
          track.removeEventListener('transitionend', onEnd);
          startAutoplay();
        };
        track.addEventListener('transitionend', onEnd, { once: true });
        // Fallback in case transitionend doesn't fire (e.g., reduced-motion settings)
        window.setTimeout(() => {
          if (track.classList.contains('is-animating')) {
            track.classList.remove('is-animating');
            startAutoplay();
          }
        }, transitionDurationMs + 100);
      };

      prev?.addEventListener('click', () => shiftBy(-1));
      next?.addEventListener('click', () => shiftBy(1));

      const onVisibilityChange = () => {
        if (document.hidden) {
          stopAutoplay();
        } else {
          startAutoplay();
        }
      };

      document.addEventListener('visibilitychange', onVisibilityChange);

      const onMotionPreferenceChange = () => {
        allowAutoplay = !(motionQuery?.matches);
        if (!allowAutoplay) {
          stopAutoplay();
        } else {
          startAutoplay();
        }
      };
      if (motionQuery?.addEventListener) {
        motionQuery.addEventListener('change', onMotionPreferenceChange);
      } else if (motionQuery?.addListener) {
        motionQuery.addListener(onMotionPreferenceChange);
      }

      measure();
      window.addEventListener('resize', measure, { passive: true });
      if (document.hidden) {
        stopAutoplay();
      } else {
        startAutoplay();
      }
    });
  }

  // ---------- Shop filtering ----------
  function initShopFilters() {
    const catalog = document.querySelector('.shop-catalog');
    if (!catalog || !markOnce(catalog, 'shopFiltersBound')) return;

    const buttons = Array.from(catalog.querySelectorAll('[data-filter]'));
    const cards = Array.from(catalog.querySelectorAll('[data-category]'));
    if (!buttons.length || !cards.length) return;

    const normalise = (value) => (value || '').trim().toLowerCase();

    const applyFilter = (filter) => {
      const target = normalise(filter) || 'all';
      cards.forEach((card) => {
        const category = normalise(card.dataset.category);
        const matches = target === 'all' || category === target;
        card.classList.toggle('is-hidden', !matches);
      });
    };

    const updateUrl = (filter) => {
      if (!window.history?.replaceState) return;
      const url = new URL(window.location.href);
      if (!filter || normalise(filter) === 'all') {
        url.searchParams.delete('category');
      } else {
        url.searchParams.set('category', normalise(filter));
      }
      window.history.replaceState({}, '', url);
    };

    const activate = (button) => {
      const filter = button?.dataset.filter || 'all';
      buttons.forEach((btn) => {
        const isActive = btn === button;
        btn.classList.toggle('is-active', isActive);
        btn.setAttribute('aria-pressed', String(isActive));
      });
      applyFilter(filter);
      updateUrl(filter);
    };

    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        activate(button);
      });
    });

    const params = new URLSearchParams(window.location.search);
    const requested = normalise(params.get('category'));
    const initialButton = buttons.find((btn) => normalise(btn.dataset.filter) === requested) || buttons[0];
    activate(initialButton);
  }

  // ---------- Boot ----------
  function initAll() {
    initReveal();
    initParallax();
    initIntroVideo();
    initNavDropdowns();
    initMobileMenu();
    initNavResizeGuard();
    initHeaderScroll();
    initHeroCarousel();
    initIntroGalleries();
    initProgramModals();
    initShopFilters();
  }

  function main() {
    initAll();
  }

  document.addEventListener('DOMContentLoaded', main);
  // Fired by includes.js after partials are injected
  document.addEventListener('partials:loaded', main);
  
  // ---------- Page heading auto-fill ----------
  document.addEventListener("DOMContentLoaded", () => {
    const heading = document.querySelector("#site-header .page-heading");
    if (heading) {
      // Example: "Shop | 가시림" → "Shop"
      const pageTitle = document.title.replace(" | 가시림", "");
      heading.textContent = pageTitle;
    }
  });
})();
