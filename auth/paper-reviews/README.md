# RELIC 작성·GitHub 로그인 연결

공개 목록과 글은 기존 GitHub Pages에서 읽고, 작성 화면과 인증 API만 Cloudflare Workers에서 제공한다. `sands15` 계정과 RELIC 저장소의 소유자 ID를 서버에서 확인한다. 로그인 쿠키는 암호화된 HttpOnly·Secure·SameSite=Lax이며 최대 8시간 유지한다. 토큰/비밀키/쿠키 원문은 화면, 초안, 브라우저 저장 공간이나 기록에 넣지 않는다. 로그인 만료와 다른 탭의 세션 변경에서는 입력을 유지하며 다시 연결한다. 로그아웃은 현재 브라우저 쿠키를 지우며 다른 기기의 로그인이나 GitHub 앱 자체 권한을 취소하는 기능은 아니다.

## 최초 연결 순서

작성·인증 서버는 `https://relic-paper-writer.sands12.workers.dev`에 배포했다. GitHub 앱은 RELIC 한 개에 설치했고 서버 비밀키 설정, 실제 소유자 로그인·새로고침 유지·로그아웃을 확인했다. 공개 작성 연결 주소를 설정했으며 최종 Pages 반영 근거는 `docs/paper-reviews-plan.md`에 둔다. 이미 설정한 브라우저는 아래 최초 연결을 반복할 필요가 없다. 새 환경의 초기 설정은 아래 순서를 따른다.

1. [Cloudflare 계정](https://dash.cloudflare.com/sign-up)을 만들고 Workers **Free** 요금제를 사용한다. 별도 도메인이나 유료 요금제를 선택하지 않는다.
2. 저장소 루트에서 `node tools/build-paper-auth.mjs`로 공개 작성 파일과 서버 번들을 만든다. 공식 Workers 배포 도구에서 `auth/paper-reviews/wrangler.jsonc`를 사용한다. 빌드는 Node 표준 기능만 사용하며 설치나 배포를 수행하지 않는다. 실제 배포 도구가 없으면 공식 Wrangler 이용 범위를 먼저 확인한다.
3. 발급된 Workers의 정확한 HTTPS 주소로 [GitHub App](https://github.com/settings/apps/new)을 등록한다. Homepage은 작성 주소, Callback URL은 `<작성 주소>/auth/callback`, Webhook은 비활성화, Repository Contents는 **Read and write**, 나머지 선택 권한은 추가하지 않는다. 사용자 토큰 만료 기본값을 유지한다. 개인 계정에만 설치할 앱으로 제한하고 설치 저장소는 **RELIC 한 개**를 선택한다. 권한 부여는 사용자가 GitHub 화면에서 직접 확인한다.
4. Cloudflare 변수에 `PUBLIC_ORIGIN`(마지막 `/` 없는 HTTPS origin)과 `GH_CLIENT_ID`를 설정한다. **Secrets**에 `GH_CLIENT_SECRET`와 임의의 32바이트를 64자리 16진수로 만든 `SESSION_KEY`를 설정한다. 값을 대화/공개 파일/명령 인수/로그로 전달하지 않는다. 생산 설정에 `LOCAL_PREVIEW`를 넣지 않는다. 키를 교체하면 기존 로그인이 만료된다.
5. 서버 ready와 실제 로그인을 확인한 뒤 `paper-review-auth.json`의 `writerOrigin`을 Workers origin으로 채운다. 이 공개 파일에는 주소만 넣으며 비밀정보는 넣지 않는다. 빈 값 `""`는 미연결 상태다. 설정 전에도 기존 작성 주소의 접힌 ‘기존 토큰으로 연결’ 경로는 유지된다. Workers 작성 화면에는 토큰 입력칸이 없다.
6. 선택한 최종 소스를 반영하고 실제 GitHub 로그인, 재방문, 다른 계정 차단, 카테고리/글 저장과 GitHub 원본, Pages 목록·상세 내용을 확인한다. 확인용 공개 글이 필요하면 별도로 선택한다. GitHub 저장과 Pages 배포 완료는 구분한다.

## 기존 초안

RELIC의 작성 화면에서 로그인 버튼을 누르면 새 작성 창을 열고, 원래 주소의 초안을 **같은 브라우저의 새 작성 주소 저장 공간**으로 복사한다. 초안은 서버나 GitHub에 보내지 않는다. origin·창·일회 nonce를 확인하며 기존 초안은 덮어쓰거나 삭제하지 않는다. 한 번에 최대 100개·합계 8MB를 전달하며 손상/큰 파일/저장 거부는 원래 주소의 내용을 보존한다. 창을 차단한 브라우저는 새 창 허용 후 재시도하거나 기존 초안 파일 백업을 이용한다. 실제 운영 브라우저의 창 연결은 운영 주소에서 추가 확인해야 한다.

## 확인 범위

합성 OAuth와 GitHub 응답은 실제 계정/권한/Workers 실행의 증거가 아니다. 무료 플랜의 CPU·요청 제한에서 실제 허용된 크기의 리뷰가 동작하는지 배포 후 확인한다. 기존 공개 페이지 전체를 Workers로 옮기거나 데이터베이스·토큰 자동 갱신·초안 클라우드 저장을 추가하지 않는다. API는 RELIC `main`의 리뷰 JSON/카테고리 파일에만 쓰며 삭제, 임의 경로, 자동 충돌 덮어쓰기를 제공하지 않는다. 운영 상태와 검증 원본은 `docs/paper-reviews-plan.md`다.

공식 자료: [GitHub 로그인](https://docs.github.com/en/apps/creating-github-apps/writing-code-for-a-github-app/building-a-login-with-github-button-with-a-github-app), [Workers 요금](https://developers.cloudflare.com/workers/platform/pricing/), [비밀정보](https://developers.cloudflare.com/workers/configuration/secrets/), [Workers HTML 주소 처리](https://developers.cloudflare.com/workers/static-assets/routing/advanced/html-handling/).
