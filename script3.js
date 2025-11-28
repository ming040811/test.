// 애니메이션에서 제외될 파일 목록 (하드코딩된 정적 배경 요소)
const EXCLUDED_ANIMATION_FILES = [
    '성1.png', '가로등1-2.png', '분수대.png', '배.png', '집1.png',
    '쌍가로등1-2.png', '의자.png', '가로수.png','나무2-1.png','비행기1.png','다리2.png','하프1.png','샹들리에.png','탑1.png','예배당.png'
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
    // 파일명만 확인하여 제외 대상인지 판단
    return EXCLUDED_ANIMATION_FILES.includes(filename);
}

// 엔딩 분기를 결정하는 헬퍼 함수
function getEndingType(backgroundUrl) {
    if (!backgroundUrl || backgroundUrl === 'none') return 'happy';
    const filename = getFilenameFromUrl(backgroundUrl);
    if (filename === '밤.png' || filename === '비.png' || filename === '나무.png') {
        return 'sad';
    }
    return 'happy';
}

// 8개 장면에 대한 "AI" 내러티브 데이터 (Index Code에서 복사)
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
            '낮.png': "결혼식 직후, 뜨거운 태양 아래", '밤.png': "결혼식 직후, 어두운 밤의 광장",
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
            "조각상": " 조각상 아래에서,",
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
            '꽃.png': "정원의 꽃이 시들어가던 날,", // [오류 수정]
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
            'default': "42시간 동안 잠드는 비약을 건네받습니다.조력자는 불안한 마음을\nㄴ억누르며 이 계획을 알릴 편지를 로미오에게 급히 보냅니다.",}
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
        'happy':"로미오는 줄리엣이 잠들어 있음을 알게 됩니다.잠에서 깨어난 줄리엣과 재회하여\n두 사람은 모두의 축복 속에 도시로 돌아가 가문의 화해를 이끌어냅니다.",
        'sad': " 로미오는 줄리엣이 죽었다고 믿고 절망합니다. 그는 무덤에서 독약을 마시고 생을 마치고,\n깨어난 줄리엣도 그를 따라 세상을 떠납니다. 두 연인의 비극 끝에 두 가문은 뒤늦게 화해합니다."
    }
}
};


// ---------------------------------------------------------------------------------
// 회전/크기 조절 헬퍼 함수 (Index 코드에서 가져옴)
// ---------------------------------------------------------------------------------
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
// ---------------------------------------------------------------------------------


// ---------------------------------------------------------------------------------
// 텍스트 엘리먼트 동적 생성 (Mobile Code HTML에 없는 요소 추가)
// ---------------------------------------------------------------------------------
function createStoryTextElement(canvasElement) {
    const textContainer = document.createElement('div');
    textContainer.className = 'story-text-container narrative-text';
    
    const textP = document.createElement('p');
    textP.id = 'story-text';
    // P 태그를 컨테이너 안에 넣습니다.
    textContainer.appendChild(textP);
    canvasElement.appendChild(textContainer);
}

// ---------------------------------------------------------------------------------
// 내러티브 텍스트 생성 로직 
// ... (기존 코드 유지) ...
function generateNarrativeText(sceneNumber, sceneData) {
    const storyLogic = narrativeData[sceneNumber];
    if (!storyLogic) return "내러티브 데이터 없음";
    
    const currentBgUrl = sceneData.background;
    const currentBgFilename = getFilenameFromUrl(currentBgUrl); 

    if (!currentBgFilename) {
        return storyLogic.question;
    }

    let fullText = "";

    const bgKey = storyLogic.backgroundText.hasOwnProperty(currentBgFilename) ? currentBgFilename : 'default';
    fullText = storyLogic.backgroundText[bgKey];

    // 꾸미기 텍스트 반영 (가장 많이 등장하는 alt 값 사용)
    const decorations = sceneData.decorations;
    let selectedDecoAlt = 'default';

    if (decorations.length > 0) {
        const altCounts = {};
        let maxCount = 0;

        decorations.forEach(deco => {
            const alt = deco.alt || 'default'; // Index에서 alt가 넘어옴을 가정
            
            altCounts[alt] = (altCounts[alt] || 0) + 1;
            if (altCounts[alt] > maxCount) {
                maxCount = altCounts[alt];
                selectedDecoAlt = alt; 
            }
        });
        
        if (!storyLogic.decorationText.hasOwnProperty(selectedDecoAlt)) {
            selectedDecoAlt = 'default';
        }
    }
    
    fullText += storyLogic.decorationText[selectedDecoAlt];

    // 결말 추가 로직
    const ending = getEndingType(currentBgUrl);
    const finalTextLogic = storyLogic.finalText;

    if (finalTextLogic[ending]) {
        fullText += "\n" + finalTextLogic[ending];
    } else {
        fullText += "\n" + finalTextLogic['default'];
    }

    return fullText;
}

// ---------------------------------------------------------------------------------

// ⭐ [전역 변수 재정의]
let isRecording = false; 
let timerInterval = null;
let mediaRecorder = null;
let sceneVideos = {
    '1': { duration: 0, data: null, recordingStartTime: 0, chunks: [] }, '2': { duration: 0, data: null, recordingStartTime: 0, chunks: [] },
    '3': { duration: 0, data: null, recordingStartTime: 0, chunks: [] }, '4': { duration: 0, data: null, recordingStartTime: 0, chunks: [] },
    '5': { duration: 0, data: null, recordingStartTime: 0, chunks: [] }, '6': { duration: 0, data: null, recordingStartTime: 0, chunks: [] },
    '7': { duration: 0, data: null, recordingStartTime: 0, chunks: [] }, '8': { duration: 0, data: null, recordingStartTime: 0, chunks: [] },
}; 
let currentScene = '1';

const totalDurationSeconds = 120; // 2:00 -> 120초
let remainingTime = totalDurationSeconds;

// 전역 DOM 변수 선언 (나중에 initializeAppLogic에서 할당됨)
let canvas, drawingLayer, playButton, deleteButton, exportButton, durationDisplay, videoTimelineContainer;
let customCursor, canvasRect, currentColor, pickedUpElement, storyData;
let makeInteractive; // ⭐ makeInteractive를 전역 스코프에서 선언합니다.

// ⭐ [신규] 화면 전환 관련 DOM 변수
let editorView, finalView, viewWrapper, navPrev, navNext;
// ⭐ [신규] 최종 영상 뷰 DOM
let videoPlayer, loadingMessage, downloadButton, qrModal, qrcodeContainer, directDownloadLink, closeModalButton;
// ⭐ [제거 예정] 최종 영상 시뮬레이션 관련 DOM (finalDrawingLayer, finalDecorationContainer 사용하지 않음)
let finalCanvasWrapper;


// ⭐ 최종 영상 시뮬레이션 상태 변수 (제거)
let isVideoPlaying = false;  // 유지 (재생 중 전환 방지용)


