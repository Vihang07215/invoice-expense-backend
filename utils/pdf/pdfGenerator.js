const PDFDocument = require("pdfkit");

exports.generateInvoicePDF = async (invoice) => {
  const doc = new PDFDocument();
  let buffers = [];
  doc.on("data", buffers.push.bind(buffers));
  doc.on("end", () => {});

  doc.text(`Invoice #${invoice.id}`);
  doc.text(`Client ID: ${invoice.clientId}`);
  doc.text(`Status: ${invoice.status}`);
  doc.text(`Total: ${invoice.total}`);
  doc.text(`Tax: ${invoice.tax}`);
  doc.text(`Generated on: ${new Date().toLocaleString()}`);

  doc.end();
  return new Promise((resolve) => {
    doc.on("end", () => resolve(Buffer.concat(buffers)));
  });
};

exports.generateReportPDF = async (invoices, expenses, { from, to }) => {
  const doc = new PDFDocument();
  let buffers = [];
  doc.on("data", buffers.push.bind(buffers));
  doc.on("end", () => {});

  doc.text(`Report from ${from} to ${to}`);
  doc.text(`Total Invoices: ${invoices.length}`);
  const paid = invoices.filter(i => i.status === "paid").length;
  doc.text(`Paid vs Unpaid: ${paid} / ${invoices.length - paid}`);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  doc.text(`Total Expenses: ${totalExpenses}`);
  const revenue = invoices.reduce((sum, i) => sum + i.items.reduce((a,b)=>a+b.total,0), 0) - totalExpenses;
  doc.text(`Net Revenue: ${revenue}`);

  doc.end();
  return new Promise((resolve) => {
    doc.on("end", () => resolve(Buffer.concat(buffers)));
  });
};
