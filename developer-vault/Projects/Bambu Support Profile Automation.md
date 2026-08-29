---
type: project-hub
status: completed
visibility: public
project: Bambu Support Profile Automation
last_reviewed: 2026-08-29
tags:
  - dev/project
  - project/bambu-support-profile
---

# Bambu Support Profile Automation

> Bambu Studio의 support preset을 3MF에 안전하게 적용하는 Windows 자동화의 개인 개발 이력이다. 모델이나 개인 preset 데이터의 저장소가 아니다.

## 프로젝트 원본

- 로컬 Codex 프로젝트의 `outputs/Apply-BambuSupport.ps1`
- 설치 launcher: `outputs/Install-BambuSupport.cmd`

## 대표 이정표

- 2026-08-11 — 원본 보존·atomic output·stable-download watcher와 SendTo/시작 프로그램 설치 흐름을 구현했다. [[Daily/2026-08-11|기록]]

## 다음 체크포인트

- 다시 배포할 때는 익명 fixture를 별도로 만들고 여러 Bambu Studio 버전의 3MF metadata schema를 회귀 테스트한다.

