# RELIC

RELIC은 제가 공부하고 실험하며 쌓아가는 성장 기록 저장소입니다.
AI, 개발, 프로젝트 경험을 정리하고 앞으로의 학습 방향을 점검하기 위한 포트폴리오형 문서입니다.

---

## 1. 자기소개 / About Me

인공지능공학을 중심으로 음성 AI, 자연어 처리, AI Agent, 데이터 분석에 관심을 두고 공부하고 있습니다.
최근에는 단순한 예제 구현보다 실제로 사용할 수 있는 AI 서비스 구조를 만드는 데 집중하고 있으며,
STT, LLM, TTS, turn routing, agent planning처럼 여러 기술이 함께 동작하는 시스템을 직접 실험하고 있습니다.

- **전공:** 인공지능공학
- **관심 분야:** Voice AI, Natural Language Processing, AI Agent, Data Analysis, LLM Application
- **진로 목표:** 실제 사용자가 쓸 수 있는 AI 서비스를 만드는 개발자 또는 연구자
- **현재 학습 중인 기술:** Python, JavaScript, Git/GitHub, STT/TTS Pipeline, LLM Routing, Markdown Documentation
- **AI 분야에서의 관심 주제:** 대화형 AI, 캐릭터형 AI, 음성 인터페이스, autonomous agent, planning system

---

## 2. Education

- **School:** 입력 예정
- **Department:** 입력 예정
- **Year:** 입력 예정
- **Period:** 입력 예정
- **Relevant Coursework:** 입력 예정
- **GPA / Academic Score:** Optional

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

---

## 4. Projects

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
- **Results:**
  - 실제 음성 대화 흐름을 구성하고 지속적으로 개선 중
  - 반복 호출 응답의 TTS 생성 비용을 줄이기 위한 파일 재생 방식 도입
  - 대화 품질을 감으로만 판단하지 않고 측정 가능한 구조로 정리
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
- **Results:**
  - 현재 실사용 TTS는 안정화된 상태로 유지
  - 문제가 생기면 그때 개선하는 방식으로 범위를 정리
  - 빠른 응답이 필요한 고정 문장에는 cached audio 방식이 적합하다는 결론 도출
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
- **Results:**
  - Minecraft 환경에서 생성된 행동 실행과 inventory 변화 확인
  - 단순 연결 문제보다 completion/result propagation과 loop bookkeeping이 주요 개선 지점임을 파악
  - 장기적으로는 현재 Voyager보다 더 구조화된 agent architecture를 목표로 설정
- **GitHub:** <https://github.com/sands15/Evelyn_Bot>
- **Demo / Image:** 추가 예정

### RELIC Growth Log

- **Summary:** 학습 과정, 프로젝트 진행 상황, 기술 성장 기록을 정리하는 저장소
- **Period:** 2026.05 - Present
- **Tech Stack:** Markdown, Git, GitHub
- **Role:** 개인 기록 관리, 포트폴리오 정리, 성장 과정 문서화
- **Key Features:**
  - 자기소개, 교육, 기술, 프로젝트, 경험, 진로 목표를 한 문서에서 관리
  - 프로젝트 결과뿐 아니라 시행착오와 다음 학습 방향도 함께 기록
  - 공개 가능한 정보와 개인정보를 분리해 관리
- **Results:**
  - GitHub에서 확인 가능한 성장 기록 문서 구조 작성
  - 앞으로 프로젝트가 늘어날 때 계속 확장 가능한 기본 포맷 마련
- **GitHub:** <https://github.com/sands15/RELIC>
- **Demo / Image:** GitHub README

---

## 5. Experience

- **Personal AI Bot Development:** Evelyn 음성 AI 비서 개발 및 대화 흐름 개선
- **Voice AI Pipeline Experiment:** STT, LLM routing, TTS, playback latency를 연결한 음성 AI 파이프라인 실험
- **Minecraft AI Agent Experiment:** Minecraft 환경에서 planning, action execution, recovery 흐름 실험
- **Technical Documentation:** 프로젝트 구조, 실험 결과, 개선 방향을 README와 문서로 정리
- **Growth Log Management:** RELIC 저장소를 통해 학습 과정과 프로젝트 경험을 지속적으로 기록
- **Team / Club / Competition:** 입력 예정

---

## 6. CV / Resume

[Download My Resume](./resume.pdf)

> PDF에는 주민등록번호, 집 주소, 개인 전화번호 등 민감한 개인정보를 포함하지 않도록 주의합니다.

---

## 7. Contact

- **Email:** 입력 예정
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
