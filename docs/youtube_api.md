# YouTube Data API 명세서

YouTube Data API는 동영상 콘텐츠, 채널 정보, 댓글 등 YouTube의 다양한 기능을 애플리케이션에 통합할 수 있는 강력한 API입니다. 이 문서는 동영상 업로드 및 스케줄링, 댓글 관리와 같은 핵심 기능에 초점을 맞춰 요약합니다.

## 1. 개요 및 주요 개념

YouTube Data API v3는 `videos`, `commentThreads`, `comments` 등 다양한 리소스를 제공하며, `https://www.googleapis.com/youtube/v3` 엔드포인트를 사용합니다.

- **인증:** 비디오 업로드, 댓글 작성과 같이 사용자 계정의 개인 정보에 접근하는 작업은 OAuth 2.0 토큰이 필수적입니다. 공개적으로 접근 가능한 동영상 검색과 같은 작업은 API 키만으로도 충분합니다.

## 2. 구현된 CRUD 명세

### 2.1. 동영상 목록 조회 (`search.list`)

인증된 사용자의 채널에 있는 동영상 목록을 조회합니다. `videos.list`가 아닌 `search.list` 메서드를 사용하며, `forMine=true` 및 `type=video` 필터를 사용합니다.

### 2.2. 동영상 업로드 (`videos.insert`)

비디오 파일을 업로드하고, 제목, 설명, 태그와 같은 메타데이터를 설정하는 핵심 메서드입니다. 비디오 스케줄링 기능도 지원합니다.

### 2.3. 동영상 업데이트 (`videos.update`)

비디오 파일 자체를 수정할 수는 없지만, `videos.update` 메서드로 비디오의 메타데이터(제목, 설명, 태그)를 수정할 수 있습니다.

### 2.4. 동영상 삭제 (`videos.delete`)

특정 비디오를 삭제합니다.

## 3. Node.js 구현 예시 (엔드포인트)

- `POST /api/youtube/upload`: 동영상 업로드
- `GET /api/youtube/videos`: 내 동영상 목록 조회
- `PUT /api/youtube/videos/:videoId`: 동영상 메타데이터 수정
- `DELETE /api/youtube/videos/:videoId`: 동영상 삭제

## 4. 할당량 관리 및 오류 처리

YouTube Data API는 기본적으로 10,000 단위/일의 할당량을 제공합니다. 대규모 애플리케이션의 경우 추가 할당량을 요청해야 합니다.

- **호출 빈도 제어 (Rate Limiting):** 과도한 API 호출로 인한 할당량 초과(429 Too Many Requests)를 방지하기 위해 간단한 인메모리 호출 빈도 제어 로직이 구현되어 있습니다.
- **오류 처리:** 403 `rateLimitExceeded`, 429 `Too Many Requests`와 같은 할당량 관련 오류나 5xx 서버 오류가 발생했을 때는 지수 백오프(Exponential Backoff)를 사용한 재시도 로직을 구현하는 것이 모범 사례입니다.
