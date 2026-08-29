---
type: project-hub
status: active
visibility: public
project: Evelyn
last_reviewed: 2026-08-29
tags:
  - dev/project
  - project/evelyn
---

# Evelyn

> 개인 개발 이력의 색인이다. Evelyn의 현재 상태와 검증 근거의 원본이 아니다.

## 프로젝트 원본

- [Evelyn Project Home](obsidian://open?vault=docs&file=00_EVELYN_HOME) — `docs/00_EVELYN_HOME.md`
- [현재 작업 문맥](obsidian://open?vault=docs&file=01_NOW) — `docs/01_NOW.md`

## 대표 이정표

- 2026-04-16 — 저장소 기준선을 만들고 Discord 음성 응답을 OmniVoice 스트리밍 TTS로 연결했으며 봇 실행기와 모델 서버 흐름을 분리했다. 당시 live E2E를 재검증한 기록은 아니다. [[Daily/2026-04-16|기록]]
- 2026-04-20 — 기억을 room·person·session 범위로 나누고 미완 질문과 약속을 후속 검색으로 이어가는 기반을 구현했다. 실제 대화·기억 내용은 기록하지 않았다. [[Daily/2026-04-20|기록]]
- 2026-04-22 — 음성 작업을 세션·턴에 결박하고 stale 작업 취소, partial·committed STT, 화자 gate와 interruptible TTS 기반을 구현했다. [[Daily/2026-04-22|기록]]
- 2026-04-25 — 자연어 판단과 외부 행동을 나누는 제약형 autonomy router와 Mineflayer 실행 bridge를 구현했다. 실제 Minecraft E2E 근거는 아니다. [[Daily/2026-04-25|기록]]
- 2026-05-16 — runtime package와 gateway·skill 경계를 재구성하고 Evelyn 소유의 Voyager adapter 및 재개·완료 bookkeeping을 구현했다. vendoring된 원본 코드는 성과에서 제외했다. [[Daily/2026-05-16|기록]]
- 2026-05-29 — Markdown memory vault와 관리 API·UI, 음성 파이프라인 연결 및 테스트 기반을 구현했다. 실제 기억 내용은 기록에서 제외했다. [[Daily/2026-05-29|기록]]
- 2026-05-30 — memory vault 가독성과 관리 기능을 보강하고 runtime boot progress, GPU 역할 및 음성 입력원 제어 경계를 구현했다. [[Daily/2026-05-30|기록]]
- 2026-06-09 — memory graph UI와 등록된 tool만 실행하는 fail-closed Control Page routing 및 경계 테스트를 구현했다. [[Daily/2026-06-09|기록]]
- 2026-06-15 — local TTS barge-in·speaker verification과 음성 turn orchestration 검증 경로를 구현했다. 실제 장치 E2E 근거는 아니다. [[Daily/2026-06-15|기록]]
- 2026-06-23 — `main.py`에서 Control Page·Discord·memory·voice 상태를 분리하고 main LLM·voice delivery runtime을 추출했다. 최종 분해 이정표는 7월 18일이다. [[Daily/2026-06-23|기록]]
- 2026-07-15 — 복구·보안·회귀 기준선을 고정하고 실제 Control Page 요청 경계와 950개 회귀를 검증했다. Discord 음성·Minecraft E2E는 범위 밖이다. [[Daily/2026-07-15|기록]]
- 2026-07-18 — `main.py`의 상태·판정·실행 책임을 typed owner로 분리하고 8,793줄을 2,402줄로 축소한 뒤 1,289개 회귀를 통과했다. 외부 runtime은 재시작하지 않았다. [[Daily/2026-07-18|기록]]
- 2026-07-29 — Voice P0 검증 프레임워크와 기억 provenance·삭제 계약의 초기 기반을 구현했다. 실제 음성 E2E 성공 근거는 아니다. [[Daily/2026-07-29|기록]]
- 2026-07-30 — 파생 기억까지 포함한 crash-safe 삭제, 자율행동·world lease와 세션 한정 마이크 동의 경계를 구현·검증했다. [[Daily/2026-07-30|기록]]
- 2026-07-31 — 내구적 대화 연속성, 기능 readiness와 기억 evidence lifecycle을 source/offline 중심으로 검증했다. [[Daily/2026-07-31|기록]]
- 2026-08-08 — 실제 Evelyn TTS 요청에서 OmniVoice PCM과 로컬 런타임 준비를 확인했다. 장치 E2E와 사용자 청취 검증은 범위 밖이다. [근거](obsidian://open?vault=docs&file=worklog%2F2026-08-08)
- 2026-08-16 — 격리된 fresh world에서 Minecraft shelter·두 번의 밤낮 주기·정상 재시작·경험 복구를 완주했다. 운영 환경 검증은 아니다. [근거](obsidian://open?vault=docs&file=worklog%2F2026-08-16)
- 2026-08-21 — 제한된 읽기와 1회성 정확 승인에 묶인 LLM 작업 루프를 구현하고 로컬 read/create E2E를 확인했다. [근거](obsidian://open?vault=docs&file=worklog%2F2026-08-21)
- 2026-08-27 — 통제된 Main→TTS-ready 하네스에서 graph-on 지연 개선과 출력 동등성을 검증했다. 전체 음성 SLO 완료 근거는 아니다. [근거](obsidian://open?vault=docs&file=worklog%2F2026-08-27)
- 2026-08-28 — 기본 OFF private archive의 단독 writer·보존·접근·삭제 경계를 구현하고 source/offline 회귀를 통과시켰다. 운영 완료는 아니다. [근거](obsidian://open?vault=docs&file=worklog%2F2026-08-28)

일일 기록은 이 노트의 백링크에서 찾고, 이 목록에는 대표 이정표만 유지한다.

## 소급 주간 회고

- [[Reviews/2026-W31|W31]] · [[Reviews/2026-W32|W32]] · [[Reviews/2026-W33|W33]] · [[Reviews/2026-W34|W34]] · [[Reviews/2026-W35|W35]]

## 재사용 가능한 배움

- [[Learnings/Semantic boundaries over line count]]
- [[Learnings/Evidence scope is part of the result]]
- [[Learnings/External effects need exact ownership and receipts]]
- [[Learnings/Killable owners for long-running I-O]]

## 개인 결정

- [[Decisions/2026-08-28-record-ownership]]
- [[Decisions/2026-08-28-public-git-backup]]

## 다음 개인 체크포인트

- 일주일 동안 의미 있는 작업만 기록한 뒤, 기록이 반복 조사와 회고 시간을 실제로 줄였는지 검토한다.
