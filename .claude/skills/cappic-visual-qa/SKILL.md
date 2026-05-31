---
name: cappic-visual-qa
description: "CAPP!C 슬라이드를 Playwright로 스크린샷 캡처하고 오버플로우/레이아웃 균형/가독성을 시각 검증. 스크린샷/screenshot/캡처/시각 검증/오버플로우 체크 요청 시 트리거. visual-qa 에이전트가 사용. 다크모드/라이트모드 양쪽 캡처 후 직접 이미지를 확인하여 평가."
---

# cappic-visual-qa — 시각 품질 검수 스킬

visual-qa 에이전트의 핵심 작업 스킬. Playwright로 실제 렌더 결과를 캡처하고 시각적 문제를 검출한다.

## 사전 조건

1. **로컬 서버 실행 중** — `npm run dev` (localhost:3000)
2. **PNG export 서버 실행 중** — `npm run export` (필수 — CLAUDE.md Workflow 1 참조)
3. **Playwright 설치** — `npx playwright install chromium`

미충족 시 사용자에게 시작 요청하고 중단한다.

## 캡처 절차

### 1. 슬라이드 캡처 (1920×1080)

```javascript
// scripts/capture-slide.js (번들된 스크립트로 실행 가능)
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const page = await ctx.newPage();

  // 다크모드
  await page.goto(`http://localhost:3000/preview.html?slide=${slideId}&mode=dark`);
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: `_workspace/cappic-deck/qa/${slideId}_dark.png`, fullPage: false });

  // 라이트모드
  await page.goto(`http://localhost:3000/preview.html?slide=${slideId}&mode=light`);
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: `_workspace/cappic-deck/qa/${slideId}_light.png`, fullPage: false });

  await browser.close();
})();
```

### 2. A4 캡처 (preview-a4.html 사용)

A4 컨텍스트일 때:
```
http://localhost:3000/preview-a4.html?page={id}
```
- viewport: A4 비율 (예: 794×1123 또는 1240×1754 — 사용자 설정 확인)

## 검사 항목

### V1. 오버플로우 (가장 중요)

**경계 정의 (1920×1080 슬라이드):**
- 외곽: 0~1920 / 0~1080 절대 초과 금지
- 콘텐츠 영역: top:200, left:120, right:1800, bottom:1000

**검출 방법:**
1. 스크린샷에서 슬라이드 경계 근처에서 카드/텍스트가 잘리는지 육안 확인
2. 하단 80px 여백 침범 여부 확인
3. 의심되면 페이지에서 `getBoundingClientRect()` 실행하여 좌표 측정

### V2. 레이아웃 균형

- 컬럼 무게 비교 — 한쪽이 빈 경우 / 과밀 경우
- 카드 높이 정렬 — sg-cols 그리드에서 들쭉날쭉
- 슬라이드 중앙 정렬 깨짐
- 좌우 여백 비대칭

### V3. 가독성

- 텍스트가 배경에 묻힘 (육안 가독성 평가)
- 라이트모드에서 회색 텍스트가 너무 흐림
- 작은 글씨 (--fs-source 13px 이외 12px 미만 검출)
- 출처 텍스트가 너무 크거나 작음

### V4. 모드별 일관성

- 다크모드/라이트모드 양쪽 캡처
- 라이트모드에서 안 보이는 흰색/연한 요소
- 다크모드에서 안 보이는 검정 요소

## 보고서 포맷

```markdown
# CAPP!C Visual QA Report

**Target:** `src/slides/{id}.html`
**Captures:**
- Dark: `_workspace/cappic-deck/qa/{id}_dark.png`
- Light: `_workspace/cappic-deck/qa/{id}_light.png`

**Result:** FAIL (이슈 3건) | PASS

## V1. 오버플로우 (1건)
- 우측 카드 (3번째) 본문이 하단 경계 약 40px 침범
- 조치: 카드 패딩 축소 또는 메시지 압축

## V2. 균형 (1건)
- sg-cols-3에서 중앙 카드가 비어 보임 (콘텐츠 분량 좌:200자 / 중:50자 / 우:180자)
- 조치: 중앙 카드 콘텐츠 보강 또는 sg-cols-2로 축소

## V3. 가독성 (1건, 라이트모드)
- "출처: ..." 텍스트가 #B0B0B0인데 흰 배경에서 너무 흐림
- 조치: 다크모드 대응 토큰 사용 (var(--text-tertiary)가 라이트에서 #555로 전환됨)
```

## 호출 방법

visual-qa 에이전트가:

1. 캡처 스크립트 실행 (Bash)
2. 생성된 PNG를 Read tool로 직접 시각 확인
3. 4개 검사 항목 적용
4. 보고서 작성 → `_workspace/cappic-deck/reports/{id}_qa_{round}.md`
5. SendMessage로 slide-architect/content-curator에게 시각 피드백 통보

## 호출 시 주의

- Playwright는 한 슬라이드당 2~5초 소요. 다수 슬라이드 검증 시 병렬화 고려
- 스크린샷 직접 보지 않고 "PASS" 보고 금지 — 반드시 Read tool로 이미지 확인

## 참고

- preview.html 구조: `src/preview.html`
- 슬라이드 좌표 시스템: `src/styles/slide-grid.css`
- CLAUDE.md "10. 오버플로우 금지" 절
