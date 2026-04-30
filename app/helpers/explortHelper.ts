/* eslint-disable @typescript-eslint/no-explicit-any */
import type { CellStyle, Range } from 'xlsx-js-style';

interface ExcelColumn {
  key: string;
  title: string;
  style?: CellStyle;
}

export const exportHelper = async (
  data: Record<string, any>[],
  columns: ExcelColumn[],
  fileName = 'export.xlsx',
  sheetName = 'Sheet1',
  headerTitles: string[][] = [['Room List']],
  isFooter?: boolean,
  formatHorizontal?: (colIndex: number) => 'left' | 'center' | 'right'
): Promise<void> => {
  if (!data || data.length === 0 || !columns || columns.length === 0) {
    console.warn('⚠️ No data available to export.');
    return;
  }

  try {
    const XLSX = await import('xlsx-js-style');
    const headerStyle: CellStyle = {
      font: { bold: true, color: { rgb: 'FFFFFF' } },
      fill: { fgColor: { rgb: '4F81BD' } },
      alignment: { horizontal: 'center', vertical: 'center' },
      border: {
        top: { style: 'thin', color: { rgb: '000000' } },
        bottom: { style: 'thin', color: { rgb: '000000' } },
        left: { style: 'thin', color: { rgb: '000000' } },
        right: { style: 'thin', color: { rgb: '000000' } },
      },
    };

    const titleStyle: CellStyle = {
      font: { bold: true, sz: 14, underline: true, color: { rgb: 'FFFFFF' } },
      alignment: { horizontal: 'center', vertical: 'center' },
      fill: { fgColor: { rgb: 'D4001D' } },
    };

    const titleRows = headerTitles.map((rowTitles) =>
      rowTitles.map((title) => ({
        v: title,
        s: titleStyle
      }))
    );

    const headers = columns.map(col => ({
      v: col.title,
      s: headerStyle
    }));

    const formattedData = data.map((row, index) =>
      columns.map((col, colIndex) => {
        const lastRow = index === data.length - 1;
        return {
          v: row[col.key],
          s: {
            fill: { fgColor: { rgb: lastRow ? 'D4001D' : 'FFFFFF' } },
            font: { bold: false, color: { rgb: lastRow ? 'FFFFFF' : '000000' } },
            alignment: { horizontal: formatHorizontal ? formatHorizontal(colIndex) : 'center', vertical: 'center' },
            border: {
              top: { style: 'thin', color: { rgb: '000000' } },
              bottom: { style: 'thin', color: { rgb: '000000' } },
              left: { style: 'thin', color: { rgb: '000000' } },
              right: { style: 'thin', color: { rgb: '000000' } },
            },
          },
        };
      })
    );

    const worksheetData = [...titleRows, headers, ...formattedData];

    const colWidths: number[] = columns.map((col) => {
      let maxLength = col.title.length;
      data.forEach(row => {
        const cellValue = String(row[col.key]);
        maxLength = Math.max(maxLength, cellValue.length);
      });
      return maxLength + 2;
    });

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    const merges: Range[] = [];
    headerTitles.forEach((rowTitles, rowIndex) => {
      if (rowTitles.length > 0) {
        merges.push({
          s: { r: rowIndex, c: 0 },
          e: { r: rowIndex, c: columns.length - 1 },
        });
      }
    });
    worksheet['!merges'] = merges;

    worksheet['!cols'] = colWidths.map(width => ({ wpx: width * 6 }));

    worksheet['!rows'] = Array.from({ length: worksheetData.length }, (_, index) => {
      if (index === 0) return { hpt: 30 };
      if (index === 1 || index === 2) return { hpt: 25 };
      if (isFooter && index === worksheetData.length - 1) return { hpt: 25 };
      return { hpt: 18 };
    });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    XLSX.writeFile(workbook, fileName);
  } catch (error) {
    console.error('❌ Error exporting to Excel:', error);
  }
};

interface ColumnConfig {
  key: string;
  title: string;
  bgColor?: string;
  textColor?: string;
  displayFormat?: 'left' | 'center' | 'right';
  format?: 'number' | 'currency' | 'date' | ((value: any) => string);
}
export const createColumn = (config: ColumnConfig) => {
  const { key, title, bgColor, textColor, displayFormat = 'left', format } = config;

  const style: CellStyle = {
    font: {
      color: textColor ? { rgb: textColor } : undefined,
      bold: textColor ? true : false,
    },
    fill: bgColor ? { fgColor: { rgb: bgColor } } : undefined,
    alignment: { horizontal: displayFormat, vertical: 'center' },
    border: {
      top: { style: 'thin', color: { rgb: '000000' } },
      bottom: { style: 'thin', color: { rgb: '000000' } },
      left: { style: 'thin', color: { rgb: '000000' } },
      right: { style: 'thin', color: { rgb: '000000' } },
    },
  };

  return {
    key,
    title,
    style,
    format,
  };
};

// const formatValue = (value: any, format?: 'number' | 'currency' | 'date' | ((value: any) => string)) => {
//   if (!format) return value; 

//   if (typeof format === 'function') {
//     return format(value);
//   }

//   switch (format) {
//     case 'number':
//       return typeof value === 'number' ? value.toFixed(2) : value;
//     case 'currency':
//       return typeof value === 'number' ? `$${value.toFixed(2)}` : value;
//     case 'date':
//       return value instanceof Date ? value.toLocaleDateString() : value;
//     default:
//       return value;
//   }
// };
