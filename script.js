// =========================================================================
// ⭐ 1. 데이터 및 헬퍼 함수 정의
// =========================================================================

// ⭐ [튜토리얼 슬라이드쇼 데이터]
const tutorialData = {
    // Page 1: 이미지 3장 + 설명 텍스트
    1: {
        images: [
            'img/화면1_1.png', 
            'img/화면1_2.png', 
            'img/화면1_3.png'
        ],
        text: "1. 먼저, 이야기 분위기에 맞는 배경 이미지를 선택합니다.\n2. 선택한 배경 위에 꾸미기 이미지를 배치하여 장면을 꾸며주세요.\n3. 원하는 장면을 만들었다면, ‘영상 만들기’ 버튼을 누릅니다."
    }
};

// ⭐ [전역 변수]
let slideInterval; 
let currentSlideIndex = 0;
let currentTutorialPage = 1;


// ---------------------------------------------------------------------------------
// [전역 튜토리얼 제어 함수]
// ---------------------------------------------------------------------------------

// 튜토리얼 모달을 닫는 함수
function closeTutorial() {
    const overlay = document.querySelector('.tutorial-modal-overlay');
    if (overlay) {
        overlay.style.display = 'none';
    }
    // 모달 닫을 때 슬라이드 쇼 중지
    clearInterval(slideInterval);

    // ⭐ [핵심 수정] 튜토리얼 닫을 때 왼쪽 '슬라이드 메뉴(에셋 패널)' 강제 열기
    const assetPanel = document.querySelector('.asset-panel');
    const defaultTab = document.querySelector('.tab-button[data-tab="backgrounds"]');
    
    // 패널 열기
    if (assetPanel) {
        assetPanel.classList.add('open');
    }
    
    // 배경 탭 활성화 (시각적 효과)
    if (defaultTab) {
        // 기존 active 제거 후 다시 추가하여 확실하게 활성화
        document.querySelectorAll('.tab-button').forEach(t => t.classList.remove('active'));
        defaultTab.classList.add('active');
    }
    
    // 배경 리스트 보이기
    const assetLists = document.querySelectorAll('.asset-list');
    assetLists.forEach(list => list.style.display = 'none');
    const defaultList = document.getElementById('backgrounds');
    if(defaultList) defaultList.style.display = 'grid';
}

// 튜토리얼 페이지 전환 함수
function showTutorialPage(pageNumber) {
    // 모든 페이지 숨김 (active 클래스 제거)
    document.querySelectorAll('.tutorial-page').forEach(page => {
        page.classList.remove('active');
    });
    
    // 해당 페이지 표시
    const targetPage = document.querySelector(`#page-slide-${pageNumber}`);
    if (targetPage) {
        targetPage.classList.add('active'); // 투명도 1로 변경
        
        // 슬라이드 쇼 및 텍스트 렌더링 시작
        startTutorialSlides(pageNumber);
    }
}


// ---------------------------------------------------------------------------------
// [튜토리얼 슬라이드 쇼 로직]
// ---------------------------------------------------------------------------------

function renderSlides(pageNumber) {
    const data = tutorialData[pageNumber];
    if (!data) return;

    const track = document.getElementById(`slide-track-${pageNumber}`);
    const textElement = document.getElementById(`slide-text-${pageNumber}`);
    
    if (!track || !textElement) {
        console.error(`Page ${pageNumber}: 트랙이나 텍스트 요소를 찾을 수 없습니다.`);
        return;
    }

    // 1. 슬라이드 트랙에 이미지 추가
    track.innerHTML = '';
    data.images.forEach(src => {
        const img = document.createElement('img');
        img.src = src;
        img.className = 'slide-item';
        track.appendChild(img);
    });

    // 2. 텍스트 설정 (자막 부분)
    textElement.innerText = data.text;
    
    // 3. 초기 슬라이드 위치 리셋
    currentSlideIndex = 0;
    track.style.transform = `translateX(0px)`;
}

function nextSlide() {
    const data = tutorialData[currentTutorialPage];
    if (!data) return;

    const track = document.getElementById(`slide-track-${currentTutorialPage}`);
    const slideWidth = 638; // CSS에 정의된 슬라이드 폭

    // 다음 인덱스 계산
    currentSlideIndex = (currentSlideIndex + 1) % data.images.length;
    
    // 슬라이드 이동 (2초 간격)
    if (track) {
        track.style.transform = `translateX(-${currentSlideIndex * slideWidth}px)`;
    }
}

function startTutorialSlides(pageNumber) {
    // 이전 인터벌 중지
    clearInterval(slideInterval);
    
    currentTutorialPage = pageNumber;
    
    // 화면과 텍스트 먼저 렌더링
    renderSlides(pageNumber);
    
    // 2초 간격으로 슬라이드 자동 전환 시작
    slideInterval = setInterval(nextSlide, 2000);
}


// ---------------------------------------------------------------------------------
// [기존 애플리케이션 로직]
// ---------------------------------------------------------------------------------

// 애니메이션에서 제외될 파일 목록
const EXCLUDED_ANIMATION_FILES = [
    '성1.png', '가로등1-2.png', '분수대.png', '배.png', '집1.png',
    '쌍가로등1-2.png', '의자.png', '가로수.png',
    '마차.png', '조각상1.png'
].map(name => name.toLowerCase());


