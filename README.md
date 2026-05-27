# RELIC

**손정훈**

RELIC은 결과만 모아두는 포트폴리오가 아니라, 제가 AI와 개발을 공부하면서 무엇을 만들었고, 어디서 막혔고, 다음에 무엇을 배울지 기록하는 성장일기입니다.

지금은 음성 AI, LLM application, AI agent를 중심으로 공부하고 있습니다. 빠르게 답하는 프로그램보다 사용자가 실제로 쓰고 싶어지는 AI를 만드는 데 관심이 있고, 음성 입력, 언어 모델, 음성 출력, 행동 실행이 하나의 흐름으로 이어지는 시스템을 직접 실험하고 있습니다.

---

## 1. 자기소개 / About Me

- **전공:** 인공지능공학
- **관심 분야:** Voice AI, Natural Language Processing, AI Agent, Data Analysis, LLM Application
- **진로 목표:** 실제 사용자가 쓸 수 있는 AI 서비스를 만드는 개발자
- **현재 학습 중인 기술:** Python, JavaScript, Git/GitHub, STT/TTS Pipeline, LLM Routing, Markdown Documentation
- **AI 분야에서의 관심 주제:** 대화형 AI, 캐릭터형 AI, 음성 인터페이스, autonomous agent, planning system

제가 지금 가장 흥미롭게 보는 방향은 "사람과 자연스럽게 상호작용하는 AI"입니다. 단순히 모델을 호출하는 데서 끝나는 것이 아니라, 입력을 이해하고, 필요한 경로를 고르고, 실제 행동이나 음성 출력까지 이어지는 전체 구조를 만들어보고 있습니다.

---

## 2. Education

- **School:** 조선대학교
- **Department:** 인공지능공학과
- **Year:** 2학년 재학중
- **Period:** 추후 업데이트
- **Relevant Coursework:** Machine Learning, Deep Learning, Data Structures, Web Programming, Database, Software Engineering

---

## 3. Skills

### Skill Categories

- **Programming:** Python, JavaScript, C/C++ Basic
- **AI / ML:** PyTorch Basic, scikit-learn Basic, LLM Application, STT/TTS Pipeline
- **Web:** HTML, CSS, JavaScript, React Basic
- **Tools:** Git, GitHub, VS Code, Docker Basic, Markdown
- **Database:** SQLite Basic, MySQL Basic

### Proficiency

- **Python:** Intermediate
- **JavaScript:** Basic to Intermediate
- **PyTorch:** Basic
- **Git / GitHub:** Basic to Intermediate
- **React:** Basic
- **Markdown Documentation:** Intermediate
- **LLM Application:** Basic to Intermediate
- **STT/TTS Pipeline:** Basic to Intermediate

### Currently Improving

- 음성 AI pipeline을 더 안정적으로 구성하는 방법
- LLM을 모든 문제에 직접 쓰지 않고, router와 rule-based path를 함께 설계하는 방법
- AI agent가 목표를 이해하고 행동을 실행하는 구조
- 실험 결과를 다음 개선으로 연결하기 위한 문서화 습관

---

## 4. Projects

### RELIC Growth Log

- **Summary:** 학습 과정, 프로젝트 진행 상황, 기술 성장 기록을 정리하는 저장소
- **Period:** 2026.05 - Present
- **Tech Stack:** Markdown, Git, GitHub
- **Role:** 개인 기록 관리, 포트폴리오 정리, 성장 과정 문서화
- **Key Features:**
  - 프로젝트 결과뿐 아니라 배운 점, 막힌 점, 다음 목표를 함께 기록
  - 공개 가능한 정보와 개인정보를 분리해서 관리
  - 시간이 지나도 성장 흐름을 다시 확인할 수 있도록 GitHub에 정리
- **Learned:**
  - 프로젝트는 결과물만큼 과정 기록이 중요하다는 점
  - README는 단순 설명서가 아니라 내 학습 방향을 보여주는 문서가 될 수 있다는 점
