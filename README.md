# GCP/Node.js 기반 Google Workspace 및 YouTube 연동 프로젝트

이 프로젝트는 Google Cloud Platform(GCP)과 Node.js를 활용하여 Google Docs, Sheets, Drive, YouTube의 핵심 기능을 연동하는 백엔드 애플리케이션입니다. 각 Google API의 CRUD(생성, 읽기, 업데이트, 삭제) 작업을 구현하고, Node.js 환경에서 Google API 연동 및 인증 전략을 수립하는 데 중점을 둡니다.

## 주요 기능

- **Google Drive API:** 파일 및 폴더 생성, 조회, 다운로드, 삭제
- **Google Sheets API:** 스프레드시트 생성, 셀 데이터 읽기, 추가, 수정, 지우기
- **Google Docs API:** 문서 생성, 내용 조회, 일괄 업데이트 (텍스트 삽입, 스타일 변경 등)
- **YouTube Data API:** 동영상 목록 조회, 업로드, 메타데이터 수정, 삭제 (구현되었으나 검증 시 동영상 미발견)

## 기술 스택

- **백엔드:** Node.js (Express.js)
- **Google API 클라이언트:** `googleapis` (공식 Node.js 클라이언트 라이브러리)
- **인증:** OAuth 2.0 (동적 스코프 요청 지원)
- **파일/동영상 업로드:** `multer`

## GCP 및 API 버전 정보

이 프로젝트는 2025년 8월 25일 기준으로 Google Cloud Platform에서 제공되는 최신 Google API 버전을 기반으로 구현되었습니다.

- **Google Drive API:** v3
- **Google Sheets API:** v4
- **Google Docs API:** v1
- **YouTube Data API:** v3

## 설정 및 실행

1.  **GCP 프로젝트 설정:**
    *   Google Cloud Console에서 새 프로젝트를 생성하고, 필요한 API (Drive, Sheets, Docs, YouTube Data API v3)를 활성화합니다.
    *   OAuth 2.0 클라이언트 ID (웹 애플리케이션 유형)를 생성하고, `http://localhost:3000/auth/google/callback`을 승인된 리디렉션 URI로 등록합니다.

2.  **환경 변수 설정:**
    *   프로젝트 루트에 `.env` 파일을 생성하고 다음 정보를 입력합니다:
        ```
        GOOGLE_CLIENT_ID=YOUR_CLIENT_ID
        GOOGLE_CLIENT_SECRET=YOUR_CLIENT_SECRET
        GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback
        ```

3.  **의존성 설치:**
    ```bash
    npm install
    ```

4.  **서버 실행:**
    ```bash
    npm run dev
    ```

5.  **인증:**
    *   브라우저에서 `http://localhost:3000/auth/google?scopes=drive,sheets,documents,youtube` (필요한 스코프를 콤마로 구분하여 추가)로 이동하여 Google 계정으로 로그인하고 권한을 부여합니다.
    *   이후 `curl` 또는 프론트엔드 애플리케이션을 통해 API를 호출할 수 있습니다.

## API 명세서

각 API의 상세 명세 및 사용 예시는 `docs/` 폴더에서 확인할 수 있습니다.