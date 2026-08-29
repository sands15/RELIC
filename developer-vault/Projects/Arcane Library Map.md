---
type: project-hub
status: completed
visibility: public
project: Arcane Library Map
last_reviewed: 2026-08-29
tags:
  - dev/project
  - project/arcane-library-map
---

# Arcane Library Map

> Minecraft용 아케인 도서관 데이터팩·리소스팩과 검증 도구의 개인 개발 이력이다. 원본 월드나 플레이어 데이터의 복사본이 아니다.

## 프로젝트 원본

- 로컬 Codex 프로젝트의 `work/` 소스와 `outputs/` 배포 산출물
- 생성·정적 검증: `work/arcane_library/generate.py`, `work/arcane_library/validate.py`
- 성숙한 source validator: `work/source_v12/validate.py`, `work/source_v12/run_validation.ps1`
- 최종 데이터팩·검증기: `work/hud_state_guard_20260824/`

## 대표 이정표

- 2026-07-23 — 데이터팩·리소스팩의 gameplay 함수와 package·validation 기반을 구현했다. [[Daily/2026-07-23|기록]]
- 2026-08-01 — recall transaction, 손상 record·model reference repair와 carried/HUD 상태 복구 코드를 구현했다. [[Daily/2026-08-01|기록]]
- 2026-08-24 — 상태 집계를 8 tick·atomic commit으로 바꾸고 HUD/state verifier와 최종 배포 ZIP 세 개를 검증했다. [[Daily/2026-08-24|기록]]

## 다음 체크포인트

- 다시 개발할 때는 source와 validator를 전용 Git 저장소로 옮기고 배포 ZIP이 그 revision에서 재현됨을 확인한다.
