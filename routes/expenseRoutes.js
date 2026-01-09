const express = require("express");
const router = express.Router();
const ExpenseController = require("../controllers/ExpenseController");
const authMiddleware = require("../middelwares/auth");

router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Expenses
 *   description: Expense management
 */

/**
 * @swagger
 * /api/expense/addExpense:
 *   post:
 *     summary: Create a new expense
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - category
 *               - amount
 *               - expenseDate
 *               - note
 *             properties:
 *               category:
 *                 type: string
 *                 example: Food
 *               amount:
 *                 type: number
 *                 example: 250
 *               expenseDate:
 *                 type: string
 *                 format: date
 *                 example: 2025-01-08
 *               note:
 *                 type: string
 *                 example: Lunch with client   
 *     responses:
 *       201:
 *         description: Expense created
 */
router.post("/addExpense", authMiddleware,ExpenseController.createExpense);

/**
 * @swagger
 * /api/expense/getExpense:
 *   get:
 *     summary: Get all expenses
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of expenses
 */
router.get("/getExpense",authMiddleware, ExpenseController.getExpenses);

module.exports = router;
