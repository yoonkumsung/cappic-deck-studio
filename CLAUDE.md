# IR Pitch Deck Maker - Design Rules

## 이 문서는 절대 규칙이다. 예외 없이 모든 슬라이드에 적용한다.

---

## 1. 색상 (60-30-10)

- 60%: Black #000000 + White #FFFFFF
- 30%: Cyan #7EDCE6
- 10%: Yellow #F7E150
- 한 슬라이드에 강조색은 1가지만 (빨강+옐로 동시 사용 금지)
- Semantic: 상승 #7AE85A / 하락 #FF4D6A (데이터 증감에만 극소량)

### 글자색 (잘 안 보이는 색 사용 금지)

| 용도 | 색상 | 절대 금지 |
|------|------|----------|
| 주 텍스트 | #FFFFFF | |
| 보조 텍스트 | #E0E0E0 | |
| 3차 텍스트 | #B0B0B0 | |
| 출처 전용 | #888888 | |
| **금지** | | rgba(255,255,255,0.25) 이하 |

---

## 2. Typography (4단계 + 출처)

| 토큰 | 크기 | 용도 | 비고 |
|------|------|------|------|
| --fs-display | 48px | 슬라이드 타이틀, 큰 숫자 | font-weight: 800 |
| --fs-heading | 28px | 카드 제목, 비교표 헤더 | font-weight: 700 |
| --fs-body | 22px | 본문, 비교 데이터, 키워드 | font-weight: 600 |
| --fs-caption | 18px | 항목 라벨, 보조 텍스트 | font-weight: 600 |
| --fs-source | 15px | 출처 표기 전용 | **이 외 절대 사용 금지** |

**규칙: 이 5가지 외의 font-size를 인라인으로 지정하지 않는다.**
**규칙: 13px, 14px, 16px 같은 크기는 존재하지 않는다.**

---

## 3. Spacing (8px 배수, 5단계만)

| 토큰 | 값 | 용도 |
|------|-----|------|
| --sp-xs | 8px | 라벨↔값 사이 |
| --sp-sm | 16px | 카드 제목↔데이터, 아이템 사이 |
| --sp-md | 24px | 슬라이드 gap (카드 간격) |
| --sp-lg | 32px | 카드 내부 padding |
| --sp-xl | 48px | 큰 요소 사이 간격 |

**규칙: 모든 padding, margin, gap은 반드시 이 5가지 중 하나.**
**규칙: 12px, 14px, 20px, 28px, 36px 같은 값은 존재하지 않는다.**

---

## 4. Slide Layout (고정값)

```
┌──────────────────────────────────────────┐
│ 80px (상단 여백)                          │
│  ┌─ 120px ────────────── 120px ─┐        │
│  │  TITLE (48px/800)            │        │
│  │                              │        │
│  │  200px (콘텐츠 시작)          │        │
│  │  ┌────────────────────┐     │        │
│  │  │  CONTENT AREA      │     │        │
│  │  │  (gap: 24px)       │     │        │
│  │  │                    │     │        │
│  │  └────────────────────┘     │        │
│  └──────────────────────────────┘        │
│ 80px (하단 여백)                          │
└──────────────────────────────────────────┘
```

- 타이틀: top:80px, left:120px → `.slide-title` 클래스 사용
- 콘텐츠: top:200px, left:120px, right:120px, bottom:80px → `.slide-content` 클래스 사용
- 카드/요소 간격: 24px 통일 → `.sg-cols-N` 클래스 사용
- **인라인 style로 position:absolute, top, left, padding 직접 쓰지 않는다**
- **slide-grid.css의 클래스를 사용한다**

---

## 5. 카드

- `.card` 클래스 필수 (gradient + shadow + gloss overlay)
- 내부 padding: 32px (var(--card-pad)) — 변경 금지
- 보더 컬러 라인(border-top 등) 금지
- 사진+데이터 구조일 때: `.card.card-photo` + `.sg-card-col` 사용

---

## 6. 사진

- 기본 비율: **4:3** (aspect-ratio: 4/3)
- `.sg-photo` 클래스 사용
- 여러 개일 때 반드시 동일 비율
- 사진 영역은 카드 높이의 40~50% 차지 (납작하게 하지 않는다)

---

## 7. 비교/데이터 표시

- 비교 항목은 `.sg-item` (라벨 + 값 쌍)으로 통일
- 라벨: var(--fs-caption) 18px / var(--text-tertiary)
- 값: var(--fs-body) 22px / var(--text-secondary) (accent 카드에서는 var(--text-primary))
- 여러 항목 세로 나열: `.sg-data-list` (justify-content: space-evenly)
- 큰 숫자: `.sg-stat-value` 48px + `.sg-stat-unit` 28px + `.sg-stat-label` 18px

---

## 8. 슬라이드 작성 절차

1. `.slide` > `.slide-title` + `.slide-content.sg-cols-N` 구조로 시작
2. 카드는 `.card` (또는 `.card.card-accent`, `.card.card-photo`)
3. 사진은 `.sg-photo` 안에 `<img>`
4. 데이터는 `.sg-data` > `.sg-data-list` > `.sg-item`
5. 큰 숫자는 `.sg-stat-value` + `.sg-stat-unit` + `.sg-stat-label`
6. 출처는 `.slide-source`
7. **font-size, padding, gap을 인라인 style로 직접 쓰지 않는다**
8. **반드시 CSS 토큰(var(--fs-xxx), var(--sp-xxx))을 사용한다**

---

## 9. 텍스트 원칙

- 키워드 식으로 크게, 문장형 금지
- 출처 없는 숫자 절대 사용 금지
- 영문 섹션 라벨 금지 (PROBLEM, SOLUTION 등)
- 타이틀은 한국어
- 1장 = 1메시지 (정보 과밀 시 2장 분리)

---

## 10. 슬라이드 템플릿 구조

- HTML 템플릿: src/slides/{id}.html
- 데이터 JSON: src/slides/{id}.json
- {{key}} 치환 방식
- 폼 입력으로 콘텐츠 수정
- 레이아웃 변경은 Claude Code에서 HTML 직접 수정
