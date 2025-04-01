var EXCEL_Utils = (function() {
  return{
      /**
         * Excel 파일을 생성하고 다운로드하는 함수
         * @param {Object} options - 엑셀 내보내기를 위한 옵션
         * @param {string} options.fileName - 생성할 파일 이름 (기본값: "export.xlsx")
         * @param {string} options.sheetName - 시트 이름 (기본값: "Sheet1")
         * @param {Array} options.columns - 열 정의 배열. 각 열은 다음과 같은 속성을 포함:
         *  - header: 헤더 이름
         *  - width: 열 너비 (기본값: 100)
         *  - dataType: 데이터 타입 ("string", "number" 등. 기본값: "string")
         *  - format: 데이터 포맷 (예: "#,##0" 또는 "@")
         * @param {Array} options.rows - 데이터 행 배열. 각 행은 값 배열로 구성
         * @param {Object} options.headerStyle - 헤더 셀 스타일 (기본값 제공)
         * @param {number} options.additionalRows - 빈 행 추가 개수 (기본값: 200)
       */
        excelExport : function(options){
            const defaultOptions = {
                fileName: "export.xlsx", // 기본 파일 이름
                sheetName: "Sheet1",    // 기본 시트 이름
                columns: [],            // 열 정의 (배열)
                rows: [],               // 데이터 행 (배열)
                headerStyle: {          // 헤더 스타일
                    background: "#D3D3D3",
                    bold: true,
                    textAlign: "center",
                    borderBottom: { color: "black", size: 1 },
                    borderLeft: { color: "black", size: 1 },
                    borderRight: { color: "black", size: 1 },
                    borderTop: { color: "black", size: 1 },
                },
                additionalRows: 200,     // 빈 행 추가
            };

            const config = { ...defaultOptions, ...options };

            // 열 서식 설정 (dataType 및 format 처리)
            const columns = config.columns.map(col => ({
                width: col.width || 100,
                dataType: col.dataType || "string", // 기본값은 "string"
                format: col.format || (col.dataType === "number" ? "#,##0" : "@"), // 숫자일 경우 기본 포맷
            }));

            // 기본 행 데이터 생성
            const rows = [
                {
                    type: "header",
                    cells: config.columns.map(col => ({
                        value: col.header,
                        ...config.headerStyle,
                    })),
                },
                ...config.rows.map(row => ({
                    type: "data",
                    cells: row.map((value, index) => ({
                        value,
                        dataType: config.columns[index]?.dataType || "string",
                        format: config.columns[index]?.format || (config.columns[index]?.dataType === "number" ? "#,##0" : "@"),
                    })),
                })),
            ];

            // 빈 행 추가
            for (let i = 0; i < config.additionalRows; i++) {
                rows.push({
                    type: "data",
                    cells: config.columns.map(col => ({
                        value: "",
                        dataType: col.dataType || "string",
                        format: col.format || (col.dataType === "number" ? "#,##0" : "@"),
                    })),
                });
            }

            // 워크북 생성
            const workbook = new kendo.ooxml.Workbook({
                sheets: [
                    {
                        name: config.sheetName,
                        columns: columns,
                        rows: rows,
                    },
                ],
            });

            // 파일 저장
            kendo.saveAs({
                dataURI: workbook.toDataURL(),
                fileName: config.fileName,
            });
        }
  }
})();