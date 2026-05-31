---
name: cappic-slide-create
description: "CAPP!C 슬라이드를 신규 생성하거나 기존 슬라이드의 HTML/JSON을 수정. 슬라이드 만들기/추가/작성/디자인, src/slides/{id}.html 작성, 레이아웃 패턴 선택, 카드 구성 시 사용. slide-architect와 content-curator 에이전트가 협업하는 작업을 안내한다."
---

# cappic-slide-create — 슬라이드 생성/수정 가이드

slide-architect와 content-curator가 함께 슬라이드 HTML+JSON을 만드는 표준 절차.

## 입력 요구사항

사용자 요청에서 다음을 추출/요청한다:

| 항목 | 필수 | 설명 |
|------|------|------|
| slide id | 필수 | kebab-case (예: `gtm-strategy-b2b`) |
| 목적 한 줄 | 필수 | 메시지 핵심 |
| 카테고리 | 필수 | IR / GOV / B2B 중 선택 |
| 콘텐츠 원본 | 필수 | 키워드/숫자/출처 포함 원문 |
| 참고 슬라이드 | 옵션 | 비슷한 패턴 슬라이드 id |

누락된 항목은 작업 시작 전에 사용자에게 요청한다.

## 레이아웃 패턴 결정 트리

```
콘텐츠 유형은?
├── 핵심 숫자 1~2개 강조 → sg-cols-1 + .sg-stat-value (큰 숫자)
├── 비교 2~4개 항목      → sg-cols-N (N=항목수) + .card (각 항목)
├── 데이터 리스트         → sg-data-list + sg-item
├── 시간 흐름             → 타임라인 컴포넌트
├── 프로세스/단계         → 플로우 다이어그램
└── 체크/금지 대비        → 체크리스트 컴포넌트
```

## 카드 종류 선택

| 카드 클래스 | 용도 |
|------------|------|
| `.card` (default) | 일반 정보 |
| `.card-secondary` | 보조 정보 |
| `.card-photo` | 이미지 중심 |
| `.card` + dark 그라데이션 | 핵심 메시지 / Ask |
| `.card` + mint 그라데이션 | 긍정 지표 / 성장 |
| `.card` + amber 그라데이션 | 전망 / 경고 |

## HTML 골격 템플릿

```html
<div class="slide">
  <h1 class="slide-title">{{title}}</h1>
  <div class="slide-content sg-cols-N">
    <div class="card">
      <h3 class="sg-card-title">{{card1Title}}</h3>
      <!-- 데이터 -->
    </div>
    <!-- 카드 반복 -->
  </div>
  <div class="slide-source">{{source}}</div>
</div>
```

## JSON 스키마 표준

```json
{
  "fields": [
    { "key": "title", "label": "슬라이드 제목", "type": "text", "value": "..." },
    { "key": "card1Title", "label": "카드 1 제목", "type": "text", "value": "..." },
    { "key": "source", "label": "출처", "type": "text", "value": "(출처: ..., 2025)" }
  ]
}
```

- `key`: camelCase, HTML의 {{key}}와 정확히 일치
- `label`: 한국어 UI 표시명
- `type`: text | number | url | image
- `value`: 실제 콘텐츠 (curator가 채움)

## 슬라이드 레지스트리 등록

신규 슬라이드인 경우 `src/data/slides.json`에 메타 추가:

```json
{
  "id": "gtm-strategy-b2b",
  "title": "B2B GTM 전략",
  "tags": ["B2B"],
  "category": "B2B"
}
```

## 절대 금지 사항

- 인라인 `style="font-size:..."`, `style="padding:..."`, `style="color:#..."` 직접 사용
- `--fs-*` / `--sp-*` / `--secondary-*` 토큰 외 값 사용
- em dash (—) 사용
- 출처 없는 숫자
- 문장형 텍스트 ("우리는 ~합니다" 같은)
- `.slide-content` 영역 (top:200, left:120, right:120, bottom:80) 초과

## 작업 완료 조건

1. `src/slides/{id}.html` 생성
2. `src/slides/{id}.json` 생성 (모든 fields value 채움)
3. `src/data/slides.json`에 메타 등록 (신규일 경우)
4. design-auditor + visual-qa 검증 PASS

## 참고

- 디자인 규칙 전문: `CLAUDE.md`
- 기존 슬라이드 패턴 참조: `src/slides/{cover,business-model,gtm-strategy}.html`
- 컴포넌트 CSS: `src/styles/{tokens,slide-grid,cards,components}.css`
