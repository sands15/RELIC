---
type: project-hub
status: active
visibility: public
project: Evelyn
last_reviewed: 2026-10-16
tags:
  - dev/project
  - project/evelyn
---

# Evelyn

> 개인 개발 이력의 색인이다. Evelyn의 현재 상태와 검증 근거의 원본이 아니다.

## 작업 전 회수

- 현재 초점·승인 범위는 아래 프로젝트 원본에서 확인한다. 이 페이지의 검토일은 색인 정리일이며 제품 검증일이 아니다.
- 검사 정답·원인 수리·기존 동작 보존: [[Reviews/2026-W40]], [[Learnings/Evidence scope is part of the result]].
- 반복 중단·접근 전환·재개 판단: [[Reviews/2026-W41]]. Laya 실제 대화 작업에서 원인 경계를 구별하고 최근 대화 정답과 실제 저장 문서 공급을 분리해 검증했다. 적용 근거는 `docs/worklog/2026-10-13.md#laya-live-activation-20261013`; 작업 시간 단축·장기 사용자 경험 개선은 별도 미검증이다.
- 외부 실행·취소 소유권: [[Learnings/External effects need exact ownership and receipts]].
- 긴 I/O·프로세스 생존성: [[Learnings/Killable owners for long-running I-O]], [[Learnings/Transport liveness must drive process health]].
- 해당 작업에 필요한 기록만 읽고 실제 바뀐 판단·검사와 결과는 프로젝트의 기존 작업 기록에 연결한다.

## 프로젝트 원본