- **Next Goal:**
  - 프로젝트별 회고를 더 꾸준히 남기기
  - resume.pdf와 README의 내용이 서로 자연스럽게 이어지도록 정리하기
- **GitHub:** <https://github.com/sands15/RELIC>
- **Demo / Image:** GitHub README

### Evelyn Voice AI Assistant

- **Summary:** 한국어 음성 대화를 목표로 하는 개인 AI 캐릭터형 비서 프로젝트
- **Period:** 2026.04 - Present
- **Tech Stack:** Python, JavaScript, Discord Bot, STT, LLM, TTS, Git
- **Role:** 개인 개발, 구조 설계, 음성 파이프라인 구현, 실사용 테스트
- **Key Features:**
  - 음성 입력을 STT로 변환한 뒤 대화 의도에 맞게 처리
  - 짧은 호출, 상태 응답, 일반 대화, 명령형 요청을 구분하는 turn routing 구조
  - 호출처럼 고정적으로 반복되는 응답은 cached audio fast path로 처리
  - LLM 응답, TTS 첫 PCM, 재생 시작 시점 등을 분리해 측정하는 대화 품질 로그
  - 단순히 빠른 비서가 아니라 자연스럽게 같이 있는 캐릭터형 UX를 목표로 설계
- **Learned:**
  - 대화형 AI는 모델 성능만이 아니라 latency, 말투, 반복 응답, TTS 품질이 함께 맞아야 자연스럽다는 점
  - 모든 입력을 main LLM으로 보내는 구조보다 turn type을 나누는 구조가 더 실용적이라는 점
- **Current Challenge:**
  - 빠른 응답과 자연스러운 캐릭터성을 동시에 유지하는 것
  - STT, router, LLM, TTS, playback 사이의 병목을 정확히 측정하는 것
- **Next Goal:**
  - 실사용 로그를 기준으로 어색한 응답 패턴 줄이기
  - 가벼운 요청은 fast path로 처리하고, 깊은 대화만 main LLM으로 보내는 구조 고도화
- **GitHub:** <https://github.com/sands15/Evelyn_Bot>
- **Demo / Image:** 추가 예정

### OmniVoice TTS Stability & Latency Study

- **Summary:** Evelyn의 음성 응답 품질과 체감 속도를 개선하기 위한 TTS 실험
- **Period:** 2026.05
- **Tech Stack:** Python, WAV Audio, OmniVoice, CUDA, Local Inference
- **Role:** 실험 설계, 청취 평가, latency 측정, 적용 방향 정리
- **Key Features:**
  - clone voice conditioning을 매 요청마다 반복하지 않고 재사용하는 방향 검토
  - 첫 오디오가 준비되는 시점과 실제 재생 시작 시점을 분리해 측정
  - 호출 응답처럼 고정 문장은 미리 생성한 wav 파일을 재생하는 방식 적용
  - 스트리밍 품질 문제는 무리하게 수정하지 않고 실사용 안정성을 우선 유지
- **Learned:**
  - TTS는 단순 생성 속도보다 실제로 들었을 때 자연스러운지가 더 중요하다는 점
  - 빠른 첫 오디오와 전체 음성 품질 사이에는 trade-off가 있다는 점
  - 이미 안정적인 부분은 계속 건드리기보다, 실사용에서 문제가 생길 때 개선하는 편이 낫다는 점
- **Current Challenge:**
  - 스트리밍/청크 방식은 seam이나 볼륨 변화가 생기면 체감 품질이 크게 떨어진다는 점
- **Next Goal:**
  - 지금 안정화된 TTS는 유지
  - 고정 응답은 cached audio로 처리해 latency를 줄이기
- **GitHub:** <https://github.com/sands15/Evelyn_Bot>
- **Demo / Image:** 추가 예정

### Minecraft AI Agent Experiment

