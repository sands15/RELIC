---
type: learning
created: 2026-09-01
visibility: public
projects:
  - Toss Trading Bot
tags:
  - dev/learning
  - reliability
---

# Transport liveness must drive process health

## 한 문장

애플리케이션 heartbeat가 갱신돼도 transport는 끊겨 있을 수 있으므로, 장기 실행 gateway client는 disconnect·connect·resume을 직접 추적하고 제한 시간 내 회복되지 않으면 실패 종료해 supervisor가 재시작하게 한다.

## 적용 조건

- WebSocket·stream client와 별도 작업 loop가 같은 프로세스에서 서로 다른 건강 신호를 만들 때 적용한다.
- 정상 재연결보다 긴 유예시간을 두고, 유예 중에는 degraded 상태를 내보낸 뒤 비정상 종료를 native supervisor에 맡긴다.

## 한계와 반례

- host 전원·전체 network·supervisor 자체가 멈춘 장애는 이 패턴만으로 복구하거나 알릴 수 없다.
- client의 generic ready flag가 실제 reconnect 구간에서 내려가는지는 해당 버전 구현을 확인해야 한다.

## 프로젝트 근거

- Toss Trading Bot 원본: `docs/macos-operations.md`, `src/turtle_approval/worker.py`, `tests/test_discord_approval.py`
