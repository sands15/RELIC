---
type: project-hub
status: completed
visibility: public
project: Sephiria Optimizer
last_reviewed: 2026-11-14
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
- 2026-08-21 — 밀집 가방 탐색·안전한 다단계 적용과 installer/companion 복구를 구현하고 v0.4.1 release blocker를 제거했다. [[Daily/2026-08-21|기록]]
- 2026-08-24 — canonical search, safe·max-damage 모드와 bounded retry를 v0.4.3으로 패키징하고 companion·plugin·installer·archive 검증을 통과했다. [[Daily/2026-08-24|기록]]
- 2026-11-14 — 게임 1.1.3에서 깨진 참조를 고치고 바뀐 위치 효과 규칙, 배치 보너스 보호, 남는 파일 자동 정리를 v0.4.8로 패키징해 설치했다. 오프라인 검사와 타이틀 화면까지의 실행만 확인했다. [[Daily/2026-11-14|기록]]

## 다음 체크포인트

- v0.4.8을 실제 런에서 확인한다(가방을 열었을 때의 추천, 추천 적용).
- 다시 배포할 때는 전용 Git 저장소와 재현 가능한 build를 만들고, 지원 게임 버전별 회귀와 rollback 절차를 함께 고정한다.