// URL 인코딩(한글) 문제를 해결한 헬퍼 함수
function getFilenameFromUrl(url) {
    if (!url) return null;
    let filename = '';
    try {
        const path = new URL(url).pathname;
        filename = path.substring(path.lastIndexOf('/') + 1);
    } catch (e) {
        const lastSlashIndex = url.lastIndexOf('/');
        if (lastSlashIndex !== -1) {
            filename = url.substring(lastSlashIndex + 1);
        } else {
            filename = url;
        }
    }
    filename = filename.replace(/['"]/g, '');
    try {
        return decodeURIComponent(filename);
    } catch (e) {
        return filename;
    }
}

// 파일이 제외 목록에 포함되는지 확인하는 헬퍼 함수
function isExcludedFile(url) {
    if (!url) return false;
    const filename = getFilenameFromUrl(url).toLowerCase();
    return EXCLUDED_ANIMATION_FILES.includes(filename);
}

// 엔딩 분기를 결정하는 헬퍼 함수
function getEndingType(backgroundUrl) {
    if (!backgroundUrl || backgroundUrl === 'none') return 'happy';
    const filename = getFilenameFromUrl(backgroundUrl);
    if (filename === '밤.png' || filename === '비.png' || filename === '나무.png' || filename === '꽃.png') {
        return 'sad';
    }
    return 'happy';
}

// 8개 장면에 대한 "AI" 내러티브 데이터
const narrativeData = {
    '1': {
        question: "1장: 가면 속의 만남\n로미오와 줄리엣이 처음 만난 장소는 어디일까요?",
        backgroundText: {
            '낮.png': "몬태규가의 로미오가 한낮의 거리를 걷다가", '밤.png': "몬태규가의 로미오가 달빛 아래를 걷다가",
            '비.png': "비 내리는 오후, 몬태규가의 로미오가", '눈.png': "함박눈 내리던 어느 날, 몬태규가의 로미오가",
            '계단.png': "몬태규가의 로미오가 웅장한 계단이 있는 곳을 지나다가", '도시.png': "도심 한가운데에서 몬태규가의 로미오가",
            '나무.png': "숲속에서 길을 잃은 몬태규가의 로미오가",
            '산.png': "몬태규가의 로미오가 험준한 산을 오르다가",
            '꽃.png': "몬태규가의 로미오가 만발한 꽃밭을 지나다가",
            'default': "몬태규가의 로미오가 길을 걷다가"
        },
        decorationText: {
            "집": " 외딴 오두막에서 여행 중이던 캐풀렛가의 줄리엣을 만납니다.",
            "성": " 성을 산책 중이던 캐풀렛가의 줄리엣을 만납니다.",
            "가로등": " 환한 가로등 아래에서 캐풀렛가의 줄리엣을 만납니다.",
            "가로수": " 푸른 가로수가 있는 길에서 캐풀렛가의 줄리엣을 만납니다.",
            "의자": " 벤치에 앉아 쉬고 있던 캐풀렛가의 줄리엣을 만납니다.",
            "배": " 강가에서 배를 타고 있던 캐풀렛가의 줄리엣을 만납니다.",
            "마차": " 화려한 마차를 타고 가던 캐풀렛가의 줄리엣을 만납니다.",
            "조각상": " 오래된 조각상 앞에서 캐풀렛가의 줄리엣을 만납니다.",
            "수풀": " 우거진 수풀 뒤에서 몸을 숨기던 캐풀렛가의 줄리엣을 만납니다.",
            "비행기": " 하늘 높이 나는 비행기를 바라보던 캐풀렛가의 줄리엣을 만납니다.",
            "샹들리에": " 화려한 샹들리에가 빛나는 홀에서 캐풀렛가의 줄리엣을 만납니다.",
            "다리": " 강을 가로지르는 다리 위에서 캐풀렛가의 줄리엣을 만납니다.",
            "자명종": " 자명종 소리에 놀라 돌아보던 캐풀렛가의 줄리엣을 만납니다.",
            "하프": " 아름다운 하프 소리가 들리는 곳에서 캐풀렛가의 줄리엣을 만납니다.",
            "탑": " 높은 탑 아래에서 캐풀렛가의 줄리엣을 만납니다.",
            "예배당": " 고요한 예배당 안에서 캐풀렛가의 줄리엣을 만납니다.",
            'default': " 우연히 캐풀렛가의 줄리엣을 만납니다."
        },
        finalText: { 'default': "둘은 첫눈에 반하지만, 원수의 자식임을 알고 절망합니다." }
    },
    '2': {
        question: "2장: 달빛 아래 맹세\n로미오가 줄리엣의 고백을 엿들은 곳은 어디인가요?",
        backgroundText: {
             '낮.png': "햇빛이 내리쬐던 낮, 로미오는", '밤.png': "달빛이 비추는 밤, 로미오는",
             '비.png': "차가운 비가 내리는 밤, 로미오는", '눈.png': "소리 없이 눈이 내리는 밤, 로미오는",
             '계단.png': "그녀의 집으로 향하는 계단 아래, 로미오는", '도시.png': "도시가 잠든 고요한 밤, 로미오는",
             '나무.png': "숲처럼 우거진 정원 나무 그늘 아래로 로미오는",
             '산.png': "저 멀리 산이 보이는 곳에서, 로미오는",
             '꽃.png': "아름다운 꽃이 핀 정원에서, 로미오는",
             'default': "줄리엣을 잊지 못한 로미오가 그녀를 찾아"
        },
        decorationText: {
            "집": " 그녀의 집 발코니를 올려다봅니다.",
            "성": " 그녀의 성 발코니를 올려다봅니다.",
            "가로등": " 희미한 가로등 불빛이 비추는 발코니를 올려다봅니다.",
            "가로수": " 정원의 가로수 뒤에 숨어 그녀의 발코니를 올려다봅니다.",
            "의자": " 발코니 아래 벤치에 앉아 그녀를 기다립니다.",
            "배": " 그녀를 만나 함께 배에 올라탑니다",
            "마차": " 마차가 세워진 정원 구석에서 그녀의 발코니를 올려다봅니다.",
            "조각상": " 조각상 뒤에 숨어 그녀의 발코니를 올려다봅니다.",
            "수풀": " 무성한 수풀 속에 숨어 그녀의 발코니를 올려다봅니다.",
            "비행기": " 하늘의 비행기 소리조차 들리지 않는 밤, 그녀의 발코니를 올려다봅니다.",
            "샹들리에": " 그녀의 방 안 샹들리에 불빛이 새어 나오는 발코니를 올려다봅니다.",
            "다리": " 근처 다리 아래 숨어 그녀의 발코니를 올려다봅니다.",
            "자명종": " 울리지 않는 자명종처럼 고요한 밤, 그녀의 발코니를 올려다봅니다.",
            "하프": " 하프 소리가 희미하게 들려오는 발코니를 올려다봅니다.",
            "탑": " 저택의 탑 아래에서 그녀의 발코니를 올려다봅니다.",
            "예배당": " 인근 예배당 벽에 기대 그녀의 발코니를 올려다봅니다.",
            'default': " 그녀의 방 발코니를 올려다봅니다."
        },
        finalText: { 'default': "줄리엣의 사랑 고백을 듣게 되며 두 사람은 영원한 사랑을 약속합니다." }
    },
    '3': {
        question: "3장: 성스러운 비밀\n두 사람의 비밀 결혼식은 어디서 열렸나요?",
        backgroundText: {
            '낮.png': "다음 날 낮, 두 사람은 조력자를 찾아가", '밤.png': "다음 날 어두운 밤, 두 사람은 사람들의 눈을 피해",
            '비.png': "비가 내리는 날, 두 사람은 비밀을 감춘 채", '눈.png': "눈이 내리는 날, 두 사람은 순결한 맹세를 위해",
            '계단.png': "계단앞에서 만난, 두 사람은", '도시.png': "도시의 수많은 눈을 피해, 두 사람은",
            '나무.png': "숲속 작은 예배당으로, 두 사람은",
            '산.png': "산속 깊은 곳으로 떠난, 두 사람은",
            '꽃.png': "꽃이 만발한 정원을 지나, 두 사람은",
            'default': "두 사람은 조력자를 찾아가"
        },
        decorationText: {
            "집": " 작은 오두막 안에서 조력자의 주례로 결혼합니다.",
            "성": " 버려진 성에서 조력자의 주례로 결혼합니다.",
            "가로등": " 촛불이 가로등처럼 두 사람을 비추는 예배당 안에서 조력자의 주례로 결혼합니다.",
            "가로수": " 정원의 가로수 아래에서 소박한 결혼식을 올립니다.",
            "의자": " 벤치에 앉아 조용히 결혼 서약을 나눕니다.",
            "배": " 강가의 작은 배 위에서 비밀 결혼식을 올립니다.",
            "마차": " 마차를 타고 도착한 예배당에서 조력자의 주례로 결혼합니다.",
            "조각상": " 성스러운 조각상이 지켜보는 아래 조력자의 주례로 결혼합니다.",
            "수풀": " 수풀에 가려진 비밀 장소에서 조력자의 주례로 결혼합니다.",
            "비행기": " 하늘을 나는 비행기 아래에서 조력자의 주례로 결혼합니다.",
            "샹들리에": " 샹들리에가 빛나는 작은 방에서 조력자의 주례로 결혼합니다.",
            "다리": " 아무도 없는 다리 위에서 조력자의 주례로 결혼합니다.",
            "자명종": " 자명종 소리가 멈춘 고요 속에서 조력자의 주례로 결혼합니다.",
            "하프": " 하프 소리가 울려 퍼지는 공간에서 조력자의 주례로 결혼합니다.",
            "탑": " 오래된 탑 안에서 조력자의 주례로 결혼합니다.",
            "예배당": " 고요한 예배당 안에서 조력자의 주례로 결혼합니다.",
            'default': " 예배당 안에서 조력자의 주례로 결혼합니다."
        },
        finalText: {
            'happy': "조력자는 화해를 이끌 것이라 믿으며 이들의 결혼을 돕고, 둘은 신성한 부부의 연을 맺습니다.",
            'sad': "조력자는 불길한 예감 속에서 이들의 결혼을 돕고, 둘은 신성한 부부의 연을 맺습니다."
        }
    },
    '4': {
        question: "4장: 광장의 결투\n비극적인 결투가 벌어진 장소는 어디인가요?",
        backgroundText: {
            '낮.png': "결혼식 직후, 뜨거운 태양 아래", '밤.png': "결혼식 직후, 어두운 밤",
            '비.png': "결혼식 직후, 비 내리는 거리", '눈.png': "결혼식 직후, 눈 내리는 혼란 속",
            '계단.png': "결혼식 직후, 광장 계단", '도시.png': "결혼식 직후, 시끄러운 도심 사이",
            '나무.png': "결혼식 직후, 광장 옆 나무 그늘",
            '산.png': "결혼식 직후, 산이 보이는 언덕 아래",
            '꽃.png': "결혼식 직후, 꽃이 흩날리는 광장",
            'default': "결혼식 직후, 거리"
        },
        decorationText: {
            "집": " 사람들이 지켜보는 집들 앞에서,",
            "성": " 저 멀리 캐풀렛가의 성이 보이는 광장에서,",
            "가로등": " 가로등이 켜지기 시작한 거리에서,",
            "가로수": " 가로수가 늘어선 광장에서,",
            "의자": " 벤치에 앉아 있던 광장에서,",
            "배": " 강가의 배 위에서,",
            "마차": " 마차가 지나다니는 광장에서,",
            "조각상": " 신성한 조각상이 바라보는 광장에서,",
            "수풀": " 광장 가장자리의 수풀 근처에서,",
            "비행기": " 하늘에 비행기가 다니는 공터에서,",
            "샹들리에": " 주변 건물 창문 속 샹들리에가 희미하게 보이는 광장에서,",
            "다리": " 광장으로 이어지는 다리 위에서,",
            "자명종": " 시간이 멈춘 듯 고요한 광장에서,",
            "하프": " 하프 소리가 들려오지 않는 광장에서,",
            "탑": " 높은 시계탑 아래 광장에서,",
            "예배당": " 예배당이 바라보이는 정원 앞에서,",
            "default": " 광장에서,"
        },
        finalText: { 'default': "줄리엣의 사촌은 로미오를 못마땅히 여겨 도발하며 싸움이\n시작되었고, 싸움을 말리던 로미오의 친구가 칼에 부상을 입습니다." }
    },
    '5': {
        question: "5장: 슬픈 이별과 추방\n로미오와 줄리엣이 마지막 밤을 보낸 곳은 어디인가요?",
        backgroundText: {
            '낮.png': "친구를 다치게 한 죄로 추방 명령을 받고, 날이 밝기 전", '밤.png': "친구를 다치게 한 죄로 추방 전 마지막 밤,",
            '비.png': "친구를 다치게 한 죄로 추방당하는 슬픈 밤, 창밖에 비가 내립니다.", '눈.png': "친구를 다치게 한 죄로 추방당하는 차가운 밤, 눈이 내립니다.",
            '계단.png': "친구를 다치게 한 죄로 추방당하기 전, 마지막으로 그녀의 방 계단을 올라,", '도시.png': "친구를 다치게 한 죄로 추방당하기 전 밤, 도시가 잠든 사이,",
            '나무.png': "친구를 다치게 한 죄로 추방당하기 전 밤, 창밖 나무가 흔들립니다.",
            '산.png': "친구를 다치게 한 죄로 추방당하기 전, 창밖으로 산을 바라보며,",
            '꽃.png': "친구를 다치게 한 죄로 추방당하기 전, 창밖의 꽃이 시들어가던 밤,",
            'default': "친구를 다치게 한 죄로 추방당하게 된 로미오."
        },
        decorationText: {
            "집": " 줄리엣의 집, 그녀의 방 안에서 두 사람은 마지막 밤을 보냅니다.",
            "성": " 줄리엣의 성, 그녀의 방 안에서 두 사람은 마지막 밤을 보냅니다.",
            "가로등": " 창밖 가로등 불빛이 꺼져갈 무렵, 두 사람은 마지막 밤을 보냅니다.",
            "가로수": " 창밖 가로수가 흔들리는 그녀의 방에서 두 사람은 마지막 밤을 보냅니다.",
            "의자": " 벤치에 앉아 서로를 위로하며 마지막 밤을 보냅니다.",
            "배": " 강가의 작은 배 위에서 서로를 위로하며 마지막 밤을 보냅니다.",
            "마차": " 떠나야 할 마차가 기다리는 가운데, 두 사람은 마지막 밤을 보냅니다.",
            "조각상": " 방 안의 조각상마저 침묵하는 가운데, 두 사람은 마지막 밤을 보냅니다.",
            "수풀": " 창밖 수풀 소리가 들려오는 그녀의 방에서 두 사람은 마지막 밤을 보냅니다.",
            "비행기": " 새벽 비행기가 이륙하는 소리를 들으며 두 사람은 마지막 밤을 보냅니다.",
            "샹들리에": " 방 안 샹들리에의 불빛이 희미한 가운데 두 사람은 마지막 밤을 보냅니다.",
            "다리": " 창밖으로 다리가 보이는 그녀의 방에서 두 사람은 마지막 밤을 보냅니다.",
            "자명종": " 울리지 않도록 꺼둔 자명종 옆에서 두 사람은 마지막 밤을 보냅니다.",
            "하프": " 하프 소리가 멈춘 그녀의 방에서 두 사람은 마지막 밤을 보냅니다.",
            "탑": " 성의 탑 꼭대기에 있는 그녀의 방에서 두 사람은 마지막 밤을 보냅니다.",
            "예배당": " 근처 예배당의 종소리가 들려오는 가운데 두 사람은 마지막 밤을 보냅니다.",
            "default": " 그녀의 방에서 두 사람은 마지막 밤을 보냅니다."
        },
        finalText: { 'default': "부부로서의 첫날밤이자 마지막 밤을 눈물로 함께한 뒤, 로미오는 도시를 떠나며 슬픈 이별을 맞이합니다." }
    },
    '6': {
        question: "6장: 강요된 약속\n줄리엣이 강제로 결혼을 약속하게 된 장소는 어디인가요?",
        backgroundText: {
            '낮.png': "로미오가 떠난 낮,", '밤.png': "절망적인 밤,", '비.png': "줄리엣의 마음처럼 비가 내리던 날,",
            '눈.png': "차가운 눈처럼 냉혹한 날,", '계단.png': "저택의 계단 아래서,", '도시.png': "도시의 명망 높은 다른 귀족과",
            '나무.png': "정원의 나무를 보며 로미오를 그리워하던 중,",
            '산.png': "저 멀리 산만 바라보던 줄리엣에게,",
            '꽃.png': "정원의 꽃이 시들어가던 날,",
            'default': "로미오가 떠난 후,"
        },
        decorationText: {
            "집": " 줄리엣의 집에서 부모님은 그녀를 다른 귀족과 강제로 결혼시키려 합니다.",
            "성": " 줄리엣의 부모님은 가문을 위해 그녀를 다른 귀족과 강제로 결혼시키려 합니다.",
            "가로등": " 가로등이 켜진 저녁, 부모님은 그녀의 슬픔을 오해하고 다른 귀족과의 결혼을 밀어붙입니다.",
            "가로수": " 정원의 가로수 아래에서 그녀는 다른 귀족과의 결혼을 강요받은 것을 떠올립니다.",
            "의자": " 벤치에 앉아 있던 줄리엣에게 부모님은 다른 귀족과의 결혼을 강요합니다.",
            "배": " 강가의 배 위에서 줄리엣은 다른 귀족과의 결혼을 강요받습니다.",
            "마차": " 화려한 마차가 도착하고, 부모님은 그녀를 마차에서 내린 공작과 강제로 약혼시킵니다.",
            "조각상": " 저택의 조각상 앞에서 부모님은 가문의 맹세를 위해 그녀를 다른 귀족과 강제로 결혼시키려 합니다.",
            "수풀": " 정원의 수풀 옆에서 그녀는 다른 귀족과의 결혼을 강요받습니다.",
            "비행기": " 굉음이 울리는 하늘 아래에서 그녀는 결혼을 강요받습니다.",
            "샹들리에": " 샹들리에가 빛나는 화려한 식사 자리에서 결혼을 강요받습니다.",
            "다리": " 부모님과 함께 건너던 다리 위에서 결혼을 강요받습니다.",
            "자명종": " 시끄러운 자명종 소리처럼 그녀의 마음을 흔드려는 결혼을 강요받습니다.",
            "하프": " 연회장의 하프 연주 소리 사이에서 그녀는 결혼을 강요받습니다.",
            "탑": " 탑처럼 높은 저택에서 그녀는 결혼을 강요받습니다.",
            "예배당": " 예배당 앞에서 부모님은 그녀를 다른 귀족과 강제로 결혼시키려 합니다.",
            "default": " 부모님은 그녀를 다른 귀족과 강제로 결혼시키려 합니다."
        },
        finalText: { 'default': "가문의 명예를 위한 결혼 강요에, 줄리엣은 거부할 수 없는 현실 앞에 깊은 절망에 빠집니다." }
    },
    '7': {
        question: "7장: 위험한 계획\n줄리엣이 조력자에게 비약을 받은 곳은 어디인가요?",
        backgroundText: {
            '낮.png': "다음 날 새벽, 줄리엣은", '밤.png': "늦은 밤, 줄리엣은",
            '비.png': "비를 맞으며, 줄리엣은", '눈.png': "게센 눈길이 휘날리던 날, 줄리엣은",
            '계단.png': "사람들의 눈을 피해, 줄리엣은", '도시.png': "도시 외곽으로 떠난, 줄리엣은",
            '나무.png': "산속 나무들을 헤치며, 줄리엣은",
            '산.png': "산속을 헤매던, 줄리엣은",
            '꽃.png': "시든 꽃밭을 지나, 줄리엣은",
            'default': "마지막 희망을 안고 줄리엣은 조력자를 찾아가"
        },
        decorationText: {
            "집": " 조력자의 작은 집에 다다라,",
            "성": " 성 아래 작은 무덤 아래에서 조력자를 만나,",
            "가로등": " 조력자의 예배당 안에서,",
            "가로수": " 가로수 아래에서 조력자를 만나,",
            "의자": " 벤치에 앉아 기다리던 조력자에게",
            "배": " 강가의 작은 배 위에서 조력자를 만나,",
            "마차": " 조력자의 마차안으로 숨어들어,",
            "조각상": " 조력자가 기다리던 예배당 조각상 아래에서,",
            "수풀": " 조력자의 작은 정원에서,",
            "비행기": " 비행기 소리가 들리는 조력자의 정원에서,",
            "샹들리에": " 샹들리에의 희미한 불빛이 들어오는 조력자의 성에서,",
            "다리": " 조력자가 숨어있던 다리 위에서,",
            "자명종": " 자명종에 소리 사이에 숨어있던, 조력자에게",
            "하프": " 조용히 하프 연주를 들으며 기다리던 조력자에게",
            "탑": " 예배당의 탑 안에서 조력자에게,",
            "예배당": " 조력자만이 아는 예배당 안 비밀 공간에서",
            "default": " 조력자의 방 안에서 그녀는"
        },
        finalText: {
            'default': "42시간 동안 잠드는 비약을 건네받습니다.조력자는 불안한 마음을\n억누르며 이 계획을 알릴 편지를 로미오에게 급히 보냅니다.",}
    },
    '8': {
        question: "8장: 운명의 갈림길\n두 연인의 마지막은 어떻게 될까요?",
        backgroundText: {
            '낮.png': "다행히 날이 밝아 전령은 무사히 길을 떠나,",
            '밤.png': "폭풍우가 몰아치는 밤이라 전령은 길을 떠나지 못해,",
            '비.png': "쏟아지는 비로 길이 막혀 전령은 제때 도착하지 못해,",
            '눈.png': "눈이 그쳐 전령은 곧장 로미오에게 향해 가며,",
            '계단.png': "신속한 전령 덕분에 편지는 빠르게 로미오에게 닿아,",
            '도시.png': "도시를 가로지른 전령 덕분에 편지는 무사히 로미오에게 도착해,",
            '나무.png': "숲속에서 길을 잃은 전령은 편지를 제때 전달하지 못해,",
            '산.png': "험준한 산을 넘은 전령은 편지를 로미오에게 전달하고,",
            '꽃.png': "역병이 번진 지역에 갇힌 전령은 편지를 전달하지 못해,",
            'default': "운명의 편지는 로미오를 향해 출발했지만,"
        },
        decorationText: {
             "집": " 결국 로미오는 줄리엣이 잠든 작은 오두막 무덤 앞에서,",
            "성": " 결국 로미오는 성 구석의 한 무덤앞에서",
            "가로등": " 결국 로미오는 꺼진 가로등이 비추는 무덤 아래에서",
            "가로수": " 결국 로미오는 가로수가 늘어선 무덤 옆에서 ",
            "의자": " 결국 로미오는 무덤 근처의 벤치 앞에서",
            "배": " 결국 로미오는 강가의 배 곁에 자리한 무덤에서,",
            "마차": " 결국 로미오는 무덤을 향하던 마차안에서",
            "조각상": " 결국 로미오는 결혼식 날 보았던 조각상 앞에서",
            "수풀": " 결국 로미오는 무덤을 둘러싼 수풀 사이에서,",
            "비행기": " 결국 로미오는 머리 위로 비행기가 지나가는 무덤 앞에서,",
            "샹들리에": " 결국 로미오는 무덤 근처의 버려진 샹들리에 아래에서,",
            "다리": " 결국 로미오는 강가 다리 옆 무덤 앞에서,",
            "자명종": " 결국 로미오는 울리지 않는 자명종처럼 고요한 무덤 앞에서,",
            "하프": " 결국 로미오는 하프 연주가 멈춘 무덤 앞에서,",
            "탑": " 결국 로미오는 오래된 탑 아래 무덤 앞에서,",
            "예배당": " 결국 로미오는 결혼을 약속하던 예배당 앞 무덤에서,",
            "default": " 결국 로미오는 줄리엣이 잠든 무덤앞에서,"
        },
        finalText: {
            'happy':" 줄리엣이 잠들어 있음을 알게 됩니다. 잠에서 깨어난 줄리엣과 재회하여\n두 사람은 모두의 축복 속에 도시로 돌아가 가문의 화해를 이끌어냅니다.",
            'sad': " 줄리엣이 죽었다고 믿고 절망합니다. 그는 무덤에서 독약을 마시고 생을 마치고,\n깨어난 줄리엣도 그를 따라 세상을 떠납니다. 두 연인의 비극 끝에 두 가문은 뒤늦게 화해합니다."
        }
    }

};

// ---------------------------------------------------------------------------------
// DOMContentLoaded 이벤트 리스너
// ---------------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('canvas');
    const verticalGuide = document.querySelector('.vertical-guide');
    const horizontalGuide = document.querySelector('.horizontal-guide');

    const storyTextContainer = document.querySelector('.story-text-container');
    const storyText = document.getElementById('story-text');

    const storyData = {
        '1': { background: '', decorations: [] }, '2': { background: '', decorations: [] },
        '3': { background: '', decorations: [] }, '4': { background: '', decorations: [] },
        '5': { background: '', decorations: [] }, '6': { background: '', decorations: [] },
        '7': { background: '', decorations: [] }, '8': { background: '', decorations: [] },
    };
    let currentScene = 1;


    // =================================================================
    // 에셋 아이템 드래그 & 클릭 동시 리스너
    // =================================================================
    
    // --- 꾸미기 아이템 드래그 & 클릭 리스너 ---
    document.querySelectorAll('.asset-item[data-type="decoration"]').forEach(item => {
        
        // 1. 드래그앤 드롭 시작 로직
        item.setAttribute('draggable', true);
        item.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', JSON.stringify({
                src: item.dataset.canvasSrc || item.src,
                alt: item.alt, 
                type: 'decoration' // 타입 명시
            }));
            e.dataTransfer.setData('text/image-src', item.dataset.canvasSrc || item.src);
        });

        // 2. 클릭 로직 
        item.addEventListener('click', () => {
            const canvasImageSrc = item.dataset.canvasSrc || item.src;
            let initialWidth = 400, initialHeight = 400;

            // --- 초기 크기 설정 로직 ---
            if (canvasImageSrc.includes('가로등1-2.png')) {
                initialHeight = 400;
                initialWidth = (340 / 1200) * initialHeight;
            } else if (canvasImageSrc.includes('쌍가로등1-2.png')) {
                initialHeight = 400;
                initialWidth = (450 / 1200) * initialHeight;
            } else if (canvasImageSrc.includes('가로수.png')) {
                initialHeight = 500;
                initialWidth = (700 / 1200) * initialHeight;
            } else if (canvasImageSrc.includes('의자.png')) {
                initialHeight = 200;
                initialWidth = (500 / 300) * initialHeight;
            } else if (canvasImageSrc.includes('배.png')) {
                initialHeight = 300;
                initialWidth = (800 / 400) * initialHeight;
            } else if (canvasImageSrc.includes('마차.png')) {
                initialHeight = 300;
                initialWidth = (400 / 300) * initialHeight;
            } else if (canvasImageSrc.includes('조각상1.png')) {
                initialHeight = 400;
                initialWidth = (800 / 1200) * initialHeight;
            } else if (canvasImageSrc.includes('비행기1.png')) {
                initialHeight = 300;
                initialWidth = (1200 / 800) * initialHeight;
            } else if (canvasImageSrc.includes('다리2.png')) {
                initialHeight = 300;
                initialWidth = (1200 / 600) * initialHeight;
            } else if (canvasImageSrc.includes('하프1.png')) {
                initialHeight = 300;
                initialWidth = (800 / 1200) * initialHeight;
            } else if (canvasImageSrc.includes('나무2-1.png')) {
                initialHeight = 300;
                initialWidth = (1000 / 1200) * initialHeight;
            } else if (canvasImageSrc.includes('회중시계1.png')) {
                initialHeight = 300;
                initialWidth = (600 / 1200) * initialHeight;
            } else if (canvasImageSrc.includes('탑1.png')) {
                initialHeight = 300;
                initialWidth = (600 / 1200) * initialHeight;
            }else if (canvasImageSrc.includes('무덤2.png')) {
                initialHeight = 300;
                initialWidth = (700 / 1200) * initialHeight;
            }
            // --- 초기 크기 설정 로직 끝 ---

            const newDeco = {
                id: 'deco-' + Date.now(),
                src: canvasImageSrc,
                alt: item.alt,
                width: initialWidth,
                height: initialHeight,
                // 클릭 시 중앙에 배치
                x: (canvas.offsetWidth / 2) - (initialWidth / 2),
                y: (canvas.offsetHeight / 2) - (initialHeight / 2),
                rotation: 0,
                scaleX: 1,
            };
            storyData[currentScene].decorations.push(newDeco);
            renderScene(currentScene);
        });
    });

    // --- 배경 아이템 드래그 & 클릭 리스너 ---
    document.querySelectorAll('.asset-item[data-type="background"]').forEach(item => {
        
        // 1. 드래그앤 드롭 시작 로직
        item.setAttribute('draggable', true);
        item.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', JSON.stringify({
                src: item.src,
                type: 'background' // 타입 명시
            }));
        });
        
        // 2. 클릭 로직
        item.addEventListener('click', () => {
            storyData[currentScene].background = item.src;
            renderScene(currentScene);
        });
    });

    // =================================================================
    // 캔버스 드롭 이벤트 리스너 (통합 처리)
    // =================================================================
    
    // 드롭할 수 있도록 허용
    canvas.addEventListener('dragover', (e) => {
        e.preventDefault(); 
    });

    // 드롭 이벤트 처리 (배경 또는 꾸미기)
    canvas.addEventListener('drop', (e) => {
        e.preventDefault();
        e.stopPropagation();

        // 1. 드래그된 데이터 가져오기
        let itemData;
        let imageSrc; 
        try {
            const dataString = e.dataTransfer.getData('text/plain');
            if (!dataString) return;
            itemData = JSON.parse(dataString);
            imageSrc = e.dataTransfer.getData('text/image-src');
        } catch (error) {
            console.error("Failed to parse drop data:", error);
            return;
        }

        // --- 2. 배경 이미지 처리 ---
        if (itemData.type === 'background') {
            storyData[currentScene].background = itemData.src;
            renderScene(currentScene);
            return; 
        }

        // --- 3. 꾸미기 아이템 처리 ---
        if (itemData.type === 'decoration') {
            
            // 3-1. 초기 크기 설정 로직
            let initialWidth = 400, initialHeight = 400;
            if (imageSrc.includes('가로등1-2.png')) {
                initialHeight = 400;
                initialWidth = (340 / 1200) * initialHeight;
            } else if (imageSrc.includes('쌍가로등1-2.png')) {
                initialHeight = 400;
                initialWidth = (450 / 1200) * initialHeight;
            } else if (imageSrc.includes('가로수.png')) { 
                initialHeight = 500;
                initialWidth = (700 / 1200) * initialHeight; 
            } else if (imageSrc.includes('의자.png')) { 
                initialHeight = 200;
                initialWidth = (500 / 300) * initialHeight; 
            } else if (imageSrc.includes('배.png')) { 
                initialHeight = 300;
                initialWidth = (800 / 400) * initialHeight; 
            } else if (imageSrc.includes('마차.png')) { 
                initialHeight = 300; 
                initialWidth = (400 / 300) * initialHeight; 
            } else if (imageSrc.includes('조각상1.png')) { 
                initialHeight = 400; 
                initialWidth = (800 / 1200) * initialHeight; 
            } else if (imageSrc.includes('비행기1.png')) { 
                initialHeight = 300; 
                initialWidth = (1200 / 800) * initialHeight; 
            } else if (imageSrc.includes('다리2.png')) { 
                initialHeight = 300; 
                initialWidth = (1200 / 600) * initialHeight; 
            } else if (imageSrc.includes('하프1.png')) { 
                initialHeight = 300; 
                initialWidth = (800 / 1200) * initialHeight; 
            } else if (imageSrc.includes('나무2-1.png')) { 
                initialHeight = 300; 
                initialWidth = (1000 / 1200) * initialHeight; 
            } else if (imageSrc.includes('회중시계1.png')) { 
                initialHeight = 300; 
                initialWidth = (600 / 1200) * initialHeight; 
            } else if (imageSrc.includes('탑1.png')) { 
                initialHeight = 300; 
                initialWidth = (600 / 1200) * initialHeight; 
            }
            
            // 3-2. 드롭된 위치 계산 (아이템 중앙 기준)
            const rect = canvas.getBoundingClientRect();
            let dropX = e.clientX - rect.left;
            let dropY = e.clientY - rect.top;
            
            const finalX = dropX - (initialWidth / 2);
            const finalY = dropY - (initialHeight / 2);

            // 3-3. 새 데코레이션 객체 생성 및 렌더링
            const newDeco = {
                id: 'deco-' + Date.now(),
                src: itemData.src,
                alt: itemData.alt,
                width: initialWidth,
                height: initialHeight,
                x: finalX,
                y: finalY,
                rotation: 0,
                scaleX: 1,
            };
            
            storyData[currentScene].decorations.push(newDeco);
            renderScene(currentScene);
        }
    });
    
    // --- 렌더링 함수 ---
    function renderScene(sceneNumber) {
        const data = storyData[sceneNumber];
        
        if (!data) {
            console.error("Scene data not found for scene:", sceneNumber);
            return;
        }

        // 이미지 경로를 sanitize하여 로드 문제 방지
        const bgUrl = data.background.replace(/[""]/g, '').trim(); 
        canvas.style.backgroundImage = bgUrl ? `url("${bgUrl}")` : 'none';

        Array.from(canvas.children).forEach(child => {
            if (child.classList.contains('decoration-item') && !child.classList.contains('story-text-container')) {
                child.remove();
            }
        });

        data.decorations.forEach(createDecorationElement);

        updateThumbnail(sceneNumber);
        updateNarrative();
    }

    // --- 꾸미기 엘리먼트 생성 ---
    function createDecorationElement(decoData) {
        const item = document.createElement('div');
        item.className = 'decoration-item';
        item.id = decoData.id;
        item.style.left = decoData.x + 'px';
        item.style.top = decoData.y + 'px';
        item.style.width = decoData.width + 'px';
        item.style.height = decoData.height + 'px';
        item.style.transform = `rotate(${decoData.rotation}deg)`;

        const img = document.createElement('img');
        img.src = decoData.src;
        img.style.transform = `scaleX(${decoData.scaleX})`;

        const controls = document.createElement('div');
        controls.className = 'controls';
        controls.innerHTML = `<button class="flip" title="좌우반전"><img src="img/좌우반전.png" alt="좌우반전"></button> <button class="delete" title="삭제"><img src="img/휴지통.png" alt="삭제"></button>`;

        const handles = ['tl', 'tr', 'bl', 'br', 'rotator'].map(type => {
            const handle = document.createElement('div');
            handle.className = `handle ${type}`;
            return handle;
        });

        item.append(img, ...handles, controls);
        const textContainer = canvas.querySelector('.story-text-container');
        if (textContainer) {
            canvas.insertBefore(item, textContainer);
        } else {
            canvas.appendChild(item);
        }
        
        makeInteractive(item); 
    }

    // --- 인터랙션 함수 (꾸미기 전용) ---
    function makeInteractive(element) {
        const dataArray = storyData[currentScene].decorations;
        const decoData = dataArray.find(d => d.id === element.id);

        if (!decoData) return;

        // mousedown 리스너 (선택 로직)
        element.addEventListener('mousedown', (e) => {
            const isHandle = e.target.closest('.handle');
            const isControl = e.target.closest('.controls');

            if (!element.classList.contains('selected')) {
                document.querySelectorAll('.decoration-item').forEach(el => el.classList.remove('selected'));
                element.classList.add('selected');
            }

            e.stopPropagation();
            
            if (!isHandle && !isControl) {
                const textContainer = canvas.querySelector('.story-text-container');
                if (textContainer) {
                    canvas.insertBefore(element, textContainer);
                } else {
                    canvas.appendChild(element);
                }
            }
        });

        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        
        // 드래그 시작 로직 (onmousedown)
        element.onmousedown = function(e) {
            if (e.target.closest('.handle') || e.target.closest('.controls')) return;
            
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        };

        function elementDrag(e) {
            verticalGuide.style.display = 'none';
            horizontalGuide.style.display = 'none';
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            let newTop = element.offsetTop - pos2;
            let newLeft = element.offsetLeft - pos1;
            const snapThreshold = 5;
            const canvasWidth = canvas.offsetWidth, canvasHeight = canvas.offsetHeight;
            const elementWidth = element.offsetWidth, elementHeight = element.offsetHeight;
            const canvasCenterX = canvasWidth / 2, canvasCenterY = canvasHeight / 2;
            const elementCenterX = newLeft + elementWidth / 2, elementCenterY = newTop + elementHeight / 2;
            let snappedX = false, snappedY = false;

            if (Math.abs(elementCenterX - canvasCenterX) < snapThreshold) {
                newLeft = canvasCenterX - elementWidth / 2;
                verticalGuide.style.left = `${canvasCenterX}px`;
                verticalGuide.style.display = 'block';
                snappedX = true;
            }
            if (Math.abs(elementCenterY - canvasCenterY) < snapThreshold) {
                newTop = canvasCenterY - elementHeight / 2;
                horizontalGuide.style.top = `${canvasCenterY}px`;
                horizontalGuide.style.display = 'block';
                snappedY = true;
            }
            if (!snappedX) verticalGuide.style.display = 'none';
            if (!snappedY) horizontalGuide.style.display = 'none';
            element.style.top = newTop + "px";
            element.style.left = newLeft + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
            verticalGuide.style.display = 'none';
            horizontalGuide.style.display = 'none';
            decoData.x = element.offsetLeft;
            decoData.y = element.offsetTop;
            updateThumbnail(currentScene);
        }

        element.querySelectorAll('.handle:not(.rotator)').forEach(handle => {
            handle.onmousedown = initResize;
        });

        function initResize(e) {
            e.preventDefault();
            e.stopPropagation();
            const handleType = e.target.classList[1];
            const rect = element.getBoundingClientRect();
            const angleRad = decoData.rotation * (Math.PI / 180);
            const aspectRatio = decoData.width / decoData.height;
            const corners = getRotatedCorners(rect, angleRad);
            const oppositeCornerMap = { tl: 'br', tr: 'bl', bl: 'tr', br: 'tl' };
            const pivot = corners[oppositeCornerMap[handleType]];
            const isLeft = handleType.includes('l');
            const isTop = handleType.includes('t');

            document.onmousemove = (e_move) => {
                const mouseVector = { x: e_move.clientX - pivot.x, y: e_move.clientY - pivot.y };
                const rotatedMouseVector = {
                    x: mouseVector.x * Math.cos(-angleRad) - mouseVector.y * Math.sin(-angleRad),
                    y: mouseVector.x * Math.sin(-angleRad) + mouseVector.y * Math.cos(-angleRad)
                };
                let newWidth, newHeight;
                if (Math.abs(rotatedMouseVector.x) / aspectRatio > Math.abs(rotatedMouseVector.y)) {
                    newWidth = Math.abs(rotatedMouseVector.x);
                    newHeight = newWidth / aspectRatio;
                } else {
                    newHeight = Math.abs(rotatedMouseVector.y);
                    newWidth = newHeight * aspectRatio;
                }
                if (newWidth < 20) return;
                const signX = isLeft ? -1 : 1, signY = isTop ? -1 : 1;
                const localCenter = { x: (signX * newWidth) / 2, y: (signY * newHeight) / 2 };
                const rotatedCenterVector = {
                    x: localCenter.x * Math.cos(angleRad) - localCenter.y * Math.sin(angleRad),
                    y: localCenter.x * Math.sin(angleRad) + localCenter.y * Math.cos(angleRad)
                };
                const newGlobalCenter = { x: pivot.x + rotatedCenterVector.x, y: pivot.y + rotatedCenterVector.y };
                const canvasRect = canvas.getBoundingClientRect();
                const finalLeft = newGlobalCenter.x - (newWidth / 2) - canvasRect.left;
                const finalTop = newGlobalCenter.y - (newHeight / 2) - canvasRect.top;
                element.style.width = newWidth + 'px';
                element.style.height = newHeight + 'px';
                element.style.left = finalLeft + 'px';
                element.style.top = finalTop + 'px';
            };

            document.onmouseup = () => {
                document.onmousemove = null;
                document.onmouseup = null;
                decoData.width = parseFloat(element.style.width);
                decoData.height = parseFloat(element.style.height);
                decoData.x = element.offsetLeft;
                decoData.y = element.offsetTop;
                updateThumbnail(currentScene);
            };
        }

        const rotator = element.querySelector('.rotator');
        rotator.onmousedown = function(e) {
            e.preventDefault(); e.stopPropagation();
            const rect = element.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2, centerY = rect.top + rect.height / 2;
            const startAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
            const startRotation = decoData.rotation;

            document.onmousemove = function(e_move) {
                const currentAngle = Math.atan2(e_move.clientY - centerY, e_move.clientX - centerX) * (180 / Math.PI);
                let newRotation = startRotation + (currentAngle - startAngle);
                const snapThreshold = 6;
                const snappedAngle = Math.round(newRotation / 90) * 90;
                if (Math.abs(newRotation - snappedAngle) < snapThreshold) {
                    newRotation = snappedAngle;
                }
                element.style.transform = `rotate(${newRotation}deg)`;
                decoData.rotation = newRotation;
            };
            document.onmouseup = function() {
                document.onmousemove = null; document.onmouseup = null;
                updateThumbnail(currentScene);
            };
        };

        // 좌우 반전 및 삭제 리스너
        element.querySelector('.flip').addEventListener('click', (e) => {
            e.stopPropagation(); // 버블링 방지
            decoData.scaleX *= -1;
            element.querySelector('img').style.transform = `scaleX(${decoData.scaleX})`;
            updateThumbnail(currentScene);
        });

        element.querySelector('.delete').addEventListener('click', (e) => {
            e.stopPropagation(); // 버블링 방지
            const index = dataArray.findIndex(d => d.id === element.id);
            if (index > -1) {
                dataArray.splice(index, 1);
                element.remove();
                updateThumbnail(currentScene);
                updateNarrative();
            }
        });
    }


    function getRotatedCorners(rect, angle) {
        const center = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
        const corners = {
            tl: { x: rect.left, y: rect.top }, tr: { x: rect.right, y: rect.top },
            bl: { x: rect.left, y: rect.bottom }, br: { x: rect.right, y: rect.bottom }
        };
        for (const key in corners) {
            corners[key] = rotatePoint(corners[key], center, angle);
        }
        return corners;
    }

    function rotatePoint(point, center, angle) {
        const dx = point.x - center.x;
        const dy = point.y - center.y;
        const newX = center.x + dx * Math.cos(angle) - dy * Math.sin(angle);
        const newY = center.y + dx * Math.sin(angle) + dy * Math.cos(angle);
        return { x: newX, y: newY };
    }

    // 캔버스 외부 클릭 시 선택 해제
    document.addEventListener('mousedown', (e) => {
        if (!e.target.closest('.decoration-item')) {
            document.querySelectorAll('.decoration-item').forEach(el => el.classList.remove('selected'));
        }
    });

    // --- 탭/씬 전환 로직 ---
    const tabs = document.querySelectorAll('.tab-button');
    const assetLists = document.querySelectorAll('.asset-list');
    const scenes = document.querySelectorAll('.scene');
    
    // 에셋 패널 엘리먼트 가져오기
    const assetPanel = document.querySelector('.asset-panel'); 

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const clickedTabId = tab.dataset.tab;
            const isActive = tab.classList.contains('active');
            
            // 1. 모든 탭의 active 상태 해제 (토글을 위해 클릭 전 상태를 저장)
            tabs.forEach(t => t.classList.remove('active'));

            if (isActive) {
                // 2-1. 현재 활성화된 탭을 다시 클릭하면 창 닫기
                assetPanel.classList.remove('open');
                assetLists.forEach(list => list.style.display = 'none');
            } else {
                // 2-2. 다른 탭을 클릭하거나 닫힌 상태에서 클릭하면 창 열기 및 탭 전환
                tab.classList.add('active'); // 새 탭 활성화
                assetPanel.classList.add('open'); // 창 열기 유지/열기
                
                // 내용 전환
                assetLists.forEach(list => list.style.display = 'none');
                const targetList = document.getElementById(clickedTabId);
                if(targetList) targetList.style.display = 'grid';
            }
        });
    });

    scenes.forEach(scene => {
        scene.addEventListener('click', () => {
            scenes.forEach(s => s.classList.remove('active'));
            scene.classList.add('active');
            currentScene = scene.dataset.scene;
            renderScene(currentScene);
        });
    });

    // --- 썸네일 업데이트 ---
    function updateThumbnail(sceneNumber) {
        const sceneEl = document.querySelector(`.scene[data-scene="${sceneNumber}"]`);
        if (sceneEl) {
            sceneEl.innerHTML = '';
            const sceneData = storyData[sceneNumber];
            
            if (!sceneData) return;

            // 이미지 경로를 sanitize하여 로드 문제 방지
            const bgUrl = sceneData.background.replace(/[""]/g, '').trim();
            sceneEl.style.backgroundImage = bgUrl ? `url("${bgUrl}")` : 'none';
            
            if(!canvas || canvas.offsetWidth === 0 || !sceneEl || sceneEl.offsetWidth === 0) return;
            const scaleX = sceneEl.offsetWidth / canvas.offsetWidth;
            const scaleY = sceneEl.offsetHeight / canvas.offsetHeight;

            sceneData.decorations.forEach(decoData => {
                const miniDeco = document.createElement('div');
                miniDeco.style.position = 'absolute';
                miniDeco.style.width = (decoData.width * scaleX) + 'px';
                miniDeco.style.height = (decoData.height * scaleY) + 'px';
                miniDeco.style.left = (decoData.x * scaleX) + 'px';
                miniDeco.style.top = (decoData.y * scaleY) + 'px';
                miniDeco.style.backgroundImage = `url("${decoData.src}")`;
                miniDeco.style.backgroundSize = 'contain';
                miniDeco.style.backgroundRepeat = 'no-repeat';
                miniDeco.style.backgroundPosition = 'center';
                miniDeco.style.transform = `rotate(${decoData.rotation}deg) scaleX(${decoData.scaleX})`;
                sceneEl.appendChild(miniDeco);
            });
        }
    }

    // --- 내러티브 업데이트 함수 ---
    function updateNarrative() {
        const sceneData = storyData[currentScene];
        const storyLogic = narrativeData[currentScene];

        if (!sceneData || !storyLogic) {
            console.error("Data or logic not found for scene:", currentScene);
            return; 
        }

        let fullText = "";

        // 현재 캔버스 배경 URL에서 파일명 추출
        const currentBgStyle = canvas.style.backgroundImage;

        const urlMatch = currentBgStyle.match(/url\(['"]?(.*?)['"]?\)/);
        const currentBgUrl = urlMatch ? urlMatch[1] : '';

        // 헬퍼 함수를 호출하여 디코딩된 파일명 사용
        const currentBgFilename = getFilenameFromUrl(currentBgUrl); 

        if (!currentBgFilename) { // 배경 파일명 없으면
            fullText = storyLogic.question;
            storyTextContainer.classList.add('default-text');
            storyTextContainer.classList.remove('narrative-text');
        } else {
            // 배경 파일명 있으면 내용 생성
            storyTextContainer.classList.remove('default-text');
            storyTextContainer.classList.add('narrative-text');
            
            const bgKey = storyLogic.backgroundText.hasOwnProperty(currentBgFilename) ? currentBgFilename : 'default';
            fullText = storyLogic.backgroundText[bgKey];

            // 꾸미기 추가 시
            const firstDeco = sceneData.decorations[0];
            
            if (firstDeco) {
                const decoAlt = firstDeco.alt; 
                let decoKey = 'default';

                if (storyLogic.decorationText.hasOwnProperty(decoAlt)) {
                    decoKey = decoAlt;
                }

                fullText += storyLogic.decorationText[decoKey];
            }

            // 결말 추가 로직
            const ending = getEndingType(currentBgUrl);
            const finalTextLogic = storyLogic.finalText;

            if (finalTextLogic[ending]) {
                fullText += "\n" + finalTextLogic[ending];
            } else {
                fullText += "\n" + finalTextLogic['default'];
            }
        }
        storyText.innerText = fullText;
    }

    // --- '영상 만들기' 버튼 클릭 리스너 (크기 변환 로직 포함) ---
    const exportButton = document.querySelector('.export-button');

    exportButton.addEventListener('click', () => {
        
        // 1. 현재 작업 중인 장면의 변경 사항을 저장
        const currentDecorations = Array.from(canvas.querySelectorAll('.decoration-item'));
        const currentSceneData = storyData[currentScene];
        
        // 데코레이션 데이터 업데이트 
        currentSceneData.decorations = currentDecorations.map(element => {
            const dataArray = storyData[currentScene].decorations;
            const existingData = dataArray.find(d => d.id === element.id) || {};
            
            // index.html에서 넘어가는 모든 꾸미기 아이템은 기본적으로 애니메이션 불가(false)로 설정
            return {
                ...existingData, 
                isAnimatable: false // index에서 추가된 이미지는 애니메이션 되지 않도록 플래그 설정
            };
        }).filter(d => Object.keys(d).length !== 0); 
        
        // ==========================================================
        // ⭐ 2. 캔버스 크기 변환 로직 (중앙 좌표계 적용) ⭐
        // ==========================================================
        const TARGET_CANVAS_WIDTH = 960;
        const TARGET_CANVAS_HEIGHT = 540;
        
        const currentCanvasWidth = 960; // 960 강제 가정
        const currentCanvasHeight = 540; // 540 강제 가정
        
        // 캔버스 중앙 좌표 (960x540 기준)
        const currentCenterX = currentCanvasWidth / 2;
        const currentCenterY = currentCanvasHeight / 2;

        // 비율 계산
        const scaleFactorX = currentCanvasWidth > 0 ? TARGET_CANVAS_WIDTH / currentCanvasWidth : 1;
        const scaleFactorY = currentCanvasHeight > 0 ? TARGET_CANVAS_HEIGHT / currentCanvasHeight : 1;

        // 모든 씬의 데코레이션 데이터 변환 적용
        Object.keys(storyData).forEach(sceneKey => {
            storyData[sceneKey].decorations.forEach(deco => {
                
                // 1. 현재 (x, y)를 중앙 기준으로 변환
                const relativeX = deco.x - currentCenterX;
                const relativeY = deco.y - currentCenterY;

                // 2. 크기 변환
                deco.width *= scaleFactorX;
                deco.height *= scaleFactorY;
                
                // 3. 중앙 기준 상대 좌표에 비율을 적용
                const scaledRelativeX = relativeX * scaleFactorX;
                const scaledRelativeY = relativeY * scaleFactorY;
                
                // 4. 변환된 좌표를 다시 좌측 상단 기준으로 변환
                const targetCenterX = TARGET_CANVAS_WIDTH / 2;
                const targetCenterY = TARGET_CANVAS_HEIGHT / 2;
                
                deco.x = targetCenterX + scaledRelativeX;
                deco.y = targetCenterY + scaledRelativeY;
            });
        });
        console.log(`캔버스 크기 변환 적용 완료. (X 비율: ${scaleFactorX.toFixed(2)}, Y 비율: ${scaleFactorY.toFixed(2)})`);
        // ==========================================================

        // 3. 모든 씬의 배경 및 데코레이션 데이터를 JSON 문자열로 변환하여 로컬 스토리지에 저장
        try {
            localStorage.setItem('storyboardData', JSON.stringify(storyData));
            console.log("--- 스토리보드 데이터 로컬 스토리지 저장 완료 (크기 변환 포함) ---");
            
            // 4. mobile.html로 페이지 이동
            window.location.href = 'mobile.html';

        } catch (e) {
            console.error("데이터 저장 및 페이지 이동 실패:", e);
            alert("데이터 저장 중 오류가 발생했습니다. 콘솔을 확인해주세요.");
        }
    });
    
    // 페이지 로드 시 썸네일 초기화
    document.querySelectorAll('.scene').forEach(scene => {
        setTimeout(() => updateThumbnail(scene.dataset.scene), 100);
    });

    // ⭐ [핵심 수정] 초기 로드 시 튜토리얼 1페이지 강제 실행 ⭐
    // 반드시 showTutorialPage(1)을 호출해야 .active 클래스가 붙고 투명도가 1이 되어 텍스트가 보입니다.
    showTutorialPage(1); 
    
    // --- 기존 UI 초기화 로직 ---
    const defaultTab = document.querySelector('.tab-button[data-tab="backgrounds"]');
    if (defaultTab) {
        defaultTab.classList.add('active'); 
    }
    
    // ⭐ [핵심 수정] 초기 상태에서 메뉴는 닫힌 상태로 시작 (패널 .open 클래스 제거)
    if (assetPanel) assetPanel.classList.remove('open');
    
    assetLists.forEach(list => list.style.display = 'none'); 
    const defaultList = document.getElementById('backgrounds'); 
    if(defaultList) defaultList.style.display = 'grid'; 

    renderScene(currentScene);
});