# Google Sheets API 명세서

Google Sheets API는 스프레드시트의 셀 데이터를 효율적으로 읽고 쓰는 데 최적화되어 있습니다. 이 문서는 Sheets API의 핵심 개념과 구현된 CRUD 작업을 요약합니다.

## 1. 개요 및 주요 개념

Sheets API v4는 스프레드시트 ID(Spreadsheet ID)와 A1 표기법(A1 notation)이 핵심 개념입니다.

- **스프레드시트 ID:** 스프레드시트 URL에서 찾을 수 있는 고유 식별자로, 스프레드시트 이름이 변경되어도 안정적으로 유지됩니다.
- **A1 표기법:** `Sheet1!A1:B2`와 같이 시트 이름과 셀 좌표를 문자열로 지정하여 데이터 범위를 정의하는 방법입니다.
- **일괄 작업(Batch):** 여러 작업을 단일 요청으로 묶어 처리하는 `spreadsheets.batchUpdate` 및 `spreadsheets.values.batchGet`과 같은 메서드를 적극 권장합니다. 이는 네트워크 오버헤드와 할당량 소모를 최소화합니다.

## 2. 구현된 CRUD 명세

### 2.1. 스프레드시트 생성 (`spreadsheets.create`)

새로운 빈 스프레드시트를 생성하고 제목을 설정합니다.

### 2.2. 데이터 읽기 (`spreadsheets.values.get`)

특정 A1 표기법 범위의 셀 데이터를 읽어옵니다. 여러 개의 불연속적인 범위를 한 번에 읽어와야 하는 경우 `spreadsheets.values.batchGet`을 사용할 수 있습니다.

### 2.3. 데이터 쓰기/수정 (`spreadsheets.values.update`, `spreadsheets.values.append`)

- `spreadsheets.values.update`: 특정 범위의 셀 값을 수정합니다.
- `spreadsheets.values.append`: 스프레드시트의 첫 번째 빈 행에 새로운 데이터를 추가합니다. `range` 매개변수에는 시트 이름만 지정하는 것이 권장됩니다.

### 2.4. 데이터 삭제 (`spreadsheets.values.clear`)

특정 범위의 셀 값을 지웁니다. 이 메서드는 셀의 내용만 삭제하고 서식은 유지합니다.

## 3. Node.js 구현 예시 (엔드포인트)

- `POST /api/sheets`: 새 스프레드시트 생성
- `GET /api/sheets/:spreadsheetId/values/:range`: 특정 범위 데이터 읽기
- `POST /api/sheets/:spreadsheetId/values/:range/append`: 데이터 추가
- `PUT /api/sheets/:spreadsheetId/values/:range`: 특정 범위 데이터 수정
- `POST /api/sheets/:spreadsheetId/values/:range/clear`: 특정 범위의 값 삭제
