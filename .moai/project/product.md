# IR Pitch Deck Maker - Product Document

## Project Overview

CAPP!C 디자인 시스템 기반 HTML IR(Investor Relations) 슬라이드를 제작하고, 8K(7680x4320) 초고해상도로 추출하는 도구.

## Problem Statement

- IR 발표 슬라이드를 대형 스크린에서 사용할 때 기존 PPT/PDF의 해상도 한계
- 디자인 일관성 유지의 어려움 (매번 수동으로 스타일 맞추기)
- 데이터 시각화 컴포넌트(도넛 차트, 플라이휠, 타임라인 등)의 재사용성 부족

## Target User

- 대형 스크린에서 IR 발표를 하는 사용자 (GOOS)
- 8K 수준의 초고해상도 출력 필요

## Core Features

1. **CAPP!C 디자인 시스템 CSS**: 컬러 토큰, 카드 스타일, 타이포그래피, 레이아웃 패턴을 CSS 변수로 체계화
2. **HTML 슬라이드 제작**: 순수 HTML+CSS 기반 슬라이드, 1920x1080 기준 디자인
3. **재사용 컴포넌트**: 스탯 카드, 미니 테이블, 플로우 다이어그램, 체크리스트, 타임라인, 도넛 차트, 플라이휠
4. **8K 추출**: Playwright 기반 7680x4320 뷰포트에서 PNG/PDF 캡처
5. **실시간 미리보기**: 개발 서버를 통한 핫 리로드 미리보기

## Design System: CAPP!C

### Colors
- Primary Text: #1D1D1F
- Secondary Text: #48484A → #6E6E73 → #8E8E93 (3단계)
- Cyan Accent: #00C7BE (밝은) / #00A399 (진한) — SW, 성장, 긍정 지표
- Dark Accent: #1D1D1F ~ #3A3A3C — HW, Ask, 핵심 메시지
- Background: #ffffff, Card gradient: linear-gradient(165deg, #ffffff, #F5F5F7)
- Status Colors: Red #FF3B30, Amber #F59E0B, Green #34C759, Blue #2196F3

### Card Styles
- Default: gradient(165deg, #fff, #F5F5F7), radius 16-20px, triple shadow + gloss overlay
- Dark: gradient(165deg, #1D1D1F, #2C2C2E) — 핵심 숫자/Ask
- Mint: gradient(165deg, #E8FAF9, #D4F4F2) — 긍정 지표
- Amber: gradient(165deg, #FFF8E1, #FFECB3) — 전망/경고

### Typography
- Font: Pretendard Variable
- Section Label: 18px / 600 / #8E8E93 / letter-spacing 2px (영문 대문자)
- Section Title: 28px / 800 / #1D1D1F, 강조 span #00A399
- Card Title: 18-22px / 800
- Body: 15-17px / 500 / #48484A
- Min font: 13px (프로젝터 가독성 하한)
- 마침표 뒤 반드시 줄바꿈(br)

### Layout
- Container: 1280px 고정폭, 40px 패딩
- Card gap: 16-20px
- Patterns: 2-3열 카드, 풀와이드 카드, 테이블 카드
- Number emphasis: 30-42px + unit 14-20px
- Badge/Tag: radius 5-8px, 상태별 컬러

### Components
- Stat Card: 큰 숫자 + 라벨 + 서브텍스트
- Mini Table: border-collapse, 얇은 구분선
- Flow Diagram: 블록 → 화살표 → 블록 (inline flex)
- Checklist: SVG 체크 아이콘 + 텍스트
- Timeline: 가로 노드 + 화살표
- Donut Chart: SVG stroke-dasharray
- Flywheel: SVG 호 + marker-mid 화살촉

## Constraints

- 8K 해상도 (7680x4320) 지원 필수
- Pretendard Variable 폰트 사용 필수
- 최소 폰트 크기 13px (프로젝터 가독성)
- 컨테이너 1280px 고정폭

## Status

Phase: 개요 정리 중 (plan 전 단계)
