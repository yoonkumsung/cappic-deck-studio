---
name: cappic-slide-orchestrator
description: "CAPP!C 슬라이드 작성/수정/검증 작업을 처리하는 메인 오케스트레이터. (1) 슬라이드 만들어줘/추가해줘, (2) X 슬라이드 고쳐줘/수정해줘/개선해줘, (3) 슬라이드 검증/감사/QA/스크린샷, (4) A4 버전 동기화/생성, (5) 다시 실행/재실행/업데이트/보완 요청 시 사용. .html/.json/slide/페이지덱/IR/피치덱 키워드 또는 src/slides/, src/pages-a4/ 경로 언급 시 반드시 트리거."
---

# cappic-slide-orchestrator — CAPP!C 슬라이드 팀 오케스트레이터

CAPP!C IR 피치덱의 슬라이드 작성·수정·검증·A4 동기화 전 과정을 5명의 에이전트 팀으로 조율한다.

## 사용 시점

- "X 슬라이드 만들어줘"
- "Y 슬라이드 수정해줘"
- "이 슬라이드 검증해줘 / 스크린샷 찍어줘"
- "메인 슬라이드 A4로 동기화해줘"
- "이전 작업 다시 실행해줘 / 보완해줘"

단순 질문(예: "디자인 토큰이 뭐야?")은 직접 응답하고 이 워크플로우는 호출하지 않는다.

## 팀 구성

| 에이전트 | 역할 | 단계 |
|---------|------|------|
| slide-architect | 레이아웃 + HTML 골격 | Producer |
| content-curator | 키워드식 메시지 + 출처 | Producer |
| design-auditor | 토큰 컴플라이언스 검증 | Reviewer |
| visual-qa | Playwright 스크린샷 + 오버플로우/균형 검증 | Reviewer |
| a4-syncer | A4 버전 동기화 (옵션) | Adapter |

## 실행 모드

**기본:** 에이전트 팀 모드 (`CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`)
- `TeamCreate(team_name="cappic-deck-team", members=[5명])`
- 팀원 간 SendMessage로 자체 조율
- TaskCreate로 진행 추적

**Fallback (Agent Teams 미설정 시):** 서브 에이전트 모드
- Producer 단계만 `run_in_background=true`로 병렬
- Reviewer 단계도 병렬, 결과 수집 후 다음 루프

## 워크플로우

### Phase 0: 컨텍스트 확인

`_workspace/cappic-deck/` 존재 여부와 사용자 요청을 비교:

| 조건 | 모드 |
|------|------|
| `_workspace/` 없음 | **초기 실행** — Phase 1부터 시작 |
| `_workspace/` 있음 + 사용자가 "다시", "보완" 언급 | **부분 재실행** — 해당 에이전트만 재호출 |
| `_workspace/` 있음 + 새 슬라이드 ID | **새 실행** — `_workspace/`를 `_workspace_prev/`로 이동 |

### Phase 1: 의도 분석

사용자 요청을 4가지 의도 중 하나로 분류:

1. **신규 슬라이드 생성** — slide id가 새것
2. **기존 슬라이드 수정** — slide id가 `src/slides/`에 존재
3. **검증만 수행** — "검증/감사/QA" 키워드 + slide id
4. **A4 동기화** — "A4" 키워드 + slide id

의도별로 다음 Phase 진입 경로가 다르다.

### Phase 2: Producer 단계 (1, 2번 의도일 때만)

**실행 모드: 에이전트 팀 (병렬)**

1. `TeamCreate("cappic-deck-team", members=[slide-architect, content-curator, design-auditor, visual-qa, a4-syncer])`
2. `TaskCreate`:
   - architect에게: "레이아웃 + HTML 골격 작성 (slide id: {id}, 목적: {목적})"
   - curator에게: "메시지를 키워드식으로 압축 + 출처 검증 (slide id: {id})"
3. 두 Producer가 SendMessage로 조율:
   - architect → curator: 결정된 fields 키 목록
   - curator → architect: 분량이 많으면 컬럼 수 증가 요청

### Phase 3: Reviewer 단계 (1, 2, 3번 의도)

