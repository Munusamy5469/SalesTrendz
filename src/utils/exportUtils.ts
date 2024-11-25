import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { SalesData } from '../lib/types';
import { formatDate } from './dateUtils';

export const exportToPDF = (data: SalesData[], title: string) => {
  const doc = new jsPDF();
  
  doc.text(title, 14, 15);
  
  const tableData = data.map(item => [
    formatDate(item.saleDate),
    item.productName,
    item.productId,
    `$${item.price.toFixed(2)}`,
    item.stockSold.toString(),
    `${item.profitMargin}%`,
    item.stockBalance.toString()
  ]);
  
  (doc as any).autoTable({
    head: [['Date', 'Product', 'ID', 'Price', 'Sold', 'Margin', 'Balance']],
    body: tableData,
    startY: 20,
  });
  
  doc.save(`${title.toLowerCase().replace(/\s+/g, '-')}.pdf`);
};

export const exportToExcel = (data: SalesData[], title: string) => {
  const ws = XLSX.utils.json_to_sheet(data.map(item => ({
    Date: formatDate(item.saleDate),
    Product: item.productName,
    ID: item.productId,
    Price: item.price,
    'Stock Sold': item.stockSold,
    'Profit Margin': `${item.profitMargin}%`,
    'Stock Balance': item.stockBalance
  })));
  
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sales Data');
  XLSX.writeFile(wb, `${title.toLowerCase().replace(/\s+/g, '-')}.xlsx`);
};