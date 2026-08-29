---
type: project-hub
status: completed
visibility: public
project: How to Fish Boss HP Console
last_reviewed: 2026-08-29
tags:
  - dev/project
  - project/how-to-fish-boss-hp
---

# How to Fish Boss HP Console

> Unity Mono 게임의 동기화된 보스 체력을 읽기 전용 CMD에 표시하는 작은 진단 도구의 개인 개발 이력이다.

## 프로젝트 원본

- 로컬 Codex 프로젝트의 `outputs/HowToFish-BossHP-CMD/`
- 핵심 소스: `outputs/HowToFish-BossHP-CMD/source/BossHpConsole.cs`

## 대표 이정표

- 2026-08-29 — 공개 static getter를 짧게 polling하고 값이 바뀔 때만 출력하는 CMD monitor를 구현해 실제 게임 assembly 기준 build와 격리 설치를 검증했다. [[Daily/2026-08-29|기록]]

## 다음 체크포인트

- 게임 update 뒤 API signature가 바뀌면 assembly contract를 다시 확인하고 read-only 경계가 유지되는지 재검증한다.