**실행 모드: 에이전트 팀 (병렬)**

1. design-auditor에게 `TaskCreate("토큰 컴플라이언스 검증")`
2. visual-qa에게 `TaskCreate("Playwright 스크린샷 + 시각 검증")`
3. 두 Reviewer가 독립 검증 후 결과 보고

### Phase 4: 개선 루프

Reviewer 중 하나라도 FAIL 보고 시:
1. 위반 목록을 해당 Producer(architect 또는 curator)에게 SendMessage로 전달
2. Producer가 수정 후 다시 Phase 3 진입
3. 최대 3회 루프 — 그 이상이면 사용자에게 개입 요청

### Phase 5: A4 동기화 (옵션)

메인 슬라이드가 PASS되고 다음 중 하나면 진입:
- 사용자가 "A4도 같이" 요청
- 4번 의도 (A4 동기화 단독 요청)
- 사용자 명시 동의 시

a4-syncer에게 `TaskCreate("A4 버전 동기화")` → Phase 3 재실행 (A4 컨텍스트)

### Phase 6: 정리

- 모든 PASS 완료 시 사용자에게 결과 보고
- `_workspace/cappic-deck/` 보존 (감사 추적용)
- 팀 정리 (`TeamDelete` 또는 세션 종료)

## 데이터 전달 프로토콜

| 데이터 | 방식 | 위치 |
|--------|------|------|
| 작업 할당/진행률 | TaskCreate / TaskUpdate | 팀 공유 |
| Producer/Reviewer 피드백 | SendMessage | 팀원 간 직접 |
| 슬라이드 산출물 | 파일 | `src/slides/{id}.{html,json}` |
| A4 산출물 | 파일 | `src/pages-a4/{id}.{html,json}` |
| QA 스크린샷 | 파일 | `_workspace/cappic-deck/qa/{id}_{mode}.png` |
| 검증 보고서 | 파일 | `_workspace/cappic-deck/reports/{id}_{round}.md` |

## 에러 핸들링

| 에러 유형 | 대응 |
|----------|------|
| `npm run dev` 미실행 | visual-qa가 보고 → 사용자에게 시작 요청 |
| Playwright 미설치 | 안내 후 중단 |
| 출처 없는 숫자 끝까지 미제공 | curator가 해당 숫자 제거 후 보고 |
| 토큰 위반 루프 3회 초과 | 사용자 개입 요청 |
| 슬라이드 ID 충돌 | 사용자에게 덮어쓰기/이름변경 선택 요청 |

## 테스트 시나리오

**정상 흐름:**
사용자: "GTM 3단계 전략 슬라이드 만들어줘 (B2B 카테고리)"
→ Phase 1: 신규 생성 의도 + slide id: `gtm-strategy-b2b`
→ Phase 2: architect가 `sg-cols-3` + 카드 3장 결정, curator가 단계별 메시지 압축
→ Phase 3: design-auditor PASS, visual-qa에서 우측 카드 텍스트 오버플로우 발견
→ Phase 4: architect에게 컬럼 비율 조정 요청 → 재검증 PASS
→ Phase 5: 사용자에게 "A4도 만들까요?" 확인
→ Phase 6: 완료 보고

**에러 흐름:**
사용자: "재무 슬라이드에 매출 100억 추가해줘"
→ Phase 1: 수정 의도
→ Phase 2: curator가 "100억"의 출처를 사용자에게 요청
→ 사용자 미응답 → curator가 해당 숫자 제거 후 진행
→ Phase 3-6 정상 진행

## 후속 작업 지원

본 오케스트레이터의 description은 "다시 실행", "재실행", "보완" 키워드를 포함하여 후속 요청에서도 트리거된다. Phase 0에서 `_workspace/` 존재를 감지하면 자동으로 부분/전체 재실행 모드를 결정한다.

## 참고

- 디자인 규칙: `CLAUDE.md` 12개 절
- 에이전트 정의: `.claude/agents/{name}.md`
- 보조 스킬: `.claude/skills/cappic-slide-{create,audit,visual-qa,a4-sync}/`
