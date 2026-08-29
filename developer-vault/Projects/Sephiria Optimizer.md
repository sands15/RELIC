---
type: project-hub
status: completed
visibility: public
project: Sephiria Optimizer
last_reviewed: 2026-08-29
tags:
  - dev/project
  - project/sephiria-optimizer
---

# Sephiria Optimizer

> Sephiria 가방 상태를 분석해 안전한 추천 배치를 계산하는 Windows 도구의 개인 개발 이력이다. 게임 데이터나 runtime snapshot의 복사본이 아니다.

## 프로젝트 원본

- 로컬 Codex 프로젝트의 `work/sephiria_optimizer/` 소스
- snapshot plugin: `plugin_probe/SephiriaSnapshotPlugin.cs`
- companion: `companion/Optimizer.cs`, `companion/Program.cs`
- 검증: `tests/`

## 대표 이정표

- 2026-08-09 — snapshot plugin과 별도 optimizer companion, 설치·검증 기반을 구현했다. [[Daily/2026-08-09|기록]]

## 다음 체크포인트

- 다시 배포할 때는 전용 Git 저장소와 재현 가능한 build를 만들고, 지원 게임 버전별 회귀와 rollback 절차를 함께 고정한다.

