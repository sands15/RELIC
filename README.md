# RELIC

**손정훈 Portfolio**

RELIC은 결과만 모아두는 포트폴리오가 아니라, AI와 개발을 공부하며 만든 것과 막힌 지점, 다음 목표를 함께 기록하는 성장일기입니다.

현재 페이지는 `ssongmi.github.io`의 짙은 네이비와 골드 톤을 참고해 구성한 GitHub Pages 포트폴리오입니다.

---

## 1. Hero

- **Title:** RELIC
- **Headline:** 아이디어를 작동하는 AI 시스템으로 구현하는 개발자
- **Description:** 아이디어를 실제로 동작하는 AI 서비스로 만드는 과정을 기록
- **Intro Motion:** 화면 중앙의 `RELIC` 글자가 하나씩 나타난 뒤, 같은 중앙 위치의 풀스크린 Hero로 이어지는 네이비/골드 인트로
- **Navigation:** About, Education, Skills, Projects, Experience, CV, Career, References, Contact

---

## 2. About Me

입력, 판단, 응답, 실행이 이어지는 흐름을 직접 연결하며 AI 시스템을 이해하고 있습니다.

현재는 LLM application, 음성 AI, AI agent, 웹 인터페이스를 중심으로 작은 실험들을 쌓아가고 있으며, 그중 가장 큰 프로젝트가 Evelyn입니다.

- **전공:** 인공지능공학
- **관심 분야:** Voice AI, LLM Application, AI Agent
- **진로 목표:** 아이디어를 작동하는 AI 시스템으로 구현하는 개발자
- **현재 학습 중인 기술:** Python, JavaScript, STT/TTS Pipeline, LLM Routing
- **AI 분야 관심 주제:** 음성 인터페이스, 캐릭터형 AI, autonomous agent

---

## 3. Education

- **School:** Chosun University
- **Department:** Artificial Intelligence Engineering
- **Year:** 2nd year
- **Period:** 2023.03 - Present

### Relevant Coursework

- Data Structures
- Web Programming
- C/C++ Programming
- Artificial Intelligence Basics

---

## 4. Skills

### Programming

- Python `Intermediate`
- JavaScript `Basic`
- C / C++ `Basic`

### AI / LLM

- LLM Application `Basic - Intermediate`
- STT / TTS Pipeline `Basic - Intermediate`
- AI Agent Structure `Basic`

### Web

- HTML `Basic`
- CSS `Basic`

### Tools

- Git / GitHub `Basic`
- Docker `Basic`

---

## 5. Projects

### Evelyn Local-First Assistant Runtime

- **Period:** 2026.04 - Present
- **Tech Stack:** Python, JavaScript, Docker, STT / TTS, LLM Routing, Markdown Memory, AI Agent
- **GitHub:** <https://github.com/sands15/Evelyn_Bot>
- **Story:** [Evelyn Project Story](./evelyn-story.html)
- **Summary:** Control Page, 로컬 음성, 선택형 Discord, 로컬 모델, 장기 기억과 제한된 도구 실행을 연결한 Windows-first 개인 AI 비서 런타임
- **Role:** 대화·음성·기억·복구·승인 경계를 로컬 우선 구조로 설계하고 구현
- **Key Features:** owner-scoped Markdown memory, evidence-bound task 실행, consent·cancellation·recovery 계약, 선택형 Minecraft 자동화
- **Results:** 2026-09-03 현재 source/offline 전체 회귀 5,109 tests, 18 skipped, failures/errors 0

#### Latest Controlled Measurement

**2026-08-27 Attempt 7 · llama.cpp Gemma 4 12B IQ4_XS + OmniVoice FlashInfer 0.6.15 · GPU0**

고정된 Bot API→Main→OmniVoice first-PCM 하네스에서 graph-off/on을 각각 warm n=200으로 측정했습니다.

- **Warm answer-first-PCM p50:** 238.7ms → **201.85ms** (-36.85ms)
- **Warm answer-first-PCM p95:** 260.7ms → **219.1ms** (-41.6ms)
- **Warm answer-first-PCM p99:** 290.1ms → **239.8ms** (-50.3ms)
- **Readiness 뒤 first-admitted p95:** 515.3ms → **467.0ms** (조건별 n=30, process-cold 아님)
- **검증:** ABBA macro-block 20, paired p95 delta 95% CI [-45.7, -26.7]ms, 출력 fingerprint·문자 길이 일치 200 / 200, 오류·harness quality·안전·cache gate failure 0

