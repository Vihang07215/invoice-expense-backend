const db = require("../config/db");
const { responseStatus } = require("../utils/responseStatus");
const { sendResponse } = require("../utils/sendResponse");

exports.createExpense = async (req, res) => {
  try {
    const { category, amount, expenseDate, note } = req.body;
    const result = await db.query(
      'INSERT INTO "Expense" ("category", "amount", "expenseDate", "note") VALUES ($1, $2, $3, $4) RETURNING *',
      [category, amount, expenseDate, note]
    );

    return res
      .status(responseStatus.code_201)
      .send(
        sendResponse(
          result.rows[0],
          false,
          "Expense data inserted successfully !!"
        )
      );
  } catch (err) {
    return res
      .status(responseStatus.code_500)
      .send(sendResponse(null, true, "Internal server error"));
  }
};

exports.getExpenses = async (req, res) => {
  try{
  const result = await db.query('SELECT * FROM "Expense"');
   return res
      .status(responseStatus.code_200)
      .send(
        sendResponse(
          result.rows,
          false,
          "Expense data fetxhed successfully !!"
        )
      );
}
catch (err) {
    return res
      .status(responseStatus.code_500)
      .send(sendResponse(null, true, "Internal server error"));
  }
}
