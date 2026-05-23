# CAPP!C Deck Studio — Design Rules

## 이 문서는 절대 규칙이다. 예외 없이 모든 슬라이드에 적용한다.

---

## 1. 색상 (60-30-10)

- 60%: Black #000000 + White #FFFFFF
- 30%: Cyan #7EDCE6 (유일한 강조색, accent = secondary alias)
- Semantic: 상승 #7AE85A / 하락 #FF4D6A (데이터 증감에만 극소량)
- **2색 체계: 시안 하나로 opacity 층위(05/10/15/20/50/70)를 만들어 위계 표현**
- **슬라이드 HTML에서 색상 hex/rgba 직접 사용 금지. 반드시 CSS 변수(var) 사용**

### 글자색 (잘 안 보이는 색 사용 금지)

| 용도 | 색상 | 절대 금지 |
|------|------|----------|
| 주 텍스트 | #FFFFFF | |
| 보조 텍스트 | #E0E0E0 | |
| 3차 텍스트 | #B0B0B0 | |
| 출처 전용 | #888888 | |
| **금지** | | rgba(255,255,255,0.25) 이하 |

---

## 2. 라이트모드 색상 변환 규칙

| 다크모드 | 라이트모드 | 규칙 |
|---------|----------|------|
| --text-primary #FFFFFF | #111111 | 흰색 텍스트 → 검정 |
| --text-secondary #E0E0E0 | #333333 | 밝은 회색 → 진한 회색 |
| --text-tertiary #B0B0B0 | #888888 | 회색 → 중간 회색 |
| --main-black #000000 | #FFFFFF | 검정 배경 → 흰색 배경 |
| --secondary #7EDCE6 | #0A7A88 | 시안 → 진한 시안 (흰 배경 가독성) |
| --semantic-up #7AE85A | #1A7A10 | 연두 → 진한 초록 |
| --semantic-down #FF4D6A | #C01030 | 분홍 → 진한 빨강 |

**핵심 원칙:**
- 흰 배경에서 가독성 확보를 위해 accent/secondary 색상은 더 진하게
- 카드 배경은 #F8F8F8~#EEEEEE (순백이 아닌 밝은 회색으로 배경과 구분)
- **rgba(255,255,255,xx) 절대 사용 금지** - 라이트모드에서 안 보임
- 비활성/흐린 텍스트는 반드시 `color:var(--text-tertiary);opacity:0.3~0.4;` 사용
- 테두리도 `border:solid var(--text-tertiary)` + opacity로 처리

---

## 3. Typography (6단계)

| 토큰 | 크기 | 용도 | 비고 |
|------|------|------|------|
| --fs-display | 48px | 슬라이드 타이틀, 큰 숫자 | font-weight: 800 |
| --fs-stat | 36px | 강조 숫자, 스텝 라벨 | font-weight: 800 |
| --fs-heading | 28px | 카드 제목, 비교표 헤더 | font-weight: 700 |
| --fs-body | 22px | 본문, 비교 데이터, 키워드 | font-weight: 600 |
| --fs-caption | 16px | 항목 라벨, 보조 텍스트 | font-weight: 600 |
| --fs-source | 13px | 출처 표기, HUD 메타 전용 | **이 외 절대 사용 금지** |

**규칙: 이 6가지 외의 font-size를 인라인으로 지정하지 않는다.**
**규칙: 14px, 15px, 18px, 20px 같은 크기는 존재하지 않는다.**

### A4 Typography (피치덱 축소 비율)

| 토큰 | 크기 |
|------|------|
| --a4-fs-display | 32px |
| --a4-fs-stat | 24px |
| --a4-fs-heading | 20px |
| --a4-fs-body | 14px |
| --a4-fs-caption | 11px |
| --a4-fs-source | 9px |

---

## 4. Spacing (8px 배수, 5단계만)

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

## 4-1. 색상 투명도 (rgba 직접 사용 금지)

슬라이드 HTML에서 `rgba(R,G,B,X)` 직접 사용 금지. 반드시 토큰 사용:

| 토큰 | 용도 |
|------|------|
| --secondary-05 | 매우 연한 배경 |
| --secondary-10 | 연한 배경, 테이블 하이라이트 |
| --secondary-15 | 뱃지 배경, 테두리 |
| --secondary-20 | 중간 강조 |
| --secondary-50 | 차트 그라데이션 |
| --secondary-70 | 차트 그라데이션 (강) |
**2색 체계: accent 토큰은 사용하지 않는다. secondary 토큰만 사용.**
**색상 변경 시 tokens.css 한 파일만 수정하면 전체 반영된다.**

---

## 5. 슬라이드 비율

| 비율 | 해상도 | 용도 |
|------|--------|------|
| 16:9 | 1920×1080 | 피치덱 기본 (프레젠테이션) |
| 3:2 | 1620×1080 | A4 사업계획서용 |

**이 2가지 외의 비율은 존재하지 않는다.**

---

## 6. Slide Layout (고정값, 16:9 기준)

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

## 7. 카드

- `.card` 클래스 필수 (gradient + shadow + gloss overlay)
- 내부 padding: 32px (var(--card-pad)) - 변경 금지
- 보더 컬러 라인(border-top 등) 금지
- 사진+데이터 구조일 때: `.card.card-photo` + `.sg-card-col` 사용

