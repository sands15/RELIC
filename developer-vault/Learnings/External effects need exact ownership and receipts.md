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

# External effects need exact ownership and receipts

## 한 문장

외부 효과는 실행 직전까지 유효한 exact owner·authorization과 실행 뒤의 exact effect receipt가 함께 있을 때만 성공으로 확정한다.

## 적용 조건

- 메시지 전송, 파일 변경, 세계 상태 변경처럼 재시도가 중복 효과를 만들 수 있는 작업에 적용한다.
- 긴 await 뒤에는 epoch·lease·deadline을 다시 확인하고 결과가 불명확하면 자동 재시도하지 않는다.

## 한계와 반례

- transport receipt는 의미적 정확성이나 사용자 만족까지 증명하지 않는다.
- 명확한 pre-effect 거부와 이미 수락됐을 수 있는 timeout은 같은 실패로 취급하면 안 된다.

## 프로젝트 근거

- [[Reviews/2026-W31]]
- [[Reviews/2026-W33]]
- [[Reviews/2026-W34]]
- [[Reviews/2026-W35]]
- Evelyn 원본: `docs/AUTONOMY_AUTHORIZATION_CONTRACT.md`, `docs/worklog/2026-08-17.md`, `docs/worklog/2026-08-24.md`

