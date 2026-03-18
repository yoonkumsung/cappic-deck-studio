# IR Pitch Deck Maker - Structure Document

## Project Root

```
IR_Pitch_Deck_maker/
├── .moai/                    # MoAI 프로젝트 설정
│   ├── project/              # 프로젝트 문서
│   │   ├── product.md
│   │   ├── structure.md
│   │   └── tech.md
│   └── specs/                # SPEC 문서 (plan 후 생성)
├── moai-adk/                 # MoAI-ADK 도구 (서브모듈)
├── src/                      # 소스 코드 (계획)
│   ├── design-system/        # CAPP!C CSS 디자인 토큰
│   ├── components/           # 재사용 HTML 컴포넌트
│   ├── slides/               # 슬라이드 HTML 파일
│   ├── assets/               # 로고, 이미지
│   └── template.html         # 슬라이드 공통 래퍼
├── export/                   # 8K 추출 스크립트
├── output/                   # 생성된 PNG/PDF
└── package.json              # 프로젝트 의존성
```

## Key Directories (Planned)

- `src/design-system/`: CSS 변수, 카드 스타일, 컴포넌트 스타일
- `src/slides/`: 개별 슬라이드 HTML (00-cover.html, 01-problem.html, ...)
- `export/`: Playwright 기반 8K 캡처 스크립트
- `output/`: 최종 산출물 (PNG, PDF)

## Status

디렉토리 구조 미생성 — plan 이후 구현 단계에서 생성 예정
