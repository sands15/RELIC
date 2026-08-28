---
type: learning
created: 2026-07-18
visibility: public
projects:
  - Evelyn
tags:
  - dev/learning
  - refactoring
---

# Semantic boundaries over line count

## 한 문장

리팩터링의 완료 기준은 파일 줄 수가 아니라 상태, 판정, 실행과 수명주기를 실제 owner에게 옮기고 기존 동작이 보존됐다는 증거다.

## 적용 조건

- 한 파일이 여러 도메인의 상태와 실행 순서를 동시에 소유해 변경 영향 범위를 알기 어려울 때 적용한다.
- 이동 전후의 공개 호출 계약, 초기화 순서와 부작용 순서를 테스트로 고정한다.
- 줄 수와 함수 수는 진행 지표로 사용하되, 새 모듈의 명시적 owner와 회귀·process smoke를 함께 종료 조건으로 둔다.
- 표현만 압축하는 단계에서는 AST나 동등한 구조 비교로 의미가 바뀌지 않았음을 확인한다.

## 한계와 반례

- 작은 파일이나 일회성 경계까지 owner 객체로 감싸면 구조가 더 복잡해질 수 있다.
- 테스트와 process smoke는 외부 서비스의 live 동작을 대신하지 않으므로 배포·사용 증거는 별도로 구분한다.

## 프로젝트 근거

- [[Daily/2026-07-18]]
- [main.py 분리 목표](obsidian://open?vault=docs&file=MAIN_PY_DECOMPOSITION_TARGET_KR) — `docs/MAIN_PY_DECOMPOSITION_TARGET_KR.md`
- 최종 구조 기준점·병합 `b8665c73e1d3e5253a0bae6a877f4f16e32b446c`, `abac545848ea41b0f83b027506b6e23eaa0fd308`
