---
type: home
scope: personal-development
visibility: public
last_reviewed: 2026-10-04
tags:
  - dev/home
---

# Developer Vault

프로젝트를 넘어 이어지는 개인 개발 이력의 시작점이다. 프로젝트의 기술적 사실이나 현재 상태의
원본은 각 프로젝트 저장소에 둔다.

## 바로가기

- [[01_INBOX|빠른 수집]]
- [[Projects/Evelyn]]
- [[Projects/Arcane Library Map]]
- [[Projects/Bambu Support Profile Automation]]
- [[Projects/How to Fish Boss HP Console]]
- [[Projects/RELIC]]
- [[Projects/Sephiria Optimizer]]
- [[Projects/Sephiria Preset Converter]]
- [[Projects/Toss Trading Bot]]
- [[Daily/2026-10-11|최근 Daily]]
- [[Reviews/2026-W40|최근 확정 주간 회고]]
- [[Decisions/2026-08-28-record-ownership|기록 소유권 결정]]
- [[Decisions/2026-08-28-public-git-backup|공개 Git 백업 결정]]
- `Daily/` — 의미 있는 결과가 생긴 날의 기록
- `Reviews/` — 사용자와 Codex가 매주 회의 후 확정하는 주간 회고

## 2026년 4월부터의 개발 이력

- 4월: [[Daily/2026-04-16|Evelyn 코드 기준선·OmniVoice 스트리밍]] · [[Daily/2026-04-20|계층형 기억·후속 검색]] · [[Daily/2026-04-22|음성 턴 수명주기·취소 경계]] · [[Daily/2026-04-25|제약형 autonomy·Mineflayer bridge]]
- 5월: [[Daily/2026-05-16|runtime 재구성·Voyager 연동]] · [[Daily/2026-05-29|Markdown memory vault]] · [[Daily/2026-05-30|runtime boot·장치 역할·입력 제어]]
- 6월: [[Daily/2026-06-01|RELIC 정적 포트폴리오·Pages 배포]] · [[Daily/2026-06-09|memory graph·안전한 tool routing]] · [[Daily/2026-06-11|Turtle 전략·상태·backtest 기반]] · [[Daily/2026-06-12|read-only broker·paper loop]] · [[Daily/2026-06-14|momentum shadow·위험 한도]] · [[Daily/2026-06-15|TTS barge-in·거래 pilot 안전 경계]] · [[Daily/2026-06-23|runtime 분해·거래 monitoring]]
- 7월: [[Daily/2026-07-12|거래 데이터·전략 안전 gate]] · [[Daily/2026-07-14|비정본 strategy·ops prototype]] · [[Daily/2026-07-15|안정화·보안 기준선]] · [[Daily/2026-07-18|main.py 책임 분리]] · [[Daily/2026-07-23|Arcane Library 데이터팩·검증기]] · [[Daily/2026-07-29|Voice P0·기억 삭제 기반]] · [[Daily/2026-07-30|crash-safe 삭제·동의 경계]] · [[Daily/2026-07-31|내구적 연속성·readiness]]
- 8월: [[Daily/2026-08-01|Arcane recall·state repair]] · [[Daily/2026-08-09|Sephiria Optimizer·Preset Converter 기반]] · [[Daily/2026-08-11|Bambu support profile 자동화]] · [[Daily/2026-08-14|Preset Converter v1.0.3]] · [[Daily/2026-08-21|Optimizer v0.4.1 안전 적용]] · [[Daily/2026-08-24|Arcane final·Optimizer v0.4.3]] · [[Daily/2026-08-29|CMD형 Boss HP 모니터]] · [[Daily/2026-08-30|Mac paper simulation release]] · [[Daily/2026-08-31|Discord paper status 조회]] · [[Reviews/2026-W31|W31]] · [[Reviews/2026-W32|W32]] · [[Reviews/2026-W33|W33]] · [[Reviews/2026-W34|W34]] · [[Reviews/2026-W35|W35]]
- 9월: [[Daily/2026-09-01|Evelyn P1 기준선·기억 경계]] · [[Daily/2026-09-02|live 보안 preflight·복구 근거 보존]] · [[Daily/2026-09-03|Local Voice soft endpoint 설계]] · [[Daily/2026-09-04|Mindcraft source/offline 보완]] · [[Daily/2026-09-05|음성 비교·Docker·Main 성격]] · [[Daily/2026-09-06|실행 정책·행동 전환 진단]] · [[Reviews/2026-W36|W36]]

