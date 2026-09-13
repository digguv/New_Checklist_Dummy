import * as XLSX from 'xlsx';

export const exportService = {
  exportToCSV(data, fileName = 'report.csv') {
    if (!data || !data.length) return;
    
    const worksheet = XLSX.utils.json_to_sheet(data);
    const csvOutput = XLSX.utils.sheet_to_csv(worksheet);
    
    const blob = new Blob([csvOutput], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', fileName.endsWith('.csv') ? fileName : `${fileName}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  exportToExcel(data, fileName = 'report.xlsx', sheetName = 'Data') {
    if (!data || !data.length) return;

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    
    XLSX.writeFile(workbook, fileName.endsWith('.xlsx') ? fileName : `${fileName}.xlsx`);
  },

  printReport(elementId, title = 'Report Print View') {
    const element = document.getElementById(elementId);
    if (!element) {
      window.print();
      return;
    }

    const printWindow = window.open('', '_blank', 'width=1000,height=800');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${title}</title>
            <style>
              body { font-family: system-ui, -apple-system, sans-serif; padding: 24px; color: #1e293b; }
              table { width: 100%; border-collapse: collapse; margin-top: 16px; }
              th, td { border: 1px solid #cbd5e1; padding: 8px 12px; text-align: left; font-size: 13px; }
              th { background-color: #f1f5f9; font-weight: 600; }
              h2 { color: #0f172a; margin-bottom: 4px; }
              .header { border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 20px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h2>${title}</h2>
              <p style="color: #64748b; font-size: 12px;">Generated on ${new Date().toLocaleString()}</p>
            </div>
            ${element.innerHTML}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    }
  }
};
