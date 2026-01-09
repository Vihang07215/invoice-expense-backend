const db = require("../config/db");
const pdfGenerator = require("../utils/pdf/pdfGenerator");
const { responseStatus } = require("../utils/responseStatus");
const { sendResponse } = require("../utils/sendResponse");

exports.createInvoice = async (req, res) => {
  try {
    const { clientId, items, tax, dueDate } = req.body;

    // 1️⃣ Calculate subtotal from items
    // items = [{ quantity: 2, price: 100 }]
    const subtotal = items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );

    // 2️⃣ Calculate total
    const total = subtotal + tax;

    // 3️⃣ Generate invoice number
    const invoiceNumber = `INV-${Date.now()}`;

    // 4️⃣ Insert invoice
    const result = await db.query(
      `
      INSERT INTO "Invoice"
      ("invoiceNumber", "subtotal", "tax", "total", "status", "issuedDate", "dueDate", "clientId")
      VALUES ($1, $2, $3, $4, $5, NOW(), $6, $7)
      RETURNING *
      `,
      [invoiceNumber, subtotal, tax, total, "draft", dueDate, clientId]
    );

    return res
      .status(responseStatus.code_201)
      .send(
        sendResponse(result.rows[0], false, "Invoice created successfully !!")
      );
  } catch (err) {
    console.error("CREATE INVOICE ERROR:", err);
    return res
      .status(responseStatus.code_500)
      .send(sendResponse(null, true, "Internal server error"));
  }
};

exports.getInvoices = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM "Invoice"');

    return res
      .status(responseStatus.code_200)
      .send(
        sendResponse(result.rows, false, "Invoice fecthed successfully !!")
      );
  } catch (err) {
    return res
      .status(responseStatus.code_500)
      .send(sendResponse(null, true, "Internal server error"));
  }
};

exports.getInvoiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM "Invoice" WHERE id=$1', [id]);
    if (!result.rows.length) {
      return res
        .status(responseStatus.code_404)
        .send(sendResponse(null, false, "Invoice not found !!"));
    }
    return res
      .status(responseStatus.code_200)
      .send(
        sendResponse(result.rows, false, "Invoice fecthed successfully !!")
      );
  } catch (err) {
    return res
      .status(responseStatus.code_500)
      .send(sendResponse(null, true, "Internal server error"));
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    // Validate flow: draft → sent → paid
    const allowed = ["draft", "sent", "paid"];
    if (!allowed.includes(status)) {
      return res
        .status(responseStatus.code_404)
        .send(sendResponse(null, false, "Invalid status!!"));
    }

    const result = await db.query(
      'UPDATE "Invoice" SET status=$1 WHERE id=$2 RETURNING *',
      [status, id]
    );
    return res
      .status(responseStatus.code_200)
      .send(
        sendResponse(result.rows[0], false, "Invoice updated successfully !!")
      );
  } catch (err) {
    return res
      .status(responseStatus.code_500)
      .send(sendResponse(null, true, "Internal server error"));
  }
};

exports.downloadInvoicePDF = async (req, res) => {
  try {
    const { id } = req.params;

    const invoice = await db.query(
      `
  SELECT 
    i.*,
    c.name AS client_name,
    c.email AS client_email
  FROM "Invoice" i
  JOIN "Client" c ON c.id = i."clientId"
  WHERE i.id = $1
`,
      [id]
    );

    if (!invoice.rows.length) {
      return res
        .status(responseStatus.code_404)
        .send(sendResponse(null, true, "Invoice not found !!"));
    }

    const pdfBuffer = await pdfGenerator.generateInvoicePDF(invoice.rows[0]);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice-${id}.pdf`
    );

    return res.send(pdfBuffer);
  } catch (err) {
    console.error("DOWNLOAD INVOICE PDF ERROR:", err);
    return res
      .status(responseStatus.code_500)
      .send(sendResponse(null, true, "Internal server error"));
  }
};

