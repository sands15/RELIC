---
type: learning
created: 2026-08-28
visibility: public
projects:
  - Evelyn
tags:
  - dev/learning
  - reliability
---

# Killable owners for long-running I/O

## 한 문장

호출자보다 오래 살아남을 수 있는 blocking I/O는 kill·reap 가능한 별도 owner가 맡고, 실패 뒤에는 authoritative storage에서 상태를 다시 판정한다.

## 적용 조건

- thread를 중단할 수 없고 timeout 뒤 late write가 가능한 filesystem·driver·외부 client 작업에 적용한다.
- process generation, bounded protocol, cleanup과 disk-first reconciliation을 한 계약으로 둔다.

## 한계와 반례

- 짧고 취소 가능한 순수 읽기까지 별도 process로 옮길 필요는 없다.
- kill 성공만으로 mutation 부재가 증명되지는 않으므로 canonical 상태 재검사가 필요하다.

## 프로젝트 근거

- [[Reviews/2026-W34]]
- [[Reviews/2026-W35]]
- Evelyn 원본: `docs/worklog/2026-08-22.md`, `docs/worklog/2026-08-23.md`

