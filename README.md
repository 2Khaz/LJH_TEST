# 반응속도 측정기

버튼을 누르면 게임이 시작되고, 화면이 파란색 → (1~12초 랜덤 대기) → 빨간색으로 바뀌는 순간 클릭해서 반응속도(ms)를 측정하는 웹앱입니다. 빨간색으로 바뀌기 전에 클릭하면 실패 처리되고, 성공하면 닉네임을 입력해 Firebase Firestore에 기록을 저장하고 최고 기록 랭킹을 확인할 수 있습니다.

## 로컬 실행

```bash
npm install
npm run dev
```

Firebase 설정값이 없어도 개발 서버는 실행되지만, 기록 저장/랭킹 조회는 실패합니다. 아래 안내대로 Firebase 프로젝트를 만들고 `.env` 파일을 채워주세요.

## Firebase 설정 방법

1. [Firebase 콘솔](https://console.firebase.google.com/)에 접속해 새 프로젝트를 생성합니다.
2. 왼쪽 메뉴에서 **Firestore Database** → **데이터베이스 만들기**를 눌러 Firestore를 활성화합니다. (위치는 아무 곳이나 선택 가능, 프로덕션 모드로 시작)
3. Firestore의 **규칙(Rules)** 탭에서 이 저장소의 `firestore.rules` 파일 내용을 그대로 붙여넣고 게시합니다. (읽기는 누구나 가능, 쓰기는 `ms`/`nickname` 형식이 맞을 때만 허용하는 규칙입니다)
4. 프로젝트 설정(⚙️ 아이콘) → **일반** 탭 → **내 앱**에서 **웹 앱 추가**(`</>` 아이콘)를 눌러 웹 앱을 등록합니다.
5. 등록 후 나오는 `firebaseConfig` 값을 복사합니다. 예시:

   ```js
   const firebaseConfig = {
     apiKey: "AIza...",
     authDomain: "xxx.firebaseapp.com",
     projectId: "xxx",
     storageBucket: "xxx.appspot.com",
     messagingSenderId: "...",
     appId: "1:...:web:...",
   };
   ```

6. 저장소 루트에 `.env` 파일을 만들고(`.env.example` 참고), 위 값을 각각 채웁니다.

   ```bash
   cp .env.example .env
   ```

   ```
   VITE_FIREBASE_API_KEY=AIza...
   VITE_FIREBASE_AUTH_DOMAIN=xxx.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=xxx
   VITE_FIREBASE_STORAGE_BUCKET=xxx.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=...
   VITE_FIREBASE_APP_ID=1:...:web:...
   ```

   Firebase 웹 설정값(apiKey 등)은 비밀키가 아니라 클라이언트에 공개되는 식별자이므로 코드/빌드에 포함되어도 안전합니다. 실제 접근 제어는 3번의 Firestore 규칙이 담당합니다.

## GitHub Pages 배포

이 저장소는 `main` 브랜치에 푸시되면 `.github/workflows/deploy.yml` 워크플로우가 자동으로 빌드 후 GitHub Pages에 배포합니다.

1. 저장소 **Settings → Pages**에서 Source를 **GitHub Actions**로 설정합니다. (최초 1회)
2. 저장소 **Settings → Secrets and variables → Actions**에서 위 6번의 `.env` 값들을 동일한 이름의 Repository secret으로 각각 등록합니다.
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
3. `main` 브랜치에 푸시하면 자동 배포되며, 완료 후 `https://2khaz.github.io/LJH_TEST/` 에서 접속할 수 있습니다.

## 구조

- `index.html` / `src/style.css` — 상태별(대기/파랑/빨강/결과/실패) 화면 마크업과 스타일
- `src/main.js` — 게임 상태 전이 로직 (시작 → 랜덤 대기 → 빨간색 전환 → 클릭 판정)
- `src/scores.js` — Firestore 연동, `saveScore(ms, nickname)`와 `getTop(n)` 두 함수로 저장/조회 기능 분리
- `firestore.rules` — Firestore 보안 규칙 (읽기 공개, 쓰기는 형식 검증 통과 시에만 허용)
- `.github/workflows/deploy.yml` — GitHub Pages 자동 배포 워크플로우