// =========================================================================
// ⭐ [핵심 추가] 통합 캔버스에 모든 요소를 그리는 함수 (녹화용)
// =========================================================================
function drawAllToCanvas(targetCanvas, currentSceneData, storyTextElement) {
    if (!canvas) return;

    // 캔버스 크기 (960x540 고정 크기 사용)
    const CANVAS_WIDTH = 960;
    const CANVAS_HEIGHT = 540;
    targetCanvas.width = CANVAS_WIDTH;
    targetCanvas.height = CANVAS_HEIGHT;
    
    const ctx = targetCanvas.getContext('2d');
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // 1. 배경 이미지 그리기
    const bgUrl = currentSceneData.background.replace(/[""]/g, '').trim();
    if (bgUrl && bgUrl !== 'none') {
        const img = new Image();
        img.crossOrigin = 'anonymous'; 
        img.src = bgUrl;
        try {
            // 이미지 로드 여부를 확인하고 그립니다. (녹화 시점에는 이미 로드되어 있어야 함)
            // 비동기 로드 대신 동기적으로 로드된 것으로 가정하고 그립니다.
            ctx.drawImage(img, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        } catch(e) {
            console.warn("배경 이미지 통합 캔버스 그리기에 실패했습니다:", e);
        }
    }


    // 2. 꾸미기 요소 그리기
    const decorations = canvas.querySelectorAll('.decoration-item');
    const canvasRect = canvas.getBoundingClientRect();

    decorations.forEach(deco => {
        const imgEl = deco.querySelector('img');
        if (!imgEl) return;
        
        const rect = deco.getBoundingClientRect();
        
        // 에디터 뷰의 좌표를 기준으로 변환 (960x540 캔버스에 그리기)
        const x = rect.left - canvasRect.left;
        const y = rect.top - canvasRect.top;
        const width = rect.width;
        const height = rect.height;
        
        // 회전 및 스케일 변환 적용
        ctx.save();
        
        const centerX = x + width / 2;
        const centerY = y + height / 2;
        
        ctx.translate(centerX, centerY);
        
        const style = window.getComputedStyle(deco);
        const transform = style.transform; 
        
        // 회전 값 추출 및 적용
        const rotateMatch = transform.match(/rotate\(([-]?\d+(\.\d+)?)deg\)/);
        if (rotateMatch) {
            const rotation = parseFloat(rotateMatch[1]) * Math.PI / 180;
            ctx.rotate(rotation);
        }
        
        // 좌우 반전 스케일 적용 (scaleX)
        const decoData = currentSceneData.decorations.find(d => d.id === deco.id);
        const scaleX = decoData ? decoData.scaleX : 1;
        ctx.scale(scaleX, 1);

        ctx.drawImage(imgEl, -width / 2, -height / 2, width, height);

        ctx.restore();
    });
    
    // 3. 드로잉 레이어 (그림판) 복사
    ctx.drawImage(drawingLayer, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // 4. (추가) 내러티브 텍스트 그리기 ⭐⭐ 자막 녹화 핵심 로직 ⭐⭐
    if (storyTextElement) {
        const textContainer = storyTextElement.closest('.story-text-container');
        if (textContainer) {
            const textContent = storyTextElement.innerText;
            const style = window.getComputedStyle(textContainer);
            
            // 텍스트 컨테이너의 캔버스 기준 좌표 및 크기 계산 (HTML/CSS 값을 캔버스 좌표로 변환)
            const PADDING_X = 15;
            const PADDING_BOTTOM = 35;
            const PADDING_CONTAINER = 8; // .story-text-container padding
            
            // 텍스트 위치 계산 (컨테이너의 실제 위치를 추정)
            const containerLeft = PADDING_X; // 15px
            const containerRight = CANVAS_WIDTH - PADDING_X;
            const containerWidth = containerRight - containerLeft;
            
            // 텍스트 관련 스타일
            const FONT_SIZE = 15; 
            const LINE_HEIGHT_RATIO = 1.4;
            const LINE_HEIGHT = FONT_SIZE * LINE_HEIGHT_RATIO;
            
            const textColor = style.color; 
            const bgColor = style.backgroundColor;
            
            // 텍스트 줄바꿈 처리
            const lines = textContent.split('\n');
            const totalTextHeight = lines.length * LINE_HEIGHT;
            
            // 텍스트 컨테이너의 상단 Y 좌표 (bottom: 35px, padding-bottom: 8px)
            const textContainerTopY = CANVAS_HEIGHT - PADDING_BOTTOM - PADDING_CONTAINER - totalTextHeight - PADDING_CONTAINER;
            
            // 텍스트 배경 그리기 (직사각형)
            ctx.fillStyle = bgColor;
            ctx.fillRect(containerLeft - PADDING_CONTAINER, 
                         textContainerTopY, 
                         containerWidth + PADDING_CONTAINER * 2, 
                         totalTextHeight + PADDING_CONTAINER * 2); 

            // 텍스트 그리기
            ctx.fillStyle = textColor;
            ctx.font = `bold ${FONT_SIZE}px 'Malgun Gothic', sans-serif`; // 폰트 스타일도 bold로 통일
            ctx.textAlign = 'center';
            
            lines.forEach((line, index) => {
                // 텍스트 정렬 기준선 조정 (폰트 크기 고려)
                const textY = textContainerTopY + PADDING_CONTAINER + (index * LINE_HEIGHT) + (FONT_SIZE * 0.8);
                ctx.fillText(line.trim(), containerLeft + containerWidth / 2, textY); // 중앙 정렬
            });
        }
    }
}


// =========================================================================

// =========================================================================
// ⭐ [전역 함수] updateThumbnail 함수 
// =========================================================================
function updateThumbnail(sceneNumber) {
    if (!canvas || !storyData) return; 

    const sceneEl = document.querySelector(`.scene[data-scene="${sceneNumber}"]`);
    if (!sceneEl) return;

    // 기존 데코레이션 제거
    Array.from(sceneEl.querySelectorAll('div')).forEach(child => child.remove());

    const sceneData = storyData[sceneNumber];
    const bgUrl = sceneData.background.replace(/["']/g, '').trim(); 
    sceneEl.style.backgroundImage = bgUrl ? `url("${bgUrl}")` : 'none';
    
    if(canvas.offsetWidth === 0 || sceneEl.offsetWidth === 0) return;
    
    // 캔버스 크기를 기준으로 썸네일 스케일 계산
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
        // 부모 회전
        miniDeco.style.transform = `rotate(${decoData.rotation}deg)`;
        
        const miniDecoImg = document.createElement('div'); // img 대신 div로 스케일링 적용
        miniDecoImg.style.width = '100%';
        miniDecoImg.style.height = '100%';
        miniDecoImg.style.transform = `scaleX(${decoData.scaleX})`;
        miniDeco.appendChild(miniDecoImg); // 부모-자식 관계 생성
        
        sceneEl.appendChild(miniDeco);
    });
}
// =========================================================================

// ⭐ [전역 함수] moveElement 함수
function moveElement(element, mouseX, mouseY) {
    if (!element) return;
    
    let newLeft = mouseX - element.offsetWidth / 2;
    let newTop = mouseY - element.offsetHeight / 2;

    if (canvas) {
        newLeft = Math.max(0, Math.min(newLeft, canvas.offsetWidth - element.offsetWidth));
        newTop = Math.max(0, Math.min(newTop, canvas.offsetHeight - element.offsetHeight));
    }

    element.style.left = newLeft + 'px';
    element.style.top = newTop + 'px';

    const decoData = storyData[currentScene].decorations.find(d => d.id === element.id);
    if (decoData) {
        decoData.x = newLeft;
        decoData.y = newTop;
    }
}

// ⭐ [수정] createDecorationElement 함수: 타겟 컨테이너를 인수로 받아 재사용성을 높임 (전역 함수로 정의)
function createDecorationElement(decoData, targetContainer) { 
    const imgElement = document.createElement('img');
    imgElement.src = decoData.src;
    imgElement.alt = decoData.alt; 

    const decoElement = document.createElement('div');
    decoElement.id = decoData.id;
    
    // 이 부분에서 storyData와 canvas, makeInteractive 함수에 접근하기 위해 decoElement를 전역 변수처럼 처리
    const isExcludedByFilename = isExcludedFile(decoData.src);
    const isStaticElement = decoData.isAnimatable === false || isExcludedByFilename;

    decoElement.className = 'decoration-item'; 
    decoElement.dataset.isLocked = isStaticElement ? 'true' : 'false'; 
    decoElement.dataset.isAnimatable = !isStaticElement;
    
    decoElement.style.width = `${decoData.width}px`;
    decoElement.style.height = `${decoData.height}px`;
    decoElement.style.left = `${decoData.x}px`;
    decoElement.style.top = `${decoData.y}px`;
    
    decoElement.style.transform = `rotate(${decoData.rotation}deg)`;
    
    decoElement.style.zIndex = isStaticElement ? 1 : 10; 
    decoElement.style.pointerEvents = isStaticElement ? 'none' : 'auto';

    imgElement.style.transform = `scaleX(${decoData.scaleX})`;
    
    // 에디터 뷰(canvas)에만 컨트롤이 보이도록 분리 (DOM 객체 참조가 필요하므로 로직은 그대로 유지)
    if (targetContainer === canvas) {
        const controls = document.createElement('div');
        controls.className = 'controls';
        
        // ⭐ title 속성 추가 필요: HTML 코드에서 title="좌우반전", title="삭제"가 포함되어야 합니다.
        controls.innerHTML = `<button class="flip" title="좌우반전"><img src="img/좌우반전.png" alt="좌우반전"></button><button class="delete" title="삭제"><img src="img/휴지통.png" alt="삭제"></button>`;
        controls.style.transform = `translateX(-50%)`;

        const handles = ['tl', 'tr', 'bl', 'br', 'rotator'].map(type => {
            const handle = document.createElement('div');
            handle.className = `handle ${type}`;
            return handle;
        });
        
        decoElement.append(imgElement, ...handles, controls);

        // makeInteractive는 DOM 변수(canvas, storyData 등)에 접근해야 하므로, initializeAppLogic 내에서 정의됩니다.
        // 여기서는 함수 호출만 남겨두고, 실제 정의는 아래에서 수행됩니다.
        // ⭐ makeInteractive 함수가 전역 스코프에 정의되거나 접근 가능함을 가정하고 호출합니다.
        if (!isStaticElement && typeof makeInteractive === 'function') {
            makeInteractive(decoElement);
        } else {
            decoElement.classList.remove('selected');
            controls.style.display = 'none';
            handles.forEach(el => el.style.display = 'none');
        }
    } else {
        // 최종 영상 뷰 (finalDecorationContainer)에서는 컨트롤 없이 이미지 엘리먼트만 추가
        decoElement.append(imgElement);
        // 최종 뷰에서는 포인터 이벤트를 모두 비활성화
        decoElement.style.pointerEvents = 'none';
    }

    targetContainer.appendChild(decoElement);
}

function initializeAppLogic() {
    // DOM 변수들을 초기화
    canvas = document.getElementById('canvas');
    drawingLayer = document.getElementById('drawing-layer');
    playButton = document.getElementById('play-animation');
    deleteButton = document.getElementById('delete-selected');
    
    // ⭐ 화면 전환 및 최종 영상 관련 DOM 변수 초기화
    editorView = document.getElementById('editor-view');
    finalView = document.getElementById('final-view');
    viewWrapper = document.getElementById('view-wrapper');
    navPrev = document.getElementById('nav-prev');
    navNext = document.getElementById('nav-next');
    
    // 최종 영상 뷰 DOM
    videoPlayer = document.getElementById('finalVideoPlayer');
    loadingMessage = document.getElementById('loadingMessage');
    downloadButton = document.getElementById('downloadButton');
    qrModal = document.getElementById('qrModal');
    qrcodeContainer = document.getElementById('qrcode');
    directDownloadLink = document.getElementById('directDownload');
    closeModalButton = document.getElementById('closeModal');
    
    // ⭐ [수정] 최종 영상 시뮬레이션 관련 DOM (실제 사용하지 않음)
    finalCanvasWrapper = document.getElementById('final-canvas-wrapper');
    
    durationDisplay = document.getElementById('duration-display');
    videoTimelineContainer = document.getElementById('video-timeline');
    
    const ctx = drawingLayer.getContext('2d');
    // 가이드 라인 DOM 생성 (로직에서 사용되므로 생성)
    const verticalGuide = document.createElement('div'); 
    verticalGuide.className = 'vertical-guide';
    canvas.appendChild(verticalGuide);
    const horizontalGuide = document.createElement('div'); 
    horizontalGuide.className = 'horizontal-guide';
    canvas.appendChild(horizontalGuide);
    
    // ⭐ [신규] 1. 커스텀 커서 생성 및 상태 변수 추가
    customCursor = document.createElement('div');
    customCursor.id = 'custom-cursor';
    document.body.appendChild(customCursor);

    let isEnterPressed = false;
    canvasRect = canvas.getBoundingClientRect(); 
    
    drawingLayer.style.pointerEvents = 'none';

    // ⭐ [핵심 가정] 인덱스 페이지의 기준 크기 (960px x 540px 유지)
    const INDEX_CANVAS_WIDTH = 960; 
    const INDEX_CANVAS_HEIGHT = 540; 

    const currentCanvasWidth = canvas.offsetWidth;
    const currentCanvasHeight = canvas.offsetHeight;
    
    if (currentCanvasWidth === 0 || currentCanvasHeight === 0) {
        console.error("Canvas size is zero. Initialization skipped. (CSS Not Loaded?)");
        return; 
    }

    // ⭐ 크기 보정 비율 계산 및 안전 장치 적용 ⭐
    let ratioX = currentCanvasWidth / INDEX_CANVAS_WIDTH;
    let ratioY = currentCanvasHeight / INDEX_CANVAS_HEIGHT;

    if (ratioX > 1.0) ratioX = 1.0; 
    if (ratioY > 1.0) ratioY = 1.0; 
    
    // ⭐ [핵심 수정] 좌표 미세 조정 값: -7로 최종 결정
    const HORIZONTAL_ADJUSTMENT = -12; 

    createStoryTextElement(canvas);
    
    storyData = { 
        '1': { background: '', decorations: [], drawing: [] }, '2': { background: '', decorations: [], drawing: [] },
        '3': { background: '', decorations: [], drawing: [] }, '4': { background: '', decorations: [], drawing: [] },
        '5': { background: '', decorations: [], drawing: [] }, '6': { background: '', decorations: [], drawing: [] },
        '7': { background: '', decorations: [], drawing: [] }, '8': { background: '', decorations: [], drawing: [] },
    }; 
    let narrativeTexts = {}; 

    // 로컬 스토리지에서 데이터 로드 (좌표 보정 포함)
    const savedData = localStorage.getItem('storyboardData');

    if (savedData) {
        try {
            const parsedData = JSON.parse(savedData);
            
            Object.keys(parsedData).forEach(key => {
                if (storyData[key] && parsedData[key]) { 
                    
                    const loadedDecorations = (parsedData[key].decorations || []).map(deco => {
                        const newDeco = {
                            ...deco,
                            x: (deco.x * ratioX) + HORIZONTAL_ADJUSTMENT,
                            y: deco.y * ratioY,
                            width: deco.width * ratioX,
                            height: deco.height * ratioY,
                        };
                        return newDeco;
                    });

                    const loadedDrawing = (parsedData[key].drawing || []).map(path => {
                        const newPoints = (path?.points || []).map(point => ({
                            x: (point.x * ratioX) + HORIZONTAL_ADJUSTMENT,
                            y: point.y * ratioY
                        }));
                        return { ...path, points: newPoints };
                    });
                    
                    storyData[key] = {
                        ...storyData[key], 
                        background: parsedData[key].background || '',
                        decorations: loadedDecorations,
                        drawing: loadedDrawing
                    };
                    narrativeTexts[key] = generateNarrativeText(key, storyData[key]);
                }
            });
            console.log("스토리 데이터, 꾸미기 요소 및 애니메이션 경로 보정 완료.");
        } catch (e) {
            console.error("로컬 스토리지 데이터 파싱 오류:", e);
        }
    }
        
    currentScene = document.querySelector('.scene.active').dataset.scene || '1';
    let isAnimating = false; 

    const initialActiveSwatch = document.querySelector('.color-swatch.active');
    currentColor = initialActiveSwatch ? initialActiveSwatch.dataset.color : '#7B7B7B';
    
    customCursor.style.backgroundColor = currentColor;

    remainingTime = totalDurationSeconds;

    // -------------------------------------------------------------------------
    // ⭐ makeInteractive 함수 정의 (선택 및 조작) ⭐
    // makeInteractive를 전역 변수로 선언했으므로, 여기서 할당합니다.
    // -------------------------------------------------------------------------
    makeInteractive = function(element) {
        const dataArray = storyData[currentScene].decorations;
        const decoData = dataArray.find(d => d.id === element.id);

        if (!decoData) return;

        // --- 마우스 이벤트 핸들러 통합 (수정: 클릭 시 선택/자석 해제, 드래그 로직은 내부에) ---
        element.addEventListener('mousedown', (e) => {
            e.stopPropagation(); 
            
            const isHandle = e.target.closest('.handle');
            const isControl = e.target.closest('.controls');
            
            // 1. 자석 해제 로직 (자석으로 잡혀있었든 아니든)
            if (pickedUpElement) {
                dropElement();
                pickedUpElement = null;
            }

            // 2. 선택 로직 (클릭한 요소가 이미 선택되어 있다면 선택 해제는 캔버스 mousedown으로 위임)
            if (!element.classList.contains('selected')) {
                // 다른 요소 선택 해제
                document.querySelectorAll('.decoration-item.selected').forEach(el => el.classList.remove('selected'));
                // 현재 요소 선택
                element.classList.add('selected');
            } else if (isHandle || isControl) {
                // 이미 선택된 상태에서 컨트롤/핸들을 클릭하면 선택 상태 유지
                // (선택 해제 방지)
            } else {
                // 이미 선택된 상태에서 요소를 다시 클릭하면? (선택 유지하고 드래그 시작)
            }


            // 3. 드래그(이동) 로직 시작 (핸들/컨트롤 클릭이 아닐 경우)
            if (!isHandle && !isControl) {
                if (isRecording) {
                    e.preventDefault();
                    return; 
                }
                
                element.style.zIndex = 200; 
                let pos3 = e.clientX;
                let pos4 = e.clientY;
                
                document.onmouseup = closeDragElement;
                document.onmousemove = elementDrag;
                
                function elementDrag(e_move) {
                    verticalGuide.style.display = 'none';
                    horizontalGuide.style.display = 'none';
                    let pos1 = pos3 - e_move.clientX;
                    let pos2 = pos4 - e_move.clientY;
                    pos3 = e_move.clientX;
                    pos4 = e_move.clientY;
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
                    }
                    if (Math.abs(elementCenterY - canvasCenterY) < snapThreshold) {
                        newTop = canvasCenterY - elementHeight / 2;
                        horizontalGuide.style.top = `${canvasCenterY}px`;
                        horizontalGuide.style.display = 'block';
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
                    element.style.zIndex = 10;
                    decoData.x = element.offsetLeft;
                    decoData.y = element.offsetTop;
                    updateThumbnail(currentScene); 
                }
            }
        });
        
        // --- 크기 조절 (Resize) 로직 ---
        element.querySelectorAll('.handle:not(.rotator)').forEach(handle => {
            handle.onmousedown = initResize;
        });

// ⭐⭐⭐ 크기 조절 로직 수정된 부분 시작 ⭐⭐⭐
        function initResize(e) {
            if (isRecording) return;
            e.preventDefault();
            e.stopPropagation();
            const handleType = e.target.classList[1];
            const rect = element.getBoundingClientRect();
            const angleRad = decoData.rotation * (Math.PI / 180);
            const aspectRatio = decoData.width / decoData.height;
            
            // 피벗 지점 계산
            const corners = getRotatedCorners(rect, angleRad);
            const oppositeCornerMap = { tl: 'br', tr: 'bl', bl: 'tr', br: 'tl' };
            const pivot = corners[oppositeCornerMap[handleType]];
            
            const controls = element.querySelector('.controls');

            document.onmousemove = (e_move) => {
                // 1. 마우스 위치에서 피벗 위치까지의 벡터 계산 (글로벌 좌표)
                const mouseVector = { x: e_move.clientX - pivot.x, y: e_move.clientY - pivot.y };
                
                // 2. 벡터를 요소의 회전각만큼 역회전 (요소의 로컬 좌표계로 변환)
                const rotatedMouseVector = {
                    x: mouseVector.x * Math.cos(-angleRad) - mouseVector.y * Math.sin(-angleRad),
                    y: mouseVector.x * Math.sin(-angleRad) + mouseVector.y * Math.cos(-angleRad)
                };
                
                let newWidth, newHeight;
                
                // 3. 종횡비 유지 (aspectRatio lock)
                newWidth = Math.abs(rotatedMouseVector.x);
                newHeight = newWidth / aspectRatio;
                
                // 새로운 높이를 기준으로 계산한 값이 더 클 경우 (Y축 이동이 주가 될 때)
                if (Math.abs(rotatedMouseVector.y) * aspectRatio > newWidth) { 
                    newHeight = Math.abs(rotatedMouseVector.y);
                    newWidth = newHeight * aspectRatio;
                }
                
                if (newWidth < 20 || newHeight < 20) return; // 최소 크기 제한

                // 4. 새로운 로컬 중심점 계산 (로컬 좌표계)
                const localCenterX = rotatedMouseVector.x > 0 ? newWidth / 2 : -newWidth / 2;
                const localCenterY = rotatedMouseVector.y > 0 ? newHeight / 2 : -newHeight / 2;
                
                // 5. 로컬 중심점을 글로벌 좌표계로 회전 (Rotation)
                const rotatedCenterVector = {
                    x: localCenterX * Math.cos(angleRad) - localCenterY * Math.sin(angleRad),
                    y: localCenterX * Math.sin(angleRad) + localCenterY * Math.cos(angleRad)
                };
                
                // 6. 새로운 글로벌 중심점 계산
                const newGlobalCenter = { x: pivot.x + rotatedCenterVector.x, y: pivot.y + rotatedCenterVector.y };
                
                // 7. 캔버스 기준으로 최종 위치와 크기 적용
                const canvasRect = canvas.getBoundingClientRect();
                
                // 최종 위치 계산: 글로벌 중심 - 캔버스 시작점 - 요소 크기 절반
                const finalLeft = newGlobalCenter.x - (newWidth / 2) - canvasRect.left;
                const finalTop = newGlobalCenter.y - (newHeight / 2) - canvasRect.top;
                
                element.style.width = newWidth + 'px';
                element.style.height = newHeight + 'px';
                element.style.left = finalLeft + 'px';
                element.style.top = finalTop + 'px';

                if (controls) {
                    controls.style.transform = `translateX(-50%)`;
                }
            };
// ⭐⭐⭐ 크기 조절 로직 수정된 부분 끝 ⭐⭐⭐

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

        // --- 회전 (Rotate) 로직 ---
        const rotator = element.querySelector('.rotator');
        rotator.onmousedown = function(e) {
            if (isRecording) return; 
            e.preventDefault();
            e.stopPropagation();
            const rect = element.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2, centerY = rect.top + rect.height / 2;
            const startAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
            const startRotation = decoData.rotation;
            
            const controls = element.querySelector('.controls');

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

                if (controls) {
                    controls.style.transform = `translateX(-50%)`;
                }
            };
            document.onmouseup = function() {
                document.onmousemove = null; document.onmouseup = null;
                updateThumbnail(currentScene); 
            };
        };

        // --- 좌우 반전 및 삭제 리스너 (복원) ---
        element.querySelector('.flip').addEventListener('click', (e) => {
            if (isRecording) return;
            e.stopPropagation(); 
            decoData.scaleX *= -1;
            element.querySelector('img').style.transform = `scaleX(${decoData.scaleX})`;
            updateThumbnail(currentScene); 
        });

        // ⭐ 복원: 개별 컨트롤 팝업의 삭제 버튼 기능 (confirm() 제거됨) ⭐
        element.querySelector('.delete').addEventListener('click', (e) => {
            if (isRecording) return;
            e.stopPropagation(); 
            
            // confirm() 제거됨: 바로 삭제
            const index = dataArray.findIndex(d => d.id === element.id);
            if (index > -1) {
                dataArray.splice(index, 1);
                element.remove();
                updateThumbnail(currentScene); 
                updateNarrative();
            }
        });
    }


    // -------------------------------------------------------------------------
    // 캔버스 드로잉/크기 관련 함수
    // -------------------------------------------------------------------------
    // ⭐ [수정] 범용 드로잉 함수: 컨텍스트와 데이터 경로를 인수로 받습니다.
    function redrawDrawing(layerCtx, data) {
        layerCtx.clearRect(0, 0, layerCtx.canvas.width, layerCtx.canvas.height);
        data.forEach(path => {
            if (path.points.length < 2) return;

            layerCtx.beginPath();
            layerCtx.lineJoin = 'round';
            layerCtx.lineCap = 'round';
            layerCtx.lineWidth = path.size;

            if (path.mode === 'draw') {
                layerCtx.globalCompositeOperation = 'source-over';
                layerCtx.strokeStyle = path.color;
            } else if (path.mode === 'erase') {
                layerCtx.globalCompositeOperation = 'destination-out';
                layerCtx.strokeStyle = 'rgba(0,0,0,1)';
            }

            layerCtx.moveTo(path.points[0].x, path.points[0].y);
            for (let i = 1; i < path.points.length; i++) {
                layerCtx.lineTo(path.points[i].x, path.points[i].y);
            }
            layerCtx.stroke();
            layerCtx.closePath();
        });
    }
    
    function resizeCanvas() {
        drawingLayer.width = canvas.offsetWidth;
        drawingLayer.height = canvas.offsetHeight;
        
        canvasRect = canvas.getBoundingClientRect(); 

        redrawDrawing(ctx, storyData[currentScene].drawing);
    }
    window.addEventListener('resize', resizeCanvas);


    // -------------------------------------------------------------------------
    // ⭐ Timer / Recording Logic ⭐
    // -------------------------------------------------------------------------
    
    function formatTime(seconds) {
        const roundedSeconds = Math.max(0, Math.round(seconds)); 
        const min = Math.floor(roundedSeconds / 60);
        const sec = roundedSeconds % 60;
        return `${min}:${sec < 10 ? '0' : ''}${sec}`;
    }

    function calculateTotalRecordedTime() {
        return Object.values(sceneVideos).reduce((total, video) => total + video.duration, 0);
    }
    
    function updateTimerDisplay() {
        const totalRecordedTime = calculateTotalRecordedTime();
        
        remainingTime = totalDurationSeconds - totalRecordedTime;

        if (durationDisplay) {
            durationDisplay.innerText = formatTime(remainingTime);
        }
        
        updateVideoTimeline(); 

        // 타이머 종료 조건
        if (remainingTime <= 0) {
            stopRecording(true); 
        }
    }
    
    function togglePlayButton(isPlay) {
        if (isPlay) {
            playButton.classList.remove('animating'); // ▶ (재생) 아이콘
        } else {
            playButton.classList.add('animating'); // ❚❚ (정지) 아이콘
        }
        playButton.querySelector('.play-icon').innerText = isPlay ? '▶' : '⏸';
    }

    // ⭐ [핵심 수정] 녹화 시작 로직 (MediaRecorder API 사용 및 통합 캔버스 생성)
    let animationFrameId; // 애니메이션 루프 ID를 저장할 변수

    function startRecording() {
        if (isRecording || remainingTime <= 0) return;
        isRecording = true;
        
        // 씬 선택 잠금 (씬 전환 방지)
        document.querySelectorAll('.scene').forEach(s => s.style.pointerEvents = 'none');
        togglePlayButton(false); // ❚❚ 상태
        
        // 0. 통합 캔버스 생성 및 DOM에 추가 (숨김)
        const unifiedCanvas = document.createElement('canvas');
        unifiedCanvas.id = 'unified-recorder-canvas';
        unifiedCanvas.style.position = 'fixed';
        unifiedCanvas.style.top = '-1000px';
        document.body.appendChild(unifiedCanvas);

        // 녹화 중 꾸미기 요소의 움직임을 캔버스에 프레임 단위로 반영
        function animationLoop(timestamp) {
            const currentSceneData = storyData[currentScene];
            // ⭐ 텍스트 엘리먼트를 찾아서 전달합니다. (자막 녹화 핵심)
            const storyTextElement = document.querySelector('#story-text');
            drawAllToCanvas(unifiedCanvas, currentSceneData, storyTextElement);
            animationFrameId = requestAnimationFrame(animationLoop);
        }
        animationFrameId = requestAnimationFrame(animationLoop);


        // 1. 통합 캔버스 스트림 캡처 (30 FPS)
        let stream;
        try {
            stream = unifiedCanvas.captureStream(30); 
            mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm; codecs=vp9' });
        } catch (e) {
            console.error("MediaRecorder 또는 captureStream을 지원하지 않거나 설정 오류:", e);
            alert("이 브라우저는 영상 녹화를 지원하지 않습니다. (크롬/파이어폭스를 권장합니다.)");
            isRecording = false;
            unifiedCanvas.remove();
            return;
        }

        // 2. 데이터 청크 이벤트 핸들러
        sceneVideos[currentScene].chunks = [];
        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                sceneVideos[currentScene].chunks.push(event.data);
            }
        };
        mediaRecorder.start();

        // 3. 1초 단위로 타이머 감소 및 녹화 길이 증가 (UI 업데이트)
        timerInterval = setInterval(() => {
            if (remainingTime <= 0) {
                stopRecording(true);
                return;
            }
            
            // 현재 씬의 녹화 길이를 1초씩 증가
            sceneVideos[currentScene].duration = (sceneVideos[currentScene].duration || 0) + 1;
            
            updateTimerDisplay();
        }, 1000); 
        
        isAnimating = false; 
        sceneVideos[currentScene].recordingStartTime = Date.now();
        updateVideoTimeline();
    }

    // ⭐ [핵심 수정] 녹화 중지 로직 (통합 캔버스 제거 포함)
    function stopRecording(isTimeOut = false) {
        if (!isRecording) return;
        isRecording = false;
        
        // 애니메이션 루프 중지
        cancelAnimationFrame(animationFrameId);

        clearInterval(timerInterval);
        timerInterval = null;
        
        togglePlayButton(true); // ▶ 상태
        
        document.querySelectorAll('.scene').forEach(s => s.style.pointerEvents = 'auto');

        if (mediaRecorder && mediaRecorder.state === 'recording') {
            mediaRecorder.onstop = () => {
                // 청크를 합쳐 최종 Blob 생성 및 저장
                const blob = new Blob(sceneVideos[currentScene].chunks, { type: mediaRecorder.mimeType });
                sceneVideos[currentScene].data = blob;
                mediaRecorder = null;
                
                // ⭐ [추가] 통합 캔버스 제거
                const unifiedCanvas = document.getElementById('unified-recorder-canvas');
                if (unifiedCanvas) unifiedCanvas.remove(); 

                if (isTimeOut) {
                    alert("총 촬영 시간이 모두 사용되어 녹화를 중지하고 데이터를 저장했습니다.");
                }
            };
            mediaRecorder.stop();
        } else {
            // ⭐ [추가] 통합 캔버스 제거
            const unifiedCanvas = document.getElementById('unified-recorder-canvas');
            if (unifiedCanvas) unifiedCanvas.remove(); 
            
            if (isTimeOut) {
                alert("총 촬영 시간이 모두 사용되어 녹화를 중지합니다.");
            }
        }
        
        isAnimating = false; 
        updateTimerDisplay();
        updateVideoTimeline();
    }

    // ⭐ updateVideoTimeline 함수 정의 
    function updateVideoTimeline() {
        if (videoTimelineContainer) {
            videoTimelineContainer.innerHTML = '';
            
            let currentWidth = 0;
            const segments = [];
            
            // 1. 장면별 녹화 길이 기준으로 세그먼트 생성 (회색/빨간색)
            for (const key in sceneVideos) {
                const duration = sceneVideos[key].duration;
                if (duration > 0) {
                    const widthPercent = (duration / totalDurationSeconds) * 100;
                    const segment = document.createElement('div');
                    
                    segment.style.width = `${widthPercent}%`;
                    segment.style.height = '100%';
                    segment.style.backgroundColor = (key === currentScene) ? 'var(--color-red)' : 'var(--color-gray)';
                    
                    segments.push(segment);
                    currentWidth += widthPercent;
                }
            }
            
            // 2. 남은 시간 표시 세그먼트 (회색 배경 유지)
            if (currentWidth < 100) {
                const remainingSegment = document.createElement('div');
                remainingSegment.style.width = `${100 - currentWidth}%`;
                remainingSegment.style.height = '100%';
                remainingSegment.style.backgroundColor = '#ccc';
                segments.push(remainingSegment);
            }
            
            segments.forEach(segment => videoTimelineContainer.appendChild(segment));
        }
    }
    
    // -------------------------------------------------------------------------
    // ⭐ 2. 자석(Magnet) 로직 및 커서 핸들러 (녹화 로직 통합)
    // -------------------------------------------------------------------------
    const animationColors = ['#7B7B7B', '#7E84E4', '#F88586']; // 검은색, 파란색, 빨간색

    // 'Enter' 키 상태 추적
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            isEnterPressed = true;
            if (pickedUpElement) {
                dropElement();
                pickedUpElement = null;
            }
            // Enter 키를 누르면 선택된 요소도 해제
            document.querySelectorAll('.decoration-item.selected').forEach(el => el.classList.remove('selected'));
        }
    });
    window.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            isEnterPressed = false;
        }
    });

    // 캔버스 영역 내 마우스 이벤트
    canvas.addEventListener('mouseenter', () => {
        customCursor.style.display = 'block';
    });
    canvas.addEventListener('mouseleave', () => {
        customCursor.style.display = 'none';
        if (pickedUpElement) {
            dropElement();
            pickedUpElement = null;
        }
    });

    // 자석 로직 헬퍼 함수
    function findTargetElement(mouseX, mouseY) {
        if (isAnimating) return null;

        const colorIndex = animationColors.map(c => c.toUpperCase()).indexOf(currentColor.toUpperCase());
        if (colorIndex === -1) return null;

        const animatableElements = Array.from(canvas.querySelectorAll('.decoration-item[data-is-animatable="true"]'));
        
        // ⭐ 색상에 따라 N번째 이미지를 타겟합니다.
        const targetElement = animatableElements[colorIndex];
        
        if (!targetElement) return null;

        // 이미 이 요소가 편집 모드(선택)라면 자석 활성화 금지
        if (targetElement.classList.contains('selected')) {
            return null;
        }

        const elCenterX = targetElement.offsetLeft + targetElement.offsetWidth / 2;
        const elCenterY = targetElement.offsetTop + targetElement.offsetHeight / 2;

        const distance = Math.sqrt(Math.pow(mouseX - elCenterX, 2) + Math.pow(mouseY - elCenterY, 2));

        const pickupThreshold = (targetElement.offsetWidth / 2) + 15; // 15는 커서반경+여유

        if (distance < pickupThreshold) {
            return targetElement;
        }
        return null;
    }

    function dropElement() {
        if (!pickedUpElement) return;
        pickedUpElement.style.zIndex = 10; 
        updateThumbnail(currentScene);
    }
    
    // 캔버스 내 마우스 이동 (핵심 로직 - 자석 및 녹화/선택 이동 통합)
    canvas.addEventListener('mousemove', (e) => {
        // 1. 커서 위치 업데이트 (화면 기준)
        customCursor.style.left = e.clientX + 'px';
        customCursor.style.top = e.clientY + 'px';
        
        const selectedElement = document.querySelector('.decoration-item.selected');
        const mouseX = e.clientX - canvasRect.left;
        const mouseY = e.clientY - canvasRect.top;

        // 2. Enter 키가 눌렸거나 이미 선택된 요소(편집모드)가 있다면 자석/자동이동 비활성화
        if (isEnterPressed || selectedElement) {
            if (pickedUpElement) {
                dropElement();
                pickedUpElement = null;
            }
            return; 
        }

        // 3. (선택 안 함 상태) 자석 로직 실행
        
        // A. 이미 잡힌 요소가 있다면: 그 요소를 이동
        if (pickedUpElement) {
            moveElement(pickedUpElement, mouseX, mouseY);
            return;
        }

        // B. 잡힌 요소가 없다면: 자석 탐색 시도
        const target = findTargetElement(mouseX, mouseY);
        if (target) {
            pickedUpElement = target;
            pickedUpElement.style.zIndex = 200; 
            moveElement(pickedUpElement, mouseX, mouseY); // 잡는 즉시 이동 시작
        }
    });
    
    // ⭐ [핵심 수정] 캔버스의 빈 공간 클릭 시 자석 해제 및 선택 해제
    canvas.addEventListener('mousedown', (e) => {
        const isDecoItem = e.target.closest('.decoration-item');
        
        // 1. 자석으로 잡힌 요소가 있다면, 요소 해제
        if (pickedUpElement) {
            dropElement();
            pickedUpElement = null;
        }
        
        // 2. 데코레이션 아이템이 아닌 캔버스 빈 공간을 클릭했다면, 모든 선택 해제
        if (!isDecoItem) {
            document.querySelectorAll('.decoration-item.selected').forEach(el => el.classList.remove('selected'));
        }
        
        // 3. 녹화 중에는 클릭 이벤트 방지
        if (isRecording && isDecoItem) {
            e.stopPropagation();
        }
    });
    
    window.addEventListener('mouseup', () => {
        if (pickedUpElement) {
            dropElement();
            pickedUpElement = null;
        }
    });
    // -------------------------------------------------------------------------


    // -------------------------------------------------------------------------
    // ⭐ 3. 색상/지우개 버튼 이벤트 리스너
    // -------------------------------------------------------------------------
    document.querySelectorAll('.color-palette button').forEach(button => {
        button.addEventListener('click', (e) => {
            if (isAnimating || isRecording) return; 

            document.querySelectorAll('.color-palette button').forEach(btn => btn.classList.remove('active'));
            const currentButton = e.currentTarget;
            currentButton.classList.add('active');

            const newColor = currentButton.dataset.color;
            
            if (newColor) {
                currentColor = newColor;
                customCursor.style.backgroundColor = currentColor;
            } else {
                currentColor = '#FFFFFF'; 
                customCursor.style.backgroundColor = currentColor;
            }
            
            // 색상 변경 시 자석 기능에 영향을 줄 수 있으므로, 혹시 모를 상황을 대비해 pickedUpElement 해제
            if (pickedUpElement) {
                dropElement();
                pickedUpElement = null;
            }
        });
    });
    // -------------------------------------------------------------------------

    // -------------------------------------------------------------------------
    // ⭐ 4. 중앙 삭제 버튼 기능 (영상 삭제 전용으로 수정)
    // -------------------------------------------------------------------------
    if (deleteButton) {
        deleteButton.addEventListener('click', () => {
            if (isRecording) {
                alert("녹화 중에는 삭제할 수 없습니다.");
                return;
            }
            
            // 현재 씬의 녹화된 영상이 있는지 확인하고 삭제합니다.
            if (sceneVideos[currentScene] && sceneVideos[currentScene].duration > 0) {
                // 씬 영상 삭제 로직
                
                if (confirm(`현재 장면(씬 ${currentScene})의 녹화된 영상(${formatTime(sceneVideos[currentScene].duration)})을 삭제하시겠습니까?`)) { 
                    // ⭐ Blob URL 해제
                    if (sceneVideos[currentScene].data instanceof Blob) {
                        // 여기서 videoPlayer.src를 참조하면 에러가 날 수 있으므로, URL.revokeObjectURL 호출은 생략합니다.
                    }
                    sceneVideos[currentScene].duration = 0;
                    sceneVideos[currentScene].data = null;
                    sceneVideos[currentScene].chunks = [];
                    
                    updateTimerDisplay();
                    updateVideoTimeline();
                    alert(`장면 ${currentScene}의 영상이 삭제되었습니다.`);
                }
            } else {
                alert("삭제할 녹화된 영상이 없습니다. 꾸미기 요소는 개별 컨트롤의 '삭제' 버튼을 사용해주세요.");
            }
        });
    }
    // -------------------------------------------------------------------------


    // -------------------------------------------------------------------------
    // --- 데코레이션 로직 ---
    // -------------------------------------------------------------------------
    document.querySelectorAll('.asset-item[data-type="decoration"]').forEach(item => {
        item.addEventListener('click', () => {
            if (isRecording) return;
            
            const canvasImageSrc = item.dataset.canvasSrc || item.src;
            
            let initialHeight = 250; 
            let initialWidth; 

            // 요청하신 크기 로직 적용
            if (canvasImageSrc.includes('로미오1-2.png') ||
                canvasImageSrc.includes('로미오2-2.png') ||
                canvasImageSrc.includes('줄리엣1-2.png') ||
                canvasImageSrc.includes('줄리엣3-2.png')) {
                initialWidth = (650 / 1200) * initialHeight;
            } else if (canvasImageSrc.includes('줄리엣2-2.png') ||
                             canvasImageSrc.includes('친구2.png')) {
                initialWidth = (1000 / 1200) * initialHeight;
            } else if (canvasImageSrc.includes('펭귄2.png')) {
                initialWidth = (670 / 1200) * initialHeight;
            } else if (canvasImageSrc.includes('나비.png')) {
                initialWidth = 50; 
                initialHeight = 50; 
            } else {
                initialWidth = 250; 
                initialHeight = 250; 
            }

            const newDeco = {
                id: 'deco-' + Date.now(),
                src: canvasImageSrc,
                alt: item.alt || 'decoration',
                width: initialWidth,
                height: initialHeight,
                x: (canvas.offsetWidth / 2) - (initialWidth / 2), 
                y: (canvas.offsetHeight / 2) - (initialHeight / 2),
                rotation: 0,
                scaleX: 1,
                isAnimatable: !isExcludedFile(canvasImageSrc)
            };
            storyData[currentScene].decorations.push(newDeco);
            renderScene(currentScene);
        });
    });

    // ⭐ [수정] renderScene 함수: ctx 인수를 사용하여 메인 캔버스에 드로잉
    function renderScene(sceneNumber) {
        if (isAnimating || isRecording) return; 

        const data = storyData[sceneNumber];
        
        // 1. 배경 이미지 URL 설정
        const bgUrl = data.background.replace(/["']/g, '').trim(); 
        canvas.style.backgroundImage = bgUrl ? `url("${bgUrl}")` : 'none';

        // 2. 모든 데코 엘리먼트 제거
        // 기존 요소를 제거할 때 makeInteractive가 해제되므로, 새 요소를 만들 때 다시 바인딩해야 합니다.
        Array.from(canvas.querySelectorAll('div[id^="deco-"]')).forEach(child => {
            child.remove();
        });

        // 3. 데코레이션 엘리먼트 생성 및 배치
        // 이 과정에서 makeInteractive가 호출됩니다.
        data.decorations.forEach(decoData => createDecorationElement(decoData, canvas));

        // 4. 캔버스 및 드로잉 레이어 크기 재설정
        resizeCanvas();
        redrawDrawing(ctx, data.drawing); // 메인 캔버스 컨텍스트와 데이터 전달

        // 5. 내러티브 텍스트 업데이트
        updateNarrative();
        
        // 6. 썸네일 업데이트
        updateThumbnail(sceneNumber); 
        updateVideoTimeline();
    }


    // ⭐ [수정] updateNarrative 함수
    function updateNarrative() {
        const storyTextContainer = document.querySelector('.story-text-container'); 
        const storyText = document.getElementById('story-text');
        
        if (!storyTextContainer || !storyText) {
            console.error("Story Text Elements Not Found. (Check HTML structure)");
            return;
        }

        const sceneData = storyData[currentScene];
        const storyLogic = narrativeData[currentScene];

        if (!sceneData || !storyLogic) {
             storyText.innerText = "데이터 또는 로직을 찾을 수 없습니다.";
             return; 
        }

        let fullText = "";

        const currentBgStyle = canvas.style.backgroundImage;
        const urlMatch = currentBgStyle.match(/url\(['"]?(.*?)['"]?\)/);
        const currentBgUrl = urlMatch ? urlMatch[1] : '';
        const currentBgFilename = getFilenameFromUrl(currentBgUrl); 

        if (!currentBgFilename) { // 배경 파일명 없으면
            fullText = storyLogic.question;
            storyTextContainer.classList.add('default-text');
            storyTextContainer.classList.remove('narrative-text');
        } else {
            storyTextContainer.classList.remove('default-text');
            storyTextContainer.classList.add('narrative-text');
            
            const bgKey = storyLogic.backgroundText.hasOwnProperty(currentBgFilename) ? currentBgFilename : 'default';
            fullText = storyLogic.backgroundText[bgKey];

            const decorations = sceneData.decorations;
            let selectedDecoAlt = 'default';

            if (decorations.length > 0) {
                const relevantDecos = decorations; 
                const altCounts = {};
                let maxCount = 0;

                relevantDecos.forEach(deco => {
                    const alt = deco.alt || 'default';
                    altCounts[alt] = (altCounts[alt] || 0) + 1;
                    if (altCounts[alt] > maxCount) {
                        maxCount = altCounts[alt];
                        selectedDecoAlt = alt; 
                    }
                });
                if (!storyLogic.decorationText.hasOwnProperty(selectedDecoAlt)) {
                     selectedDecoAlt = 'default';
                }
            }
            fullText += storyLogic.decorationText[selectedDecoAlt];

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


    // -------------------------------------------------------------------------
    // --- 타임라인 로직 
    // -------------------------------------------------------------------------
    const scenes = document.querySelectorAll('.scene');

    scenes.forEach(scene => {
        scene.addEventListener('click', () => {
            if (isAnimating || isRecording) return; 

            scenes.forEach(s => s.classList.remove('active'));
            scene.classList.add('active');
            currentScene = scene.dataset.scene;
            renderScene(currentScene);
        });
    });


    // -------------------------------------------------------------------------
    // --- 애니메이션 로직 
    // -------------------------------------------------------------------------
    const ANIMATION_DURATION_MS = 3000; 

    function updateDecorationPosition(element, x, y) {
        // x, y 좌표는 이미 보정된 값이므로 그대로 사용
        element.style.left = x + 'px';
        element.style.top = y + 'px';
    }
    
    // ⭐ [수정] 애니메이션 로직
    function animateDecoration(decoElement, path, duration) {
        return new Promise(resolve => {
            const totalPoints = path.points.length;
            if (totalPoints < 2) {
                return resolve();
            }

            const startTime = performance.now();

            decoElement.style.zIndex = 200;

            function step(currentTime) {
                const elapsedTime = currentTime - startTime;
                const progress = Math.min(elapsedTime / duration, 1);

                const maxIndex = totalPoints - 1;

                let currentPointIndex = Math.min(Math.round(progress * maxIndex), maxIndex); 

                if (progress === 1) {
                    currentPointIndex = maxIndex;
                }

                const currentPoint = path.points[currentPointIndex]; 

                if (!currentPoint || typeof currentPoint.x === 'undefined') {
                    decoElement.style.zIndex = 10;
                    return resolve(); 
                }
                
                updateDecorationPosition(decoElement, currentPoint.x, currentPoint.y); 

              if (progress < 1) {
                    requestAnimationFrame(step);
                } else {
                    decoElement.style.zIndex = 10; // 복귀
                    resolve();
                }
            }
            requestAnimationFrame(step);
        });
    }


    async function startAnimation() {
        if (isRecording) {
            stopRecording();
            return;
        }

        if (remainingTime <= 0) {
            alert("총 촬영 시간이 모두 사용되었습니다. 영상을 삭제하여 시간을 확보해 주세요.");
            return;
        }
        
        // 1. 녹화 시작
        startRecording(); 

        // 2. 애니메이션 미리보기 시작 (비동기)
        const currentData = storyData[currentScene];
        const animatableElements = Array.from(canvas.querySelectorAll('.decoration-item[data-is-animatable="true"]'));
        const animationColors = ['#7B7B7B', '#7E84E4', '#F88586'];

        for (let i = 0; i < animatableElements.length && i < animationColors.length; i++) {
            const decoElement = animatableElements[i];
            const pathColor = animationColors[i].toUpperCase();
            const animationPath = currentData.drawing.find(p => p.mode === 'draw' && p.color.toUpperCase() === pathColor);

             if (animationPath && animationPath.points.length >= 2) {
                 // 미리보기 애니메이션은 3초로 고정
                 animateDecoration(decoElement, animationPath, ANIMATION_DURATION_MS); 
             }
        }
    }
    playButton.addEventListener('click', startAnimation);
    
    // -------------------------------------------------------------------------
    // ⭐ [핵심 수정] 최종 영상 페이지 로직: 저장된 Blob 재생 ⭐
    // -------------------------------------------------------------------------

    function initializeVideoPage() {
        // 로컬 스토리지에서 데이터 로드 (duration만 사용)
        const durationDataJSON = localStorage.getItem('sceneDurationDataFinal');
        
        let durationData = {};
        let totalRecordedTime = 0;
        let hasRecordedData = false;
        let firstVideoBlob = null;

        try {
            if (durationDataJSON) durationData = JSON.parse(durationDataJSON);
            
            totalRecordedTime = Object.values(durationData).reduce((total, duration) => total + duration, 0);
            hasRecordedData = totalRecordedTime > 0;
            
            // ⭐ [추가] Blob 데이터 확인 (단일 씬 녹화로 가정하고 첫 씬만 확인)
            const scene1Video = sceneVideos['1'];
            if (scene1Video.data instanceof Blob) {
                firstVideoBlob = scene1Video.data;
            } else {
                console.warn("단일 씬 Blob 데이터가 메모리에 없습니다. 녹화된 데이터가 없거나 유효하지 않습니다.");
            }

        } catch (e) {
            console.error("로컬 스토리지 데이터 로드 오류:", e);
        }

        // 캔버스 시뮬레이션 요소 숨김
        if (finalCanvasWrapper) finalCanvasWrapper.style.display = 'none'; 
        
        if (hasRecordedData && firstVideoBlob) {
            // ⭐ [핵심 수정] Blob URL 생성
            const videoUrl = URL.createObjectURL(firstVideoBlob);

            videoPlayer.style.display = 'block'; 
            videoPlayer.src = videoUrl;
            videoPlayer.load(); // 영상 로드

            loadingMessage.style.display = 'flex';
            loadingMessage.innerText = `총 영상 길이: ${formatTime(totalRecordedTime)}. 녹화된 데이터를 로드 중입니다...`; 
            downloadButton.disabled = true;

            videoPlayer.onloadedmetadata = () => {
                // Blob 데이터는 로컬 메모리에 저장되므로, 인코딩 시간 없이 바로 재생 준비
                setTimeout(() => {
                    loadingMessage.style.display = 'none'; 
                    downloadButton.disabled = false; 
                    videoPlayer.play().catch(e => console.log("자동 재생 실패:", e));
                    console.log("녹화된 캔버스 영상 로드 및 재생 시작.");
                }, 1000); // 1초 지연 (재생 오류 방지)
            };
            
        } else {
            // 녹화 데이터가 없을 경우
            videoPlayer.style.display = 'none';
            loadingMessage.innerText = "녹화된 영상이 없습니다. 재생버튼을 눌러 영상을 녹화 해주세요.";
            loadingMessage.style.display = 'flex';
            downloadButton.disabled = true;
            directDownloadLink.style.display = 'none';
        }
    }

    // 다운로드 버튼 클릭 -> QR 코드 모달 표시
    let qrCodeInstance = null;

    downloadButton.addEventListener('click', () => {
        if (downloadButton.disabled) return;
        
        // ⭐ [추가] 녹화된 비디오 파일 다운로드 기능
        const currentBlob = sceneVideos['1'].data; // 첫 번째 씬의 Blob 사용
        if (currentBlob) {
            const url = URL.createObjectURL(currentBlob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = `my_animation_${currentScene}.webm`;
            document.body.appendChild(a);
            a.click();
            URL.revokeObjectURL(url);
            a.remove();
            alert("영상을 다운로드합니다.");
            return;
        }

        // --- QR 코드 모달 표시 (Blob이 없을 경우 또는 대체 기능) ---
        qrModal.style.display = 'flex';
        
        if (qrCodeInstance) {
            qrcodeContainer.innerHTML = '';
            qrCodeInstance = null;
        }

        if (typeof QRCode !== 'undefined') {
            const dummyDownloadUrl = "https://www.google.com/search?q=동화+영상+다운로드"; 
            
            qrCodeInstance = new QRCode(qrcodeContainer, {
                text: dummyDownloadUrl, 
                width: 200,
                height: 200,
                colorDark : "#000000",
                colorLight : "#ffffff",
                correctLevel : QRCode.CorrectLevel.H
            });
        } else {
             qrcodeContainer.innerHTML = "<p style='color:red;'>QR 코드 생성 오류: 라이브러리를 로드하지 못했습니다.</p>";
        }
        
        videoPlayer.pause(); 
    });

    // 닫기 버튼 클릭 -> 모달 숨김
    closeModalButton.addEventListener('click', () => {
        qrModal.style.display = 'none';
    });

    // 모달 외부 클릭 시 닫기
    qrModal.addEventListener('click', (e) => {
        if (e.target === qrModal) {
            qrModal.style.display = 'none';
        }
    });

    // -------------------------------------------------------------------------
    // ⭐ [핵심 수정] 화면 전환 로직 (화살표 버튼 사용) ⭐
    // -------------------------------------------------------------------------
    
    // 오른쪽 화살표 (에디터 뷰 -> 최종 영상 뷰)
    navNext.addEventListener('click', () => {
        if (isVideoPlaying) return; // 시뮬레이션 재생 중에는 전환 방지
        
        // 1. 녹화 정지 (데이터 저장 포함)
        stopRecording();
        
        // 2. 현재 storyData와 녹화 길이를 로컬 스토리지에 저장
        localStorage.setItem('storyboardDataFinal', JSON.stringify(storyData));
        const exportedDurations = {};
        Object.keys(sceneVideos).forEach(key => {
            exportedDurations[key] = sceneVideos[key].duration;
        });
        localStorage.setItem('sceneDurationDataFinal', JSON.stringify(exportedDurations));

        // 3. 뷰 전환
        viewWrapper.classList.add('show-final');
        navPrev.style.display = 'flex'; // 왼쪽 화살표 표시
        navNext.style.display = 'none'; // 오른쪽 화살표 숨김
        
        // 4. 최종 영상 로직 실행 (비디오 플레이어 로드)
        initializeVideoPage();
    });

    // 왼쪽 화살표 (최종 영상 뷰 -> 에디터 뷰)
    navPrev.addEventListener('click', () => {
        viewWrapper.classList.remove('show-final');
        navPrev.style.display = 'none'; // 왼쪽 화살표 숨김
        navNext.style.display = 'flex'; // 오른쪽 화살표 표시
        
        // 영상 플레이어 중지 및 초기화
        videoPlayer.pause();
        videoPlayer.removeAttribute('src');
        videoPlayer.style.display = 'none'; // 플레이어 숨김
        loadingMessage.style.display = 'none';
        isVideoPlaying = false; 
        
        // 기존 캔버스 시뮬레이션 관련 DOM도 혹시 모르니 숨김 처리 유지
        if (finalCanvasWrapper) finalCanvasWrapper.style.display = 'none';
    });

    // -------------------------------------------------------------------------
    // ⭐ [추가] JavaScript 스크롤바 호버 로직 (요청하신 부분)
    // -------------------------------------------------------------------------
    const assetContainer = document.querySelector('.asset-container');

    if (assetContainer) {
        // 1. 마우스를 올리면 클래스를 추가하여 스크롤바를 보이게 합니다.
        assetContainer.addEventListener('mouseover', () => {
            // asset-container가 실제로 스크롤 가능해야만 스크롤바가 보입니다.
            assetContainer.classList.add('show-scrollbar');
        });

        // 2. 마우스가 벗어나면 클래스를 제거하여 스크롤바를 숨깁니다.
        assetContainer.addEventListener('mouseout', () => {
            assetContainer.classList.remove('show-scrollbar');
        });
    }
    // -------------------------------------------------------------------------


    // -------------------------------------------------------------------------
    // 초기 설정
    // -------------------------------------------------------------------------
    resizeCanvas(); 
    renderScene(currentScene); 
    updateTimerDisplay(); // 타이머 초기화
    
    // 초기에는 에디터 뷰이므로 오른쪽 화살표만 표시
    navPrev.style.display = 'none';
    navNext.style.display = 'flex';
} 
// initializeAppLogic 끝

window.addEventListener('load', initializeAppLogic);
// 홈 버튼 클릭 이벤트 리스너 추가 (index.html로 이동)
document.addEventListener('DOMContentLoaded', () => {
    const homeButton = document.getElementById('homeButton');
    
    if (homeButton) {
        homeButton.addEventListener('click', () => {
            // 현재 페이지를 index.html로 리디렉션
            window.location.href = 'index.html';
        });
    }
});