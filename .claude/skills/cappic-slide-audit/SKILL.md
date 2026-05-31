---
name: cappic-slide-audit
description: "CAPP!C 슬라이드 HTML의 디자인 시스템 컴플라이언스 검증. CSS 토큰 외 사용(인라인 hex/rgba, 6단계 외 폰트, 5단계 외 스페이싱), em dash, 출처 없는 숫자 검출. design-auditor 에이전트가 사용. 슬라이드 검증/감사/audit/체크/규칙 검증 요청 시 트리거."
---

# cappic-slide-audit — 디자인 시스템 컴플라이언스 검증

design-auditor 에이전트의 핵심 작업 스킬. CLAUDE.md의 12개 규칙 위반을 정적 분석으로 검출한다.

## 검출 카테고리

### A. 색상 위반

**A1. 인라인 hex 사용**
- 패턴: `style="...color:#[0-9a-fA-F]{3,6}..."` 또는 `background:#...`
- 예외: 디자인 토큰 정의 파일(`src/styles/tokens.css`)은 검증 제외
- 수정: `var(--text-primary)`, `var(--secondary)` 등 토큰으로 치환

**A2. 인라인 rgba 사용**
- 패턴: `rgba\([0-9.,\s]+\)`가 인라인 style에 직접 사용
- 수정: `var(--secondary-05/10/15/20/50/70)` 또는 정의된 토큰 사용

**A3. 라이트모드 회색 텍스트 금지**
- 패턴: 라이트모드 컨텍스트에서 `#666`, `#777`, `#888`, `#999`, `#AAA` 등
- 허용 한계: `#555555` (그라파이트)
- 수정: `var(--text-tertiary)` 사용 (자동으로 라이트/다크 전환)

**A4. 잘 안 보이는 흰색 텍스트**
- 패턴: `rgba(255,255,255,0.1~0.25)` 이하 투명도
- 수정: 토큰 사용 + opacity 별도 지정

### B. Typography 위반

**B1. 6단계 외 font-size**
- 허용: `var(--fs-display|stat|heading|body|caption|source)` 6종만
- 금지 예시: `font-size: 14px`, `15px`, `18px`, `20px`, `24px`, `30px` 등
- A4 컨텍스트: `var(--a4-fs-*)` 사용 검증

### C. Spacing 위반

**C1. 5단계 외 padding/margin/gap**
- 허용: `var(--sp-xs|sm|md|lg|xl)` 5종만 (값: 8/16/24/32/48)
- 금지 예시: `padding: 12px`, `20px`, `28px`, `36px` 등

### D. 구조 위반

**D1. 임의 그리드**
- 패턴: `grid-template-columns: ...`가 인라인 style에 직접 사용
- 허용: `.sg-cols-N` (N=1~6) 클래스만 사용

**D2. .slide-content 영역 초과**
- 좌표: top:200, left:120, right:120, bottom:80 (1920×1080 기준)
- 위반: 절대 위치 요소가 이 영역 밖에 배치됨

### E. 텍스트 위반

**E1. em dash (—) 잔존**
- 패턴: 본문 텍스트에 `—` (U+2014) 문자 존재
- 수정: 하이픈(`-`) 또는 콜론(`:`)으로 대체
- 예외: 출처 표기의 dash는 허용 여부 사용자 확인

**E2. 출처 없는 숫자**
- 휴리스틱: 정규식 `\d+(억|만|%|배|개|명)` 매칭 후, 같은 카드/슬라이드 내 "출처" 키워드 부재
- 보고: 위치 + 해당 숫자

**E3. 문장형 텍스트**
- 휴리스틱: 마침표 `.` 또는 종결어미(`습니다`, `합니다`, `있다`, `한다`)가 3개 이상
- 보고: 키워드식 재작성 권장

## 출력 포맷

```markdown
# CAPP!C Slide Audit Report

**Target:** `src/slides/{id}.html`
**Result:** FAIL (위반 7건) | PASS

## A. 색상 위반 (3건)
- L42: `style="color:#7EDCE6"` → `var(--secondary)` 사용
- L58: `rgba(255,255,255,0.2)` → `var(--secondary-20)` 사용

## B. Typography 위반 (2건)
- L31: `font-size: 18px` → `var(--fs-caption)` 또는 `var(--fs-body)`

## C. Spacing 위반 (1건)
- L77: `padding: 20px` → `var(--sp-sm)` 또는 `var(--sp-md)`

## E. 텍스트 위반 (1건)
- L65: "2025년 매출 100억 달성" → 출처 누락
```

## 호출 방법

design-auditor 에이전트가 다음 순서로 실행:

1. 대상 파일 Read
2. 각 카테고리별 정규식/패턴 매칭
3. 위반 항목을 위 포맷으로 보고서 작성
4. `_workspace/cappic-deck/reports/{id}_audit_{round}.md`에 저장
5. SendMessage로 slide-architect/content-curator에게 위반 통보

## 참고

- 디자인 시스템 정의: `CLAUDE.md` 1~12절
- 토큰 정의: `src/styles/tokens.css`
- A4 토큰: `--a4-fs-*` (별도 변수)
