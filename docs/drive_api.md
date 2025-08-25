# Google Drive API 명세서

Google Drive API는 Google Workspace의 모든 파일에 대한 저장소 및 관리 계층 역할을 합니다. 이 문서는 Drive API를 사용해 파일과 폴더의 생성, 조회, 업데이트, 삭제와 같은 라이프사이클을 관리하는 방법을 요약합니다.

## 1. 개요 및 주요 개념

Drive API v3는 `https://www.googleapis.com/drive/v3` 엔드포인트를 기반으로 파일(File), 권한(Permission), 리비전(Revision) 등의 리소스를 제공하는 RESTful API입니다.

- `files.create`, `files.list`, `files.update`, `files.delete`와 같은 직관적인 메서드를 통해 파일과 폴더를 다룰 수 있습니다.
- Drive API는 Docs 및 Sheets API와 논리적으로 분리되어 있지만, 기능 구현 시 서로 긴밀하게 연관되어 있습니다. 예를 들어, Docs API는 문서의 내용을 수정하는 데 사용되지만, 문서 자체를 삭제하는 기능은 Drive API의 `files.delete` 메서드를 통해 수행해야 합니다.

## 2. 구현된 CRUD 명세

### 2.1. 파일/폴더 생성 (`files.create`)

새 파일 또는 폴더를 생성하는 데 사용됩니다.
- **폴더 생성:** `requestBody`의 `mimeType` 필드를 `application/vnd.google-apps.folder`로 설정합니다.
- **파일 업로드:** 파일 크기에 따라 Simple Upload, Multipart Upload, Resumable Upload 방식을 선택할 수 있습니다. 본 프로젝트에서는 `multer`를 활용한 Multipart Upload 방식을 사용합니다.

### 2.2. 파일/폴더 조회 및 목록 검색 (`files.list`, `files.get`)

드라이브 내의 파일 및 폴더 목록을 검색하거나 특정 파일의 메타데이터/콘텐츠를 가져옵니다.
- `files.list`: `q` 매개변수를 사용하여 복잡한 검색 쿼리를 지정할 수 있습니다.
- `files.get`: 특정 파일 ID를 사용하여 메타데이터를 가져오며, `alt=media` 쿼리 매개변수를 추가하여 파일의 실제 콘텐츠를 다운로드할 수 있습니다.

### 2.3. 파일/폴더 업데이트 (`files.update`)

파일의 메타데이터(예: 파일명, 부모 폴더)를 수정하는 데 사용됩니다. 파일을 삭제하지 않고 휴지통으로 이동시키려면 `requestBody`에 `trashed: true`를 포함합니다.

### 2.4. 파일/폴더 삭제 (`files.delete`)

특정 파일 ID를 지정하여 파일을 영구적으로 삭제합니다. 이 작업은 되돌릴 수 없으므로 신중하게 사용해야 합니다.

## 3. Node.js 구현 예시 (엔드포인트)

- `POST /api/drive/upload`: 파일 업로드
- `GET /api/drive/files`: 파일 및 폴더 목록 조회
- `GET /api/drive/files/:fileId/download`: 파일 다운로드
- `DELETE /api/drive/files/:fileId`: 파일 영구 삭제
