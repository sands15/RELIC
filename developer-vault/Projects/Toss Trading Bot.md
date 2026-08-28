---
type: project-hub
status: active
visibility: public
project: Toss Trading Bot
last_reviewed: 2026-08-28
tags:
  - dev/project
  - project/toss-trading-bot
---

# Toss Trading Bot

## 원본

- [GitHub 저장소](https://github.com/sands15/Toss_Trading_Bot)
- 프로젝트 개발일지: `docs/development-log.md`

## 개인 체크포인트

- 2026-08-28: GitHub 기준선과 더 앞선 로컬 작업 트리의 분기를 확인하고, 프로젝트에 live 전환 차단 조건과 단순화 후보를 남겼다.
- 2026-08-28: MacBook을 상시 노드로 쓰되 LLM 뉴스 요약을 거래 권한이 없는 별도 Discord 출력 파이프라인으로 분리하는 설계를 확정했다.
- 2026-08-28: 장전 가격 계획 기반 단타는 롱 1종목·1주·하루 1회와 체결 후 broker OCO로 한정하고, 기존 주문 안전 결함이 해결될 때까지 shadow-only로 두기로 했다.

## 재사용 가능한 배움

- 배포 전에 source-of-truth, import 경로, 실제 실행 프로세스의 소스 revision을 한 묶음으로 증명한다.
- 주문 API의 timeout과 처리 중 응답은 실패가 아니라 불확정 상태이며, 대조가 끝날 때까지 같은 intent를 다시 제출하지 않는다.
- AI를 안전하게 제한하려면 프롬프트 문구만이 아니라 자격증명·쓰기 권한·역방향 데이터 흐름을 제거해야 한다.
- broker가 원자적 3-leg bracket을 지원하지 않으면 진입 체결과 보호주문 확정 사이를 별도 위험 상태로 모델링하고, 실패 시 신규 진입보다 청산을 우선한다.

## 다음 체크포인트

- canonical source와 P0 주문 정합성을 먼저 정리한 뒤, 독립 news-only worker와 intraday bracket 상태기계를 각각 shadow 모드로 검증한다.
