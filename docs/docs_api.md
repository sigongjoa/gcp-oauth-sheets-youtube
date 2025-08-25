# Google Docs API 명세서

Google Docs API는 문서의 구조화된 콘텐츠를 프로그램적으로 생성하고 수정하는 데 특화된 API입니다. 이 문서는 Docs API의 독특한 문서 모델과 구현된 CRUD 작업을 요약합니다.

## 1. 개요 및 주요 개념

Docs API v1은 `https://docs.googleapis.com` 엔드포인트를 사용합니다. 문서의 모든 요소는 JSON 객체로 표현되며, 문서 ID(Document ID), 바디(Body), 섹션(Segment), 인덱스(Index)라는 핵심 개념을 중심으로 이루어져 있습니다. 특히 `startIndex`와 `endIndex`는 문서 내 특정 위치를 참조하는 데 사용됩니다.

## 2. 구현된 CRUD 명세

### 2.1. 문서 생성 (`documents.create`)

제목이 지정된 새로운 빈 문서를 생성하는 데 사용됩니다.

### 2.2. 문서 내용 조회 (`documents.get`)

특정 문서의 최신 버전을 JSON 형태로 가져옵니다. 이 JSON 응답을 분석하여 문서의 구조와 내용을 파악할 수 있습니다.

### 2.3. 문서 내용 업데이트 (`documents.batchUpdate`)

Docs API의 핵심 메서드입니다. 텍스트 삽입, 서식 변경, 테이블 추가 등 다양한 변경 사항을 하나의 `Request` 객체 배열로 묶어 문서에 일괄 적용합니다. 이 방식의 가장 큰 장점은 원자성(Atomicity)입니다. 즉, 배열 내의 요청 중 하나라도 실패하면 모든 변경 사항이 롤백되어 문서의 일관성이 유지됩니다.

### 2.4. 문서 삭제

Docs API 자체에는 문서 삭제 기능이 없습니다. Docs 문서는 Google Drive에 저장되는 파일의 한 종류이므로, Drive API의 `files.delete` 또는 `files.update`를 사용해 삭제해야 합니다.

## 3. Node.js 구현 예시 (엔드포인트)

- `POST /api/docs`: 새 문서 생성
- `GET /api/docs/:documentId`: 특정 문서의 최신 버전 조회
- `POST /api/docs/:documentId/batchUpdate`: 문서에 하나 이상의 업데이트 적용

## 4. 헬퍼 함수

`documents.batchUpdate`의 복잡성을 관리하기 위해 `src/services/docs/docHelpers.js`에 헬퍼 함수를 구현했습니다.

- `createTextInsertRequest(text, locationIndex)`: 특정 위치에 텍스트를 삽입하는 요청 객체 생성
- `createUpdateTextStyleRequest(startIndex, endIndex, textStyle)`: 특정 범위의 텍스트 스타일을 변경하는 요청 객체 생성