- [Evelyn Project Home](obsidian://open?vault=docs&file=00_EVELYN_HOME) — `docs/00_EVELYN_HOME.md`
- [현재 작업 문맥](obsidian://open?vault=docs&file=01_NOW) — `docs/01_NOW.md`
- [자체 Minecraft 확장 제어](obsidian://open?vault=docs&file=worklog%2F2026-10-14) — source 원본 `docs/worklog/2026-10-14.md#minecraft-vanilla-p5-20261014`, 최신 전체검증 `docs/worklog/2026-10-16.md#minecraft-comprehensive-20261016`은 Python55/JVM21방법/전제 Java26진입점 fresh PASS·45계약/76방법 대조와54핀 불변을 확인했다. 실제 제한 look/navigate/jump/맨손attack4조작 중 새 jump는 client상승1.252m/착지0오차·서버jump+1/최종위치·각도0오차·20초 정상종료다. 실행 중 cancel/OFF/단절의0.375/0.359/0.344초 내 퇴장·관측폐기/새명령거절도 확인했다. 이전 시선5.016초/짧은보행·준비zombie 체력2→0/사망관측과 PLAY RTT20 평균1.454ms/관측96간격206.482ms는 각각 원본 `docs/worklog/2026-10-16.md#minecraft-mcu-controls-live-20261016`이 소유한다. 원거리unknown 전역거절 수리와근거리/ray/권한/취소 보호를 보존했다. 첫 OFF 전 이동준비 종료의 정확원인·본인처치 유일귀속·일반/장기전투는 OPEN, 계단/슬랩/물 실서버와 운영/화면은 NOT_RUN이다. 일반19분류는 미지원이며 `docs/worklog/2026-10-16.md#minecraft-mcu-turbo-20261016`의182설정 적용성 직접2/부분45/필수미지원135는 점수/성공수가 아니다. 원MCU 영상/VLM/픽셀/정책 연결은 미실행이다. 봇/인증포트0·원서버/설정 보존을 확인했고 다음은 미확정 이동종료 원인과 실제지형/운영 수용의 별도 조건이다. [[Daily/2026-10-16|검증 결과와 한계]] 후속 전체 플레이 구현은 승인됐고 새 source 원본 `docs/worklog/2026-10-16.md#minecraft-player-parity-implementation-20261016`에 명시v5 인벤 관측/제한 이동을 결속했다. 최신 원본 `docs/worklog/2026-10-17.md#minecraft-menu-registry-20261017`은25메뉴/실제 registry hash와 typed 양손 교환을 연결한 소유 통신5/Java44·공유 경합 수리/같은 검토 필수 잔여0을 소유한다. 다음은 메뉴 property/현재 tags·블록/속성 관측 단위의 최종 통신·검토와 레시피·유효 component/새 조작이며 단계1~2 PARTIAL·3~8 PENDING이다. [[Daily/2026-10-17|후속 기반 검증]]
- [사용자 정보 판단 데이터셋 검증](obsidian://open?vault=docs&file=worklog%2F2026-10-05) — `docs/worklog/2026-10-05.md`의 `사용자 정보 판단 데이터셋`. 작성·오프라인 검증과 실제 학습·제품 수용을 구분한다. [[Daily/2026-10-05|일일 기록]]

- [Laya 실제 텍스트 저장·조회 수용](obsidian://open?vault=docs&file=worklog%2F2026-10-13) — `docs/worklog/2026-10-13.md#laya-live-activation-20261013`. 원문 검증을 유지한 실제 저장·문서 공급·답변/UI와 후속 공동 표시 권한 수리172검사·정상 반영·API 재시작 대화 복원·기존 정보/설정 보존 PASS. 다른 작업의 후보 수용과 합산하지 않는다. 후속 물리 정보 저장·사용자 정상 청취를 확인하고 음성 재조회 기억 위치·재시작 환경을 수리해 운영 기동을 확인했다. 승인된 구 실행본 제거와 현재 기억/장치/서비스 보존도 통과했다. 일반 시작·최종12서비스/기억8 보존과 복구 미리보기·API 복구는 확인했다. 마지막 UI 확인은 도구 제한으로 미검증이며 선택 출력 부재로 수정 후 물리 재조회·청취와 장기 안정성은 남는다. [후속 원본](obsidian://open?vault=docs&file=worklog%2F2026-10-14) `docs/worklog/2026-10-14.md#laya-output-os-boundary-20261014`에서 Windows 끝점 부재와 관리자 실행 한계를 구별했다. [[Daily/2026-10-14|후속 진단]] 10:23 재개 뒤 파일8항목 내용 보존을 확인했으나 새3턴의 원격 환경 차단으로10:36 Goal BLOCKED다. 실제 음성은 지정 책상 출력과 총괄 실행 자원 조율 뒤 재개한다. [[Daily/2026-10-13|검증 결과와 한계]]

- [다양한 상황600 첫 분류90%·앞선 저장조회 연결](obsidian://open?vault=docs&file=worklog%2F2026-10-13) — `docs/worklog/2026-10-13.md#laya-expanded-evaluation-20261013` 및 `#laya-personal-tags-20261013`. 새600 최초응답540/600·JSON/보류/재시도0와 독립검산 PASS. 단일호칭68%·긴문장75.4%·과거78.9%의 약점이 남는다. 앞선 첫40 37/40·source47·실제 E4B/Laya 합성API6단계 PASS와 개발40 75%/첫실패는 보존한다. 기본OFF·추가학습/운영0이며 합성 분류가 사실성·운영 수용은 아니다. 후속 개선대상은 호칭/실명 구분과 요약 단위·문맥 보존이다. [[Daily/2026-10-13|최근 일일 기록]] · [[Daily/2026-10-11|첫 실험 기록]]

## 대표 이정표

- [원문 진단 합성 두 OS 검증](obsidian://open?vault=docs&file=worklog%2F2026-10-11) — `docs/worklog/2026-10-11.md#raw-trace-windows-docker-synthetic-20261011`. native/공개 writer14경계·회귀69·고정 ABBA800 및 독립 검산 PASS, Docker 초기OFF 복구. 실제 모델/TTS·본인 대화/운영 수용은 별도이며 raw 기본OFF다. [[Daily/2026-10-11|일일 기록]]

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
- 2026-09-01 — P1 task contract·기본 OFF private archive·사람 교정 기반 guidance를 복구 가능한 checkpoint로 고정하고 clean clone에서 source/offline 전체 회귀를 재현했다. live 서비스·장치 검증은 아니다. [[Daily/2026-09-01|기록]]
- 2026-09-02 — 선택형 archive는 암호화 preflight에서 생성 전 fail-close했고, 복구 ledger 보존과 격리된 Markdown 기억의 저장·재시작 회상·삭제 후 비회상을 검증했다. 자동 파생 기억은 owner binding 부재로 fail-closed를 유지한다. [[Daily/2026-09-02|기록]]
- 2026-09-03 — 현재 소스·검증·운영 경계를 다시 대조해 최상위 README와 공개 RELIC 포트폴리오·HTML CV·PDF CV를 최신화했다. 공개 성능 표기는 2026-08-27 Attempt 7의 Gemma 4 12B + OmniVoice 통제 하네스와 source/offline 회귀로 정정하고 legacy 모델·수치는 제거했다. 외부 서비스나 장치는 시작하지 않았고 공개 전 검사를 거쳐 GitHub `main`에 비강제 fast-forward로 동기화했다. [근거](obsidian://open?vault=docs&file=worklog%2F2026-09-03)
- 2026-09-03 — 개인 Local Voice의 300ms soft endpoint와 추가 500ms reopen 설계를 동결했다. 취소를 rollback으로 취급하지 않고 side-effect-free 준비와 exact 승격을 분리했으며 구현·테스트·live 검증은 후속 범위다. [[Daily/2026-09-03|기록]]
- 2026-09-03 — 단기 제품 목표를 단일 PC의 로컬 방송 MVP로 전환했다. 기존 Control Page·Live2D·Local TTS를 재사용한 비공개 OBS 녹화를 첫 checkpoint로 두고, 마이크·플랫폼 연동·공개 송출은 후속 검증과 별도 승인 범위로 분리했다. [[Daily/2026-09-03|기록]]
- 2026-09-03 — 기본 OFF의 context-free local chatter와 사용자 선점·별도 speaker 권한을 구현하고 source/offline 전체 회귀를 통과했다. 실제 청취·상황 적합성·방송 준비는 검증하지 않았다. [[Daily/2026-09-03|기록]]
- 2026-09-03 — 기존 Background Vision Watch scene을 local Control Page에만 안전하게 전달하도록 복구하고 source/offline 회귀를 통과했다. 실제 화면 품질과 chatter 상황 인식은 검증하지 않았다. [[Daily/2026-09-03|기록]]
- 2026-09-04 — 기존 Mineflayer pathfinder의 command·stuck·fallback·terrain 보정과 이동 품질 gate를 source/offline으로 구현했다. Docker image와 Minecraft live terrain은 검증하지 않았다. [[Daily/2026-09-04|기록]]

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

## 2026-09-04 당시 개인 체크포인트

아래는 당시 계획의 이력이다. 현재 우선순위·실행 승인으로 재사용하지 않으며 최신 프로젝트 원본을 따른다.

- 단기 제품 목표는 Minecraft 공동 탐험이다. P1-7의 동행·분담·생존 후 재합류 설계와 사용자 구조
  부담을 포함한 수용 기준을 검토한다. 구현·live 실행은 별도 승인 대상이다. [[Daily/2026-09-04|기록]]
- Mindcraft의 공유 canonical image와 격리 lifecycle gate를 통과했다. 전체 식량/action/fault gate를
  별도로 닫고, P1-6 terrain live는 별도 승인된 disposable world에서 검증한다. [[Daily/2026-09-04|기록]]
- 별도 승인된 실제 화면에서 watcher→local Control Page scene 품질과 갱신을 확인한다. chatter에는 writer owner와 local-private privacy를 고정한 뒤 연결하고, private 청취 뒤 Control Page·Live2D·TTS의 비공개 OBS 녹화로 진행한다. 공개 전에는 read-only overlay·privacy 경계·캐릭터와 복제 음성 사용권을 확인한다.
- 기존 Markdown 기억을 기준으로 유지한다. 자동 파생 기억은 owner별 source binding과 exact turn purge를 함께 검증할 때만 다시 연다.
- Local Voice soft endpoint는 capture/ASR와 prepare/promote/abort를 함께 구현·회귀한 뒤 별도 승인된 microphone에서만 활성화한다.
- exact private archive·BitLocker·Discord/Qwen live 검증은 필요와 별도 승인이 명시될 때만 진행한다.
