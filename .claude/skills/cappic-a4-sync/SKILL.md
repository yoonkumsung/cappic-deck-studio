---
name: cappic-a4-sync
description: "메인 슬라이드(1920×1080)에서 A4 프린트 버전을 자동 생성/동기화. A4/프린트/배포용/PDF/접지 키워드 또는 src/pages-a4/ 경로 언급 시 트리거. a4-syncer 에이전트가 사용. 메인 슬라이드가 PASS된 후에만 호출."
---

# cappic-a4-sync — A4 버전 동기화

a4-syncer 에이전트가 메인 슬라이드 → A4 페이지로 어댑트할 때 사용.

## 호출 조건

- 메인 슬라이드(`src/slides/{id}.html`)가 design-auditor + visual-qa PASS 상태
- 사용자가 "A4 만들어줘" / "프린트 버전" / "접지용 동기화" 요청

미PASS 상태에서 요청 시 오케스트레이터에게 사유 보고 후 중단.

## 변환 규칙

### 1. 폰트 토큰 1:1 매핑

```
--fs-display  → --a4-fs-display    (48px → 32px)
--fs-stat     → --a4-fs-stat       (36px → 24px)
--fs-heading  → --a4-fs-heading    (28px → 20px)
--fs-body     → --a4-fs-body       (22px → 14px)
--fs-caption  → --a4-fs-caption    (16px → 11px)
--fs-source   → --a4-fs-source     (13px → 9px)
```

검색-치환 대상: HTML 파일 내 `var(--fs-XXX)` → `var(--a4-fs-XXX)`

### 2. 스페이싱은 유지

`--sp-*` 토큰은 그대로. 변환하지 않는다.
이유: 8px 배수 그리드 시스템의 시각적 일관성 유지.

### 3. 컨테이너 클래스 매핑

```
.slide          → .page-a4
.slide-title    → .page-a4-title
.slide-content  → .page-a4-content
.slide-source   → .page-a4-source
```

`.sg-cols-N`, `.card`, `.sg-data-list` 등 내부 컴포넌트는 그대로 유지 (page-grid-a4.css에서 A4 컨텍스트 스타일이 자동 적용됨).

### 4. JSON 데이터 복사

`src/slides/{id}.json`의 fields 배열을 그대로 복사하여 `src/pages-a4/{id}.json` 생성.
- value 변경 금지 — 콘텐츠 동일성 보장
- {{key}} 치환점 동일

### 5. 레지스트리 등록

신규일 경우 `src/data/pages-a4.json`에 메타 추가:

```json
{
  "id": "{id}",
  "title": "...",
  "tags": ["IR" | "GOV" | "B2B"],
  "sourceSlide": "{id}"  // 원본 슬라이드 ID
}
```

`tags`는 `src/data/slides.json`의 동일 id에서 복사.

## 작업 절차

1. **사전 검증**:
   - `src/slides/{id}.html` 존재 확인
   - 메인 슬라이드의 PASS 이력 확인 (`_workspace/cappic-deck/reports/{id}_*` 에서 최종 PASS)

2. **변환 실행**:
   - HTML 읽기
   - 위 규칙 1~3 적용하여 새 HTML 생성
   - `src/pages-a4/{id}.html`에 저장

3. **JSON 복사**:
   - `src/slides/{id}.json` 그대로 복사 → `src/pages-a4/{id}.json`

4. **레지스트리 갱신** (신규일 경우):
   - `src/data/pages-a4.json` 업데이트

5. **재검증**:
   - design-auditor 호출 (A4 컨텍스트로 표시) — `--a4-fs-*` 토큰 컴플라이언스 확인
   - visual-qa 호출 (preview-a4.html 사용) — A4 비율에서 오버플로우/균형 확인

6. **완료 보고**:
   - 오케스트레이터에게 PASS/FAIL + 산출 파일 경로

## 에러 핸들링

| 에러 | 대응 |
|------|------|
| 메인 슬라이드 미PASS | 동기화 거부, 사유 보고 |
| `--a4-fs-*` 토큰 미정의 폰트 발견 | architect에게 토큰 추가 요청 |
| A4 검증 FAIL | architect/curator에게 A4 컨텍스트 피드백 전달 |
| 페이지가 1장 A4에 안 들어감 | 슬라이드 분리 또는 콘텐츠 압축 검토 (architect/curator 호출) |

## 참고

- A4 토큰 정의: `src/styles/tokens.css` 내 `--a4-fs-*`
- A4 그리드: `src/styles/page-grid-a4.css`
- A4 프리뷰: `src/preview-a4.html`
- 메인 슬라이드 ↔ A4 매핑 예시: 기존 `src/pages-a4/` 디렉토리 슬라이드 참조
