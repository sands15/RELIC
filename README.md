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

### Evelyn Voice AI Assistant

- **Period:** 2026.04 - Present
- **Tech Stack:** Python, JavaScript, Discord Bot, STT / TTS, LLM Routing, AI Agent
- **GitHub:** <https://github.com/sands15/Evelyn_Bot>
- **Summary:** Discord 기반 한국어 음성 AI 캐릭터 프로젝트
- **Role:** STT, LLM, TTS, memory 흐름을 연결하고 개선
- **Key Features:** 실시간 음성 입출력, LLM routing, 캐릭터 응답, turn_trace 지연 로그
- **Results:** 음성 턴 43개로 지연 구간과 개선 기준선을 정리

#### Performance Baseline

로컬 `turn_trace` voice turn 43개 기준이며, 수치는 음성 턴 시작 시점부터의 누적 지연입니다.

- **STT 완료:** 보통 1.5s / 대부분 3.2s 이내
- **첫 음성 출력:** 보통 8.8s / 대부분 21.1s 이내
- **전체 턴:** 보통 13.4s / 대부분 23.3s 이내

### Obsidian LLM Memory

- **Period:** 2026.06 - Present
- **Tech Stack:** Obsidian, Markdown, LLM Memory, Knowledge Base
- **Summary:** LLM 기억력을 높이기 위한 Obsidian식 노트 구조 실험
- **Role:** 기억을 노트, 링크, 요약 단위로 나누는 구조 설계
- **Key Features:** 프로젝트와 작업 기록 분리, 관련 기억 링크 연결, 장기 기억과 일일 기록 분리
- **Results:** 반복 작업에서 필요한 맥락을 빠르게 찾는 방향 정리

### Voice AI Pipeline

- **Period:** 2026.05 - Present
- **Tech Stack:** Python, STT, LLM Routing, TTS, Playback, Latency Log
- **Summary:** STT, LLM routing, TTS, playback을 연결한 음성 파이프라인
- **Role:** 단계별 지연과 실패 지점을 기록하고 개선 방향 점검
- **Key Features:** 음성 입력부터 재생까지 연결, 단계별 latency log, cached audio, 문장 단위 TTS
- **Results:** 체감 지연을 나누어 보고 우선 개선 구간을 정리

### Minecraft AI Agent

- **Period:** 2026.05 - Present
- **Tech Stack:** Minecraft, Voyager, Mineflayer, Planning
- **Summary:** Minecraft 환경에서 AI agent 구조를 학습한 프로젝트
- **Role:** 상태 정보를 바탕으로 계획과 실행 흐름 정리
- **Key Features:** 목표를 행동 단위로 분해, 환경 상태 기반 판단, 실행 결과 feedback 연결
- **Results:** AI agent의 계획, 실행, 회복 구조를 실제 예시로 이해

---

## 6. Experience

- **Personal AI Bot Development:** Evelyn 음성 AI 비서의 대화 흐름 설계와 개선
  - 음성 입력, LLM 응답, TTS 출력 흐름 연결
  - 캐릭터 응답과 memory 흐름 점검
- **Voice AI Pipeline:** 음성 대화의 지연 구간 측정과 개선 방향 정리
  - STT, LLM routing, TTS, playback 단계 분리
  - `turn_trace` 기반 latency baseline 정리
- **AI Agent Structure:** 목표를 행동으로 바꾸는 agent 흐름 실험
  - planning, action, recovery 구조 학습
  - Minecraft agent 사례를 Evelyn 확장 방향과 연결
- **Technical Documentation:** 실험 결과와 개선 기준 문서화
  - README와 portfolio 문서 구조 관리
  - 성능 수치와 프로젝트 설명 정리

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
