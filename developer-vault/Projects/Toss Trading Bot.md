---
type: project-hub
status: active
visibility: public
project: Toss Trading Bot
last_reviewed: 2026-08-29
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
- 2026-08-28: GitHub 기준선과 더 앞선 로컬 작업 트리의 분기를 확인하고, 프로젝트에 live 전환 차단 조건과 단순화 후보를 남겼다.
- 2026-08-28: MacBook을 상시 노드로 쓰되 LLM 뉴스 요약을 거래 권한이 없는 별도 Discord 출력 파이프라인으로 분리하는 설계를 확정했다.
- 2026-08-28: 장전 가격 계획 기반 단타는 롱 1종목·1주·하루 1회와 체결 후 broker OCO로 한정하고, 기존 주문 안전 결함이 해결될 때까지 shadow-only로 두기로 했다.
- 2026-08-28: 1단계 shadow 장전 계획기를 구현해 현금·비용·위험·호가를 함께 검증하고, 계좌·거래일당 최초 계획 한 건만 불변 저장하도록 했다. 실주문 실행은 계속 차단했다.
- 2026-08-29: 설정 오타·주문 페이지 검증·알림 유실·예외정보 노출 경계를 보강하고 transactional notification outbox와 재시작 재전송 검증을 추가했다. 상세 근거는 프로젝트 `docs/development-log.md`에 둔다.
- 2026-08-29: 잠긴 단타 계획의 한 종목만 받는 독립 news worker를 구현하고 Finnhub·local LLM·뉴스 Discord를 거래 import/DB/secret에서 분리했다. 전체 회귀는 `372 passed`이며 실제 외부 서비스와 Mac 가동은 미검증이다. [[Daily/2026-08-29|기록]]

## 재사용 가능한 배움

- 배포 전에 source-of-truth, import 경로, 실제 실행 프로세스의 소스 revision을 한 묶음으로 증명한다.
- 주문 API의 timeout과 처리 중 응답은 실패가 아니라 불확정 상태이며, 대조가 끝날 때까지 같은 intent를 다시 제출하지 않는다.
- AI를 안전하게 제한하려면 프롬프트 문구만이 아니라 자격증명·쓰기 권한·역방향 데이터 흐름을 제거해야 한다.
- broker가 원자적 3-leg bracket을 지원하지 않으면 진입 체결과 보호주문 확정 사이를 별도 위험 상태로 모델링하고, 실패 시 신규 진입보다 청산을 우선한다.
- 자동매매 계획의 cash sizing은 주문금액만 나누지 말고 예상 왕복비용까지 먼저 예약해야 하며, 계획을 DB unique INSERT로 잠그면 재시작·동시 프로세스의 당일 재가격을 막을 수 있다.
- 외부 알림은 거래 상태와 따로 보내지 말고 transactional outbox에 함께 기록해야 재시작 시 유실을 막을 수 있다. 원격 멱등키가 없으면 정확히 한 번이 아니라 at-least-once임도 운영 문서에 명시한다.
- AI data-diode는 별도 프로세스라는 이름만으로 성립하지 않는다. 거래 package를 import하지 않는 실행 경로, allowlist context, 별도 DB/webhook, 거래 secret 환경 거부를 함께 검증해야 한다.

## 다음 체크포인트

- Mac 전용 가상환경과 canonical import 경로를 고정하고 Finnhub·뉴스 Discord·local LLM one-shot을 먼저 smoke test한다. 이후 실제 미국장 5세션의 뉴스 품질·중복·전력과 장전 계획을 관찰한 뒤, P0 주문 정합성·WebSocket resync·BUY→OCO 보호 상태기계를 순서대로 검증한다.
