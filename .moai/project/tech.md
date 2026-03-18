# IR Pitch Deck Maker - Tech Document

## Tech Stack (Planned)

| Area | Technology | Reason |
|------|-----------|--------|
| Slide Rendering | Pure HTML + CSS | 디자인 완전 제어, 프레임워크 오버헤드 없음 |
| Font | Pretendard Variable | CAPP!C 지정 폰트 |
| Charts/Diagrams | SVG (inline) | 8K 스케일링에도 선명, stroke-dasharray 기반 |
| 8K Capture | Playwright | headless 브라우저, 뷰포트 크기 자유 설정 |
| Output | PNG (8K) + PDF | 프로젝터용 이미지 + 배포용 PDF |
| Dev Server | Vite or live-server | 핫 리로드 미리보기 |
| Package Manager | npm | 표준 Node.js 패키지 관리 |

## 8K Resolution Strategy

- 슬라이드 기본 크기: 1920x1080 (16:9)
- Playwright viewport: 7680x4320
- deviceScaleFactor: 1 (CSS px = physical px)
- 모든 차트/다이어그램은 SVG로 벡터 기반 → 스케일링 시 선명도 보장
- 폰트 렌더링: font-smoothing 활용

## Dependencies (Planned)

- `playwright` — headless browser 8K 캡처
- `vite` or `live-server` — 개발 서버
- 추가 의존성은 최소화 (순수 HTML+CSS 중심)

## Development Environment

- Platform: Windows 11 (Git Bash)
- Node.js + npm
- MoAI-ADK for development workflow
