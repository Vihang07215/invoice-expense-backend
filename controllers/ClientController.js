const db = require("../config/db");
const { responseStatus } = require("../utils/responseStatus");
const { sendResponse } = require("../utils/sendResponse");

exports.createClient = async (req, res) => {
  const { name, email, phone ,address} = req.body;
  const result = await db.query(
    'INSERT INTO "Client" (name,email,phone,address) VALUES ($1,$2,$3,$4) RETURNING *',
    [name, email, phone, address]
  );
  return res
    .status(responseStatus.code_201)
    .send(
      sendResponse(
        result.rows[0],
        false,
        "Client data inserted successfully !!"
      )
    );
};

exports.getClients = async (req, res) => {
  const result = await db.query('SELECT * FROM "Client"');
  return res
    .status(responseStatus.code_200)
    .send(
      sendResponse(result.rows, false, "Client data fetched successfully !!")
    );
};

exports.getClientById = async (req, res) => {
  const { id } = req.params;
  const result = await db.query('SELECT * FROM "Client" WHERE id=$1', [id]);
  if (!result.rows.length) {
    return res
      .status(responseStatus.code_404)
      .send(sendResponse(null, true, "Client not found"));
  }
  return res
    .status(responseStatus.code_200)
    .send(
      sendResponse(result.rows[0], false, "Client data fetched successfully !!")
    );
};