#### Source Verification Snapshot

2026-09-03 현재 5,109 tests, 18 skipped, failures/errors 0입니다. 이 수치는 현재 소스와 자동화 검사의 상태이며 실제 Discord·마이크·스피커 전체 E2E나 production 완료를 뜻하지 않습니다.

### Evelyn Markdown Memory

- **Period:** 2026.06 - Present
- **Tech Stack:** Markdown, Obsidian, LLM Memory, Provenance, Deletion
- **Summary:** 명시적으로 확인된 기억을 출처와 사용자 범위에 묶어 저장하는 로컬 장기기억 기능
- **Role:** runtime memory와 developer docs vault를 분리하고 저장·회상·수정·삭제 계보를 구현
- **Key Features:** owner-scoped recall, two-stage deletion, provenance 검사, unsafe derived recall fail-closed
- **Results:** 격리 저장소에서 저장 → 새 프로세스 회상 → 삭제 → 새 프로세스 비회상 검증

### Evelyn Voice Reliability

- **Period:** 2026.05 - Present
- **Tech Stack:** Python, Qwen3-ASR, LLM Routing, OmniVoice, Playback
- **Summary:** Discord 음성과 Windows 로컬 마이크를 STT, local LLM, TTS, playback으로 연결한 음성 경로
- **Role:** 입력 소유권·동의·취소·재시작 경계와 content-free latency 계측 구현
- **Key Features:** session admission, single playback owner, barge-in, streaming TTS, cleanup gates
- **Results:** revised STT GPU1 old/new 2+20 검증 통과; private 50-item 및 실제 device/Gateway E2E는 대기

### Evelyn Minecraft Automation

- **Period:** 2026.05 - Present
- **Tech Stack:** Python, Minecraft, Mindcraft / Voyager, Mineflayer, Safety Contracts
- **Summary:** 명시적 승인과 단일 world-action lease 아래에서 동작하는 선택형 Minecraft 자동화
- **Role:** readiness·authorization·recovery·world-effect 검증 계약 구현
- **Key Features:** process-local grants, action lease, postcondition evidence, restart non-recovery
- **Results:** 격리 fresh-world shelter/restart 시나리오 통과; 운영 bot과 정상 Discord·voice E2E는 OFF/미검증

---

## 6. Experience

- **Local-First Assistant Development:** Evelyn의 대화·음성·기억·도구 실행 흐름 설계와 구현
  - Control Page, 로컬 음성, 선택형 Discord 입력을 공통 소유권 경계로 연결
  - 승인·근거·사후 검증에 묶인 task 및 agent 실행 구현
- **Voice Reliability:** 음성 대화의 지연·취소·복구 경계 계측과 검증
  - STT, LLM routing, TTS, playback 단계 분리
  - content-free trace와 고정 하네스로 성능·cleanup 근거 관리
- **Safe Agent Execution:** 외부 행동을 명시적 권한과 검증 가능한 결과에 결박
  - process-local authorization과 action lease 구현
  - Minecraft 격리 시나리오로 recovery·world-effect 확인
- **Technical Documentation:** 구현·source/offline·controlled-live·production 근거 분리
  - 프로젝트 문서와 공개 portfolio 역할 분리
  - 현재 상태와 미검증 범위를 함께 기록

---

## 7. CV / Resume

[Download PDF](./resume.pdf)

Education, Skills, Projects 요약과 앞으로의 커리어 목표를 한 페이지로 정리하는 문서입니다.

---

## 8. Career Goal / Future Plan

- **AI Service Developer:** 아이디어를 작동하는 AI 시스템으로 구현하는 개발자
- **Voice AI / Conversational AI:** STT, LLM, TTS를 연결해 자연스러운 대화 경험을 만드는 방향
- **AI Agent Engineer:** 목표 분해, planning, action execution을 다루는 AI agent 시스템
- **Long-Term Focus:** 음성, 언어 모델, 행동 실행이 자연스럽게 이어지는 로컬 AI 캐릭터 시스템

---

## 9. References

- **Evelyn Repository:** <https://github.com/sands15/Evelyn_Bot>
- **GitHub Profile:** <https://github.com/sands15>
- **Resume PDF:** [resume.pdf](./resume.pdf)

---

## 10. Contact

- **Email:** sands12@naver.com
- **GitHub:** <https://github.com/sands15>
- **Career Goal:** AI Service Developer