- 최근 확정 회의: [[Reviews/2026-W40|W40 — 원인 수리·독립 검증 기준·반복과 대기 감소·실제 작업 적용 추적]]

검증 가능한 개발 결과가 있는 날짜와 주만 소급했으며, 빈 날이나 단순 대화·명령은 기록하지 않았다.

## 기록 흐름

1. 작업 전에 해당 `Projects/` 색인에서 관련 배움·확정 회고를 찾아 읽는다. 현재 상태는 프로젝트 원본에서 확인한다.
2. 이전 기록이 바꾼 판단·보존 조건·검사를 프로젝트의 기존 작업 기록에 연결한다. 읽기만 했으면 적용으로 세지 않는다.
3. 검증된 checkpoint가 생기면 전체 작업이 끝나기 전이라도 발생일의 `Daily/`에 짧게 기록한다.
4. 결과·적용한 배움·정확한 원본 절·검증 한계만 남긴다. 같은 원본 항목은 갱신하고 독립 결과는 보존한다.
5. 다른 작업에서도 재사용될 배움이나 확정 결정만 기존 `Learnings/`·`Decisions/`에 연결한다. 중복 승격하지 않는다.

## 작업 문제별 읽을 기록

| 이번 작업의 문제 | 먼저 확인할 기존 기록 |
| --- | --- |
| 검사 정답·완료 주장·보존 조건 | [[Reviews/2026-W40]], [[Learnings/Evidence scope is part of the result]] |
| 외부 행동·취소·중복 실행 | [[Learnings/External effects need exact ownership and receipts]] |
| 긴 작업의 멈춤·응답 생존성 | [[Learnings/Killable owners for long-running I-O]], [[Learnings/Transport liveness must drive process health]] |
| 책임 분리·큰 파일 수정 | [[Learnings/Semantic boundaries over line count]] |
| 프로젝트 문서와 개인 기록의 경계 | [[Decisions/2026-08-28-record-ownership]] |

관련 항목만 읽고 적용 위치는 프로젝트 원본에 남긴다. 이 표는 모든 작업에서 전부 읽으라는 목록이 아니다.
일일 기록과 색인의 과거 이정표를 현재 운영 상태나 아직 승인되지 않은 다음 작업으로 해석하지 않는다.

## 공개와 백업

- 이 Vault는 [sands15/RELIC](https://github.com/sands15/RELIC)의 `developer-vault/`에 공개된다.
- 저장한 노트는 공개 정보로 취급하며 로컬 절대 경로와 비공개 자료를 적지 않는다.
- 기존 동기화는 공개 가능한 Markdown과 최신 Daily 홈 연결을 처리한다. 기록 내용 작성은 Codex의 checkpoint 작업이다.
- `tools/Sync-DeveloperVault.ps1 -RefreshNavigation -Check`는 연결 갱신·공개 검사만 한다. 검사 통과와 실제 게시를 구분한다.
- 미확정 초안은 로컬에 보존한다. 기존 감시 동기화와 매일 한 번의 동기화는 노트 내용을 자동 작성하지 않는다.
- 매주 일요일 16:00 KST에 Codex가 주간 개발 회의를 시작하고, 사용자 최종 확인 뒤 회고를 공개한다.

## 기록하지 않는 것

- 프로젝트 현재 상태·설계·검증 결과의 복사본
- 비밀정보, 개인 데이터, 대화 전문, 음성, 스크린샷, 로그, 런타임 산출물
- 명령 실행 내역, 일시적 오류, 의미 없는 빈 일일 노트
