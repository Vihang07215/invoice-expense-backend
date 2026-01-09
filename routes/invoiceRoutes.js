const express = require("express");
const router = express.Router();
const InvoiceController = require("../controllers/InvoiceController");
const authMiddleware = require("../middelwares/auth");

router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Invoices
 *   description: Invoice management
 */

/**
 * @swagger
 * /api/invoice/addInvoice:
 *   post:
 *     summary: Create a new invoice
 *     tags:
 *       - Invoices
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - clientId
 *               - items
 *               - tax
 *               - dueDate
 *             properties:
 *               clientId:
 *                 type: integer
 *                 example: 1
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - quantity
 *                     - price
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: Website design
 *                     quantity:
 *                       type: integer
 *                       example: 2
 *                     price:
 *                       type: number
 *                       example: 1500
 *               tax:
 *                 type: number
 *                 example: 200
 *               dueDate:
 *                 type: string
 *                 format: date
 *                 example: 2025-01-20
 *     responses:
 *       201:
 *         description: Invoice created successfully
 *       401:
 *         description: Unauthorized
 */
router.post("/addInvoice", InvoiceController.createInvoice);

/**
 * @swagger
 * /api/invoice/getInvoice:
 *   get:
 *     summary: Get all invoices
 *     tags: [Invoices]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of invoices
 */
router.get("/getInvoice", InvoiceController.getInvoices);

/**
 * @swagger
 * /api/invoice/getInvoiceBy/{id}:
 *   get:
 *     summary: Get invoice by ID
 *     tags: [Invoices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Invoice data
 *       404:
 *         description: Invoice not found
 */
router.get("/getInvoiceBy/:id", InvoiceController.getInvoiceById);

/**
 * @swagger
 * /api/invoice/getInvoiceBy/{id}/status:
 *   patch:
 *     summary: Update invoice status (draft → sent → paid)
 *     tags: [Invoices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [draft, sent, paid]
 *     responses:
 *       200:
 *         description: Status updated
 *       400:
 *         description: Invalid status
 */
router.patch("/getInvoiceBy/:id/status", InvoiceController.updateStatus);

/**
 * @swagger
 * /api/invoice/getInvoice/{id}/pdf:
 *   get:
 *     summary: Download invoice PDF
 *     tags: [Invoices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: PDF file
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 */
router.get("/getInvoice/:id/pdf", InvoiceController.downloadInvoicePDF);


module.exports = router;
