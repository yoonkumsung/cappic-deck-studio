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

## 1-1. 라이트모드 색상 변환 규칙

| 다크모드 | 라이트모드 | 규칙 |
|---------|----------|------|
| --text-primary #FFFFFF | #111111 | 흰색 텍스트 → 검정 |
| --text-secondary #E0E0E0 | #333333 | 밝은 회색 → 진한 회색 |
| --text-tertiary #B0B0B0 | #888888 | 회색 → 중간 회색 |
| --main-black #000000 | #FFFFFF | 검정 배경 → 흰색 배경 |
| --secondary #7EDCE6 | #0A7A88 | 시안 → 진한 시안 (흰 배경 가독성) |
| --accent #F7E150 | #CC6600 | 밝은 노랑 → 번트 오렌지 (흰 배경 가독성) |
| --semantic-up #7AE85A | #1A7A10 | 연두 → 진한 초록 |
| --semantic-down #FF4D6A | #C01030 | 분홍 → 진한 빨강 |
| 카드 배경 (dark gradient) | 밝은 회색 gradient | 배경과 구분되는 밝은 회색 |
| rgba(255,255,255,0.xx) 테두리 | rgba(0,0,0,0.xx) 테두리 | 투명도 유지, 색상만 반전 |

**핵심 원칙:**
- 흰 배경에서 가독성 확보를 위해 accent/secondary 색상은 더 진하게
- 카드 배경은 #F8F8F8~#EEEEEE (순백이 아닌 밝은 회색으로 배경과 구분)
- **rgba(255,255,255,xx) 절대 사용 금지** — 라이트모드에서 안 보임
- 비활성/흐린 텍스트는 반드시 `color:var(--text-tertiary);opacity:0.3~0.4;` 사용
- 테두리도 `border:solid var(--text-tertiary)` + opacity로 처리

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


## 6. 비교/데이터 표시

- 비교 항목은 `.sg-item` (라벨 + 값 쌍)으로 통일
- 라벨: var(--fs-caption) 18px / var(--text-tertiary)
- 값: var(--fs-body) 22px / var(--text-secondary) (accent 카드에서는 var(--text-primary))
- 여러 항목 세로 나열: `.sg-data-list` (justify-content: space-evenly)
- 큰 숫자: `.sg-stat-value` 48px + `.sg-stat-unit` 28px + `.sg-stat-label` 18px

---

## 7. 슬라이드 작성 절차

1. `.slide` > `.slide-title` + `.slide-content.sg-cols-N` 구조로 시작
2. 카드는 `.card` (또는 `.card.card-accent`, `.card.card-photo`)
3. 사진은 `.sg-photo` 안에 `<img>`
4. 데이터는 `.sg-data` > `.sg-data-list` > `.sg-item`
5. 큰 숫자는 `.sg-stat-value` + `.sg-stat-unit` + `.sg-stat-label`
6. 출처는 `.slide-source`
7. **font-size, padding, gap을 인라인 style로 직접 쓰지 않는다**
8. **반드시 CSS 토큰(var(--fs-xxx), var(--sp-xxx))을 사용한다**

---

## 8. 오버플로우 금지

- 슬라이드(1920×1080) 내부의 모든 카드, 텍스트, 이미지는 슬라이드 경계를 절대 벗어나지 않는다
- `.slide-content` 영역(top:200px, left:120px, right:120px, bottom:80px) 안에 모든 콘텐츠가 들어와야 한다
- 카드가 하단 여백(bottom:80px)을 침범하면 → 카드 개수 줄이거나 2장으로 분리
- `overflow: hidden`이 슬라이드에 이미 적용되어 있지만, 잘리는 것도 허용하지 않는다
- 수정 후 반드시 프리뷰에서 콘텐츠가 잘리거나 넘치지 않는지 확인

---

## 9. 텍스트 원칙

- 키워드 식으로 크게, 문장형 금지
- 출처 없는 숫자 절대 사용 금지
- 1장 = 1메시지 (정보 과밀 시 2장 분리)

---

## 9. 슬라이드 템플릿 구조

- HTML 템플릿: src/slides/{id}.html
- 데이터 JSON: src/slides/{id}.json
- {{key}} 치환 방식
- 폼 입력으로 콘텐츠 수정
- 레이아웃 변경은 Claude Code에서 HTML 직접 수정

---

# Workflow Orchestration

## 1. Plan First
- 3단계 이상 또는 아키텍처 결정이 필요한 작업은 반드시 plan mode 진입
- 진행 중 문제 발생 시 즉시 멈추고 재계획 — 밀어붙이지 않는다
- 검증 단계도 계획에 포함
- 사전에 상세 스펙 작성으로 모호함 제거

## 2. Subagent 전략
- 메인 컨텍스트 윈도우를 깨끗하게 유지하기 위해 subagent 적극 활용
- 리서치, 탐색, 병렬 분석은 subagent에 위임
- 복잡한 문제는 subagent로 compute 투입
- subagent 1개 = 1가지 목적

## 3. Self-Improvement Loop
- 유저 교정 발생 시 → `tasks/lessons.md`에 패턴 기록
- 같은 실수 방지 규칙 작성
- 실수율이 떨어질 때까지 반복 개선
- 세션 시작 시 lessons 리뷰

## 4. 완료 전 검증
- 동작 증명 없이 완료 처리 금지
- 변경 전후 diff 확인
- "시니어 엔지니어가 승인할 수준인가?" 자문
- 테스트 실행, 로그 확인, 정확성 입증
- **수정 시 연관 기능 점검 필수**: 코드 변경 후 해당 변경에 영향받는 모든 기능이 정상 작동하는지 확인. 브라우저에서 직접 검증

## 5. Elegance (균형 있게)
- 비자명한 변경: "더 우아한 방법이 있는가?" 자문
- 해키한 느낌이면 → 우아한 솔루션으로 재구현
- 단순하고 명백한 수정은 과도 설계하지 않는다

## 6. 자율적 버그 수정
- 버그 리포트 받으면 바로 수정. 유저에게 질문하지 않는다
- 로그, 에러, 실패 테스트 직접 찾아서 해결
- 유저의 컨텍스트 스위칭 비용 = 0

---

# Task Management

1. **계획**: `tasks/todo.md`에 체크리스트 작성
2. **계획 확인**: 구현 시작 전 유저와 합의
3. **진행 추적**: 완료 항목 즉시 체크
4. **변경 설명**: 각 단계별 고수준 요약
5. **결과 문서화**: `tasks/todo.md`에 리뷰 섹션 추가
6. **교훈 기록**: 교정 발생 시 `tasks/lessons.md` 업데이트

---

# Core Principles

- **Simplicity First**: 가능한 가장 단순하게. 최소한의 코드만 변경
- **No Laziness**: 근본 원인 찾기. 임시 수정 금지. 시니어 개발자 기준
- **Minimal Impact**: 필요한 것만 수정. 버그 유입 방지
