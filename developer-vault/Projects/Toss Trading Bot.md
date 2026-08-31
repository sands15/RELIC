---
type: project-hub
status: active
visibility: public
project: Toss Trading Bot
last_reviewed: 2026-08-31
tags:
  - dev/project
  - project/toss-trading-bot
---

# Toss Trading Bot

## 원본

- [GitHub 저장소](https://github.com/sands15/Toss_Trading_Bot)
- 프로젝트 개발일지: `docs/development-log.md`

## 개인 체크포인트

- 2026-06-11: Turtle 전략을 domain·indicator로 분리하고 API-free runtime, SQLite 상태 저장소와 보수적 backtest engine 및 테스트를 구현했다. [[Daily/2026-06-11|기록]]
- 2026-06-12: Toss read-only adapter·position reconciliation과 paper intent loop, calendar gate, 보고·AI summary·운영 dashboard 기반을 구현했다. [[Daily/2026-06-12|기록]]
- 2026-06-14: momentum shadow·point-in-time backtest와 exposure cap·cash reserve, identity·Keychain 기반 multi-user gateway를 구현했다. backtest 수치는 live 성과로 보지 않는다. [[Daily/2026-06-14|기록]]
- 2026-06-15: 제한형 live execution·order·safety 모듈과 운영 safety UX·거래 상태 알림을 구현했다. 실제 주문 성공 근거는 아니다. [[Daily/2026-06-15|기록]]
- 2026-06-23: 미확정 주문 monitoring과 Toss candle pagination 계약·테스트를 구현했다. 실제 거래 데이터는 기록하지 않았다. [[Daily/2026-06-23|기록]]
- 2026-06-24: multi-user gateway 설정 요청을 signed CSRF token으로 보호하고 정상·변조·누락 경계를 테스트했다. [[Daily/2026-06-24|기록]]
- 2026-07-12: 데이터 신선도, sector·correlation exposure와 OOS 전략 성능을 live 진입 전 gate로 구현했다. 공개 release 전의 로컬 커밋 이력이다. [[Daily/2026-07-12|기록]]
- 2026-07-14: strategy shadow·market-close·retention·research alert prototype이 512개 테스트를 통과한 감사 기록을 남겼다. 비정본 작업 트리이므로 배포 완료로 보지 않는다. [[Daily/2026-07-14|기록]]
- 2026-08-28: GitHub 기준선과 더 앞선 로컬 작업 트리의 분기를 확인하고, 프로젝트에 live 전환 차단 조건과 단순화 후보를 남겼다.
- 2026-08-28: MacBook을 상시 노드로 쓰되 LLM 뉴스 요약을 거래 권한이 없는 별도 Discord 출력 파이프라인으로 분리하는 설계를 확정했다.
- 2026-08-28: 장전 가격 계획 기반 단타는 롱 1종목·1주·하루 1회와 체결 후 broker OCO로 한정하고, 기존 주문 안전 결함이 해결될 때까지 shadow-only로 두기로 했다.
- 2026-08-28: 1단계 shadow 장전 계획기를 구현해 현금·비용·위험·호가를 함께 검증하고, 계좌·거래일당 최초 계획 한 건만 불변 저장하도록 했다. 실주문 실행은 계속 차단했다.
- 2026-08-29: 설정 오타·주문 페이지 검증·알림 유실·예외정보 노출 경계를 보강하고 transactional notification outbox와 재시작 재전송 검증을 추가했다. 상세 근거는 프로젝트 `docs/development-log.md`에 둔다.
- 2026-08-29: 잠긴 단타 계획의 한 종목만 받는 독립 news worker를 구현하고 Finnhub·local LLM·뉴스 Discord를 거래 import/DB/secret에서 분리했다. 전체 회귀는 `372 passed`이며 실제 외부 서비스와 Mac 가동은 미검증이다. [[Daily/2026-08-29|기록]]
- 2026-08-29: Mac의 공개키 원격 접속은 검증했지만 정본 불일치, 전원 유지, live fail-safe, 상태 DB 무결성 문제가 확인돼 배포·외부 smoke test를 보류했다. 상세 근거는 프로젝트 `docs/development-log.md`에 둔다. [[Daily/2026-08-29|기록]]
- 2026-08-29: AC 전원의 단기 SSH heartbeat·재접속 표본은 통과했지만 idle·장시간·재부팅 시험을 운영 gate로 남겼다. 단타 live 최소안은 기존 원장을 재사용하는 stream/runtime 두 모듈과 실행상태 표 하나로 제한했다. 상세 근거는 프로젝트 `docs/development-log.md`와 `docs/intraday-bracket-design.md`에 둔다.
- 2026-08-29: 계좌·현금·보유·수수료·시세·세션·주문 상태는 Toss API에서 매번 조회하고, 사용자가 정할 값은 선정 방식·투입/손실 한도·승인/비상청산 권한으로 축소했다. 상세 근거는 프로젝트 `docs/intraday-bracket-design.md`에 둔다.
- 2026-08-29: 자동 종목 선정과 현금비율 기반 sizing, 시스템 계획 후 단일 승인을 선택했다. OCO 보호 실패 시 기존 보유가 아니라 당일 해당 계획으로 취득해 남아 있는 전 수량만 자동 비상청산하기로 했다.
- 2026-08-29: 계획 승인은 private Discord bot의 버튼·hash 이중 확인으로 받되 채널 보기·메시지 전송 외 Discord 권한과 Toss 자격증명·주문 권한을 주지 않는 제한형 control path로 설계했다.
- 2026-08-30: 잠긴 장전 계획의 한 종목만 `trade:us`·`orderbook:us`로 구독하는 read-only shadow stream을 구현했다. OAuth·현재가·호가 조회 외 broker 요청과 계좌·주문 채널은 0건이며 전체 회귀 `483 passed`; 실제 Mac/Toss 외부 smoke와 장중 soak는 아직 남았다. 상세 근거는 프로젝트 `src/turtle_bot/toss_stream.py`, `tests/test_toss_stream.py`, `docs/toss-api-contract.md`, `docs/development-log.md`에 둔다.
- 2026-08-30: Toss 미국 실시간 거래대금 랭킹을 후보 소스로만 쓰고 거래 가능 보통주·경고·완료 봉·현재가·호가·최종 계좌/현금을 strict 재검증해 한 종목을 잠그는 자동 selector를 shadow-only로 구현했다. 전체 회귀 `496 passed`; 공식 REST의 미국 halt/LULD 부재와 broker·시장·로컬 DB 간 원자 snapshot 부재 때문에 live 승격은 계속 차단하며 실제 Mac/Toss shadow smoke도 남았다. 상세 근거는 프로젝트 `docs/development-log.md`와 `docs/toss-api-contract.md`에 둔다.
- 2026-08-30: 남은 live 경계를 단일 `intraday_live` runtime과 한 run 상태표로 제한하고, 10분 create 멱등 창·누적 fill·REST 권위·BUY→OCO 보호 공백·role별 entry kill을 설계에 고정했다. 같은 UID 승인, 상태변경 dashboard, 수동 주문이 섞이는 계좌는 live 권한으로 쓰지 않으며 authoritative halt source와 외부 deadman까지 준비되기 전에는 NO-GO다. 상세 근거는 프로젝트 `docs/intraday-bracket-design.md`, `docs/toss-api-contract.md`, `docs/macos-operations.md`에 둔다.
- 2026-08-30: 실제 주문·실계좌 시험을 별도 미래 단계로 완전히 분리하고, 현재 완료 목표를 `NON_LIVE_IMPLEMENTATION_COMPLETE / LIVE_NO_GO`로 고정했다. 한 tick 한 mutation, immutable request reservation, writer/sync fence, restart-first reconciliation, 조건주문 불명 결과의 자동 재호출 금지, exact-origin/no-redirect shadow 경계, process-level no-egress 시험과 다섯 개 Mac shadow job까지 구현 명세를 확정했다. 상세 근거는 프로젝트 `docs/intraday-bracket-design.md` 13절과 `docs/development-log.md`에 둔다.
- 2026-08-30: fake broker 기반 단타 lifecycle core, 승인 v2 consumer, SQLite v5 fence·만료·one-shot reservation, exact OCO/전량 비상청산과 재시작 fail-closed 회귀를 구현했다. 전체 `693 passed, 3 skipped`, Windows no-live gate `456 passed, 2 skipped`이며 결과는 `NON_LIVE_CORE_IMPLEMENTED / LIVE_NO_GO`다. production dispatch와 실제 외부 호출은 계속 닫혀 있다. 상세 근거는 프로젝트 `docs/development-log.md`와 `docs/intraday-bracket-design.md`에 둔다.
- 2026-08-30: 미국장 실제 시세·호가를 선택 종목 한 개에만 구독하고 USD 10,000 가상 원장으로 2026-08-31~2026-09-30을 관측하는 paper simulation을 구현했다. exact-SHA Mac release와 개인 planner/stream manifest를 검증했으며 Windows non-live gate `521 passed, 2 skipped`, Mac gate `523 passed`다. 실주문 경로는 계속 차단하고 실제 관측 시작은 로컬 Keychain 잠금 해제 뒤로 남겼다. [[Daily/2026-08-30|기록]]
- 2026-08-31: zsh의 unbraced parameter 뒤 colon이 modifier로 해석돼 Keychain account를 변형하던 LaunchAgent 실패를 braced parameter로 수정하고 회귀 검사를 추가했다. exact-SHA `8bc17c199bdcc9125db7d0f063945e048b8e12c7`를 Mac에서 검증해 한 달 USD 10,000 paper simulation을 시작했으며, 선택된 한 종목의 공개 시세·호가만 읽고 실주문 경로는 계속 닫았다. 상세 근거는 프로젝트 `docs/development-log.md`에 둔다.
- 2026-08-31: 거래 DB를 열지 않는 redacted status artifact와 exact-context Discord `/현황`을 같은 Mac shadow release에 배포했다. guild command 등록과 non-live gate는 검증했으며 실제 사용자 slash interaction은 남겼다. [[Daily/2026-08-31|기록]]
- 2026-08-31: 사용자가 `/현황` 호출을 확인했고, 자동선정 후보 없음과 시세 결측을 분리해 마지막 유효 시도의 정상 무후보만 관망 coverage로 남기는 status v2를 배포했다. zero-plan은 계속 미완료이며 Mac topology는 3/5라 live와 exact-five 완료를 주장하지 않는다. [[Daily/2026-08-31|기록]]

## 재사용 가능한 배움

- 배포 전에 source-of-truth, import 경로, 실제 실행 프로세스의 소스 revision을 한 묶음으로 증명한다.
- 주문 API의 timeout과 처리 중 응답은 실패가 아니라 불확정 상태이며, 대조가 끝날 때까지 같은 intent를 다시 제출하지 않는다.
- AI를 안전하게 제한하려면 프롬프트 문구만이 아니라 자격증명·쓰기 권한·역방향 데이터 흐름을 제거해야 한다.
- broker가 원자적 3-leg bracket을 지원하지 않으면 진입 체결과 보호주문 확정 사이를 별도 위험 상태로 모델링하고, 실패 시 신규 진입보다 청산을 우선한다.
- 자동매매 계획의 cash sizing은 주문금액만 나누지 말고 예상 왕복비용까지 먼저 예약해야 하며, 계획을 DB unique INSERT로 잠그면 재시작·동시 프로세스의 당일 재가격을 막을 수 있다.
- 외부 알림은 거래 상태와 따로 보내지 말고 transactional outbox에 함께 기록해야 재시작 시 유실을 막을 수 있다. 원격 멱등키가 없으면 정확히 한 번이 아니라 at-least-once임도 운영 문서에 명시한다.
- AI data-diode는 별도 프로세스라는 이름만으로 성립하지 않는다. 거래 package를 import하지 않는 실행 경로, allowlist context, 별도 DB/webhook, 거래 secret 환경 거부를 함께 검증해야 한다.
- sequence나 cursor가 없는 시장 데이터는 REST baseline과 WebSocket 재연결만으로 gap-free 상태를 증명할 수 없으므로, 신선도·수신시각·계획 만료를 모두 통과한 shadow 관측값도 live 진입 권한과 분리한다.
- broker 멱등키에는 유효 시간이 있으므로 canonical 요청을 먼저 영속화하고, 그 시간 안에는 exact identity recovery만 허용하며 시간이 지난 UNKNOWN은 자동 재제출하지 않는다.
- 자동매매 kill switch는 process 종료나 모든 주문 차단이 아니라 신규 진입만 durable하게 막아야 하며, 이미 생긴 포지션의 취소·보호·청산은 ownership 검증 아래 계속돼야 한다.
- 실거래를 하지 않는 구현 완료와 live 준비 완료는 서로 다른 상태다. 실제 endpoint가 연결되지 않았음을 config, read-only transport, process manifest, no-egress test의 독립된 여러 층으로 증명하고 결과 label에도 `LIVE_NO_GO`를 남겨야 한다.
- POSIX owner-only 파일 검증은 production writer뿐 아니라 테스트 fixture의 mode까지 명시해야 Windows와 Mac의 보안 동작 차이를 릴리스 게이트가 정확히 재현한다.
- 실험 coverage는 프로세스가 실행됐다는 사실만으로 채우지 않는다. 전략상 관망, 공식 휴장, 데이터 품질 실패를 별도 상태로 유지해야 결과의 표본 수와 운영 누락을 함께 해석할 수 있다.

## 다음 체크포인트

- live flag와 production dispatch는 닫은 채 protection/exit SLO·원자적 긴급 outbox, triggered stop-limit 전량 exit escalation, 전체 kill-point replay, authoritative halt/LULD source, production 승인 격리와 clean exact-SHA Mac no-egress 운영 증거를 순서대로 닫는다. 실제 pilot은 이 체크포인트와 분리해 별도 승인으로만 연다.
