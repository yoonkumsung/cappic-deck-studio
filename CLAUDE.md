# IR Pitch Deck Maker - Design Rules

## 슬라이드 디자인 필수 규칙 (절대 위반 금지)

### 1. 색상
- 60-30-10: Black+White(60%) / Cyan #7EDCE6(30%) / Yellow #F7E150(10%)
- 글자색은 반드시 잘 보여야 함:
  - 주 텍스트: #FFFFFF (순백)
  - 보조 텍스트: #E0E0E0 (밝은 회색)
  - 3차 텍스트: #B0B0B0 (여전히 잘 보이는 수준)
  - rgba(255,255,255,0.25) 같은 안 보이는 색 절대 사용 금지
- 배경: #000000 (검정)
- Semantic: 상승 #7AE85A / 하락 #FF4D6A (데이터 증감에만 극소량)

### 2. 카드 스타일
- 카드 질감 유지: gradient background + box-shadow + gloss overlay(::before)
- cards.css의 .card 클래스를 항상 사용
- 보더라인(border-top 컬러 라인 등) 제거 — 카드 질감은 유지
- border: 없음 또는 매우 미세한 rgba(255,255,255,0.06) 수준만

### 3. 글자 크기 (최소 15px)
- 타이틀: 48px / 800
- 숫자 강조: 48~56px / 800
- 본문: 18~20px / 600
- 출처(최소): 15px — 출처 표기용으로만
- 15px 밑으로 절대 사용 금지

### 4. 레이아웃
- 타이틀: 모든 슬라이드 좌측 상단 고정 (top:80px, left:120px)
- 콘텐츠 영역: top:220px, left:120px, right:120px, bottom:80px
- 슬라이드 전체 1920x1080을 최대한 활용할 것
- 컨테이너로 가운데 몰지 말 것
- 사진 영역은 충분히 크게 (최소 높이 300px 이상, 납작하게 하지 말 것)

### 5. 영문 라벨 금지
- "DIFFERENTIATION", "PROBLEM" 같은 영문 섹션 라벨 사용하지 않음
- 타이틀은 한국어로

### 6. 텍스트 원칙
- 글씨 많이 넣지 말 것 — 키워드 식으로 크게
- 문장형 금지 → 핵심 단어만
- 출처 없는 숫자 절대 사용 금지

### 7. 슬라이드 템플릿 구조
- HTML 템플릿: src/slides/{id}.html
- 데이터 JSON: src/slides/{id}.json
- {{key}} 치환 방식
- 폼 입력으로 콘텐츠 수정, 레이아웃 변경은 Claude Code에서 HTML 직접 수정