- **Summary:** Minecraft 환경에서 목표를 이해하고 행동을 수행하는 AI agent 구조 실험
- **Period:** 2026.05 - Present
- **Tech Stack:** Python, Node.js, Mineflayer, Voyager-style Agent, LLM, Minecraft
- **Role:** 시스템 통합, 행동 실행 흐름 점검, planning 구조 설계
- **Key Features:**
  - inventory 상태를 먼저 확인하고 필요한 행동을 결정하는 planning 방향
  - recipe graph와 skill graph를 활용한 목표 분해 구조 설계
  - LLM은 모든 행동을 직접 결정하는 엔진이 아니라 fallback 또는 탐색 보조로 활용
  - 실행 결과와 실패 원인을 기록해 다음 개선 지점으로 연결
- **Learned:**
  - agent는 단순히 명령을 생성하는 것보다 현재 상태를 정확히 해석하는 것이 중요하다는 점
  - inventory, recipe, action result 같은 구조화된 정보가 있어야 안정적인 행동 계획이 가능하다는 점
- **Current Challenge:**
  - 행동이 실제로 성공했는지 completion/result propagation을 안정적으로 추적하는 것
  - critic loop와 recovery flow가 같은 실패를 반복하지 않도록 정리하는 것
- **Next Goal:**
  - inventory-first deterministic planning 강화
  - skill graph와 recipe graph를 기반으로 더 구조화된 agent architecture 설계
- **GitHub:** <https://github.com/sands15/Evelyn_Bot>
- **Demo / Image:** 추가 예정

---

## 5. Experience

- **Personal AI Bot Development:** Evelyn 음성 AI 비서 개발 및 대화 흐름 개선
- **Voice AI Pipeline Experiment:** STT, LLM routing, TTS, playback latency를 연결한 음성 AI 파이프라인 실험
- **Minecraft AI Agent Experiment:** Minecraft 환경에서 planning, action execution, recovery 흐름 실험
- **Technical Documentation:** 프로젝트 구조, 실험 결과, 개선 방향을 README와 문서로 정리
- **Growth Log Management:** RELIC 저장소를 통해 학습 과정과 프로젝트 경험을 지속적으로 기록
- **Team / Club / Competition:** 추후 업데이트

이 섹션은 앞으로 실제 활동이 늘어날 때 계속 업데이트할 예정입니다. 지금은 개인 프로젝트와 실험 기록을 중심으로 정리하고 있습니다.

---

## 6. CV / Resume

[Download My Resume](./resume.pdf)

> PDF에는 주민등록번호, 집 주소, 개인 전화번호 등 민감한 개인정보를 포함하지 않도록 주의합니다.
> resume.pdf는 이름, 이메일, GitHub, Education, Skills, Projects 요약, Experience, Career Goal 중심의 1페이지 문서로 정리할 예정입니다.

---

## 7. Contact

- **Email:** sands12@naver.com
- **GitHub:** <https://github.com/sands15>
- **LinkedIn:** Optional
- **Blog / Notion:** Optional

---

## 8. Career Goal / Future Plan

- **AI Service Developer:** 사용자가 실제로 쓸 수 있는 AI 서비스를 설계하고 구현하는 개발자
- **Voice AI / Conversational AI Developer:** STT, LLM, TTS를 연결해 자연스러운 대화 경험을 만드는 개발자
- **AI Agent Engineer:** 목표 분해, planning, action execution을 다루는 AI agent 시스템 개발자
- **Data & Model Application Track:** 데이터 분석과 모델 활용 능력을 함께 키우는 실용형 AI 개발자
- **Research-Oriented Growth:** 장기적으로는 AI agent, multimodal interaction, voice interface 분야를 더 깊게 연구

단기 목표는 지금 진행 중인 프로젝트들을 완성도 있게 정리하는 것입니다. 장기적으로는 음성, 언어 모델, 행동 실행이 자연스럽게 이어지는 AI agent 시스템을 만들 수 있는 개발자로 성장하고 싶습니다.