---

## 8. 비교/데이터 표시

- 비교 항목은 `.sg-item` (라벨 + 값 쌍)으로 통일
- 라벨: var(--fs-caption) 16px / var(--text-tertiary)
- 값: var(--fs-body) 22px / var(--text-secondary)
- 여러 항목 세로 나열: `.sg-data-list` (justify-content: space-evenly)
- 큰 숫자: `.sg-stat-value` 48px + `.sg-stat-unit` 28px + `.sg-stat-label` 16px

---

## 9. 슬라이드 작성 절차

1. `.slide` > `.slide-title` + `.slide-content.sg-cols-N` 구조로 시작
2. 카드는 `.card` (또는 `.card.card-secondary`, `.card.card-photo`)
3. 사진은 `.sg-photo` 안에 `<img>`
4. 데이터는 `.sg-data` > `.sg-data-list` > `.sg-item`
5. 큰 숫자는 `.sg-stat-value` + `.sg-stat-unit` + `.sg-stat-label`
6. 출처는 `.slide-source`
7. **font-size, padding, gap을 인라인 style로 직접 쓰지 않는다**
8. **반드시 CSS 토큰(var(--fs-xxx), var(--sp-xxx))을 사용한다**

---

## 10. 오버플로우 금지

- 슬라이드(1920×1080) 내부의 모든 카드, 텍스트, 이미지는 슬라이드 경계를 절대 벗어나지 않는다
- `.slide-content` 영역(top:200px, left:120px, right:120px, bottom:80px) 안에 모든 콘텐츠가 들어와야 한다
- 카드가 하단 여백(bottom:80px)을 침범하면 → 카드 개수 줄이거나 2장으로 분리
- `overflow: hidden`이 슬라이드에 이미 적용되어 있지만, 잘리는 것도 허용하지 않는다
- 수정 후 반드시 프리뷰에서 콘텐츠가 잘리거나 넘치지 않는지 확인

---

## 11. 텍스트 원칙

- 키워드 식으로 크게, 문장형 금지
- 출처 없는 숫자 절대 사용 금지
- 1장 = 1메시지 (정보 과밀 시 2장 분리)
- **em dash(—) 사용 금지. 하이픈(-) 또는 콜론(:)으로 대체한다**

---

## 12. 템플릿 구조

- HTML 템플릿: `src/slides/{id}.html`
- 데이터 JSON: `src/slides/{id}.json`
- 슬라이드 레지스트리: `src/data/slides.json` (사이드바 제목, 태그 관리)
- A4 페이지: `src/pages-a4/{id}.html` + `src/pages-a4/{id}.json`
- {{key}} 치환 방식
- 태그 시스템: IR / GOV / B2B (슬라이드별 복수 태그 가능)
- 레이아웃 변경은 Claude Code에서 HTML 직접 수정

---

## 13. 프로젝트 구조

```
src/
  app.html            # 메인 에디터 UI
  preview.html         # 슬라이드 프리뷰 (iframe)
  preview-a4.html      # A4 프리뷰
  index.html           # app.html로 리다이렉트
  slides/              # 슬라이드 HTML 템플릿 + JSON 데이터
  pages-a4/            # A4 페이지 HTML 템플릿 + JSON 데이터
  styles/
    tokens.css         # 디자인 토큰 (색상, 타이포, 스페이싱, 레이아웃)
    slide-grid.css     # 슬라이드 그리드 시스템
    cards.css          # 카드 컴포넌트
    components.css     # 기타 컴포넌트 (stat, table, flow, timeline 등)
    utilities.css      # 유틸리티 클래스
    layout.css         # 레거시 레이아웃 (호환용)
    page-grid-a4.css   # A4 그리드 시스템
export/
  server.js            # Playwright 기반 PNG 내보내기 서버
assets/
  brand/               # CI 로고 등 고정 브랜드 자산
reference/
  tip/                 # IR/스타트업 참고 노트
```

---

# Workflow

## 1. 로컬 서버에서 작업
- `npm run dev`로 로컬 서버(localhost:3000) 실행 후 작업
- 브라우저에서 변경사항 확인 완료 후에만 git commit/push
- **작업 중간에 git push 하지 않는다. 완성된 작업만 푸시한다**

## 2. Plan First
- 3단계 이상 또는 아키텍처 결정이 필요한 작업은 반드시 plan mode 진입
- 진행 중 문제 발생 시 즉시 멈추고 재계획
- 검증 단계도 계획에 포함

## 3. 완료 전 검증
- 동작 증명 없이 완료 처리 금지
- 변경 전후 diff 확인
- **수정 시 연관 기능 점검 필수**: 브라우저에서 직접 검증

## 4. 자율적 버그 수정
- 버그 리포트 받으면 바로 수정. 유저에게 질문하지 않는다
- 로그, 에러, 실패 테스트 직접 찾아서 해결

---

# Core Principles

- **Simplicity First**: 가능한 가장 단순하게. 최소한의 코드만 변경
- **No Laziness**: 근본 원인 찾기. 임시 수정 금지. 시니어 개발자 기준
- **Minimal Impact**: 필요한 것만 수정. 버그 유입 방지
