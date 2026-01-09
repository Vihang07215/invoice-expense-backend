const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { responseStatus } = require("../utils/responseStatus");
const { sendResponse } = require("../utils/sendResponse");

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const userExists = await db.query(
      'SELECT id FROM "User" WHERE email = $1',
      [email]
    );

    if (userExists.rows.length > 0) {
      return res
        .status(responseStatus.code_409)
        .send(sendResponse(null, true, "Email already registered"));
    }
    const user = await db.query(
      'INSERT INTO "User" (name, email, password,role) VALUES ($1,$2,$3,$4) RETURNING id, name, email,role',
      [name, email, hashed, "user"]
    );
    return res
      .status(responseStatus.code_201)
      .send(sendResponse(user.rows[0], false, "User register successfully"));
  } catch (err) {
    return res
      .status(responseStatus.code_500)
      .send(sendResponse(null, true, "Internal server error"));
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await db.query('SELECT * FROM "User" WHERE email=$1', [email]);
    if (!user.rows.length) {
      return res
        .status(responseStatus.code_401)
        .send(sendResponse(null, true, "Email not register"));
    }

    const match = await bcrypt.compare(password, user.rows[0].password);
    if (!match) {
      return res
        .status(responseStatus.code_401)
        .send(sendResponse(null, true, "Invalid credentials"));
    }
    const token = jwt.sign(
      {
        id: user.rows[0].id,
        email: user.rows[0].email,
        name: user.rows[0].name,
        role: user.rows[0].role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
    return res.status(responseStatus.code_200).send(
      sendResponse(
        {
          token,
          user: {
            id: user.rows[0].id,
            name: user.rows[0].name,
            email: user.rows[0].email,
            role: user.rows[0].role,
          },
        },
        false,
        "Login Successfully !!"
      )
    );
  } catch (err) {
    return res
      .status(responseStatus.code_500)
      .send(sendResponse(null, true, "Internal server error"));
  }
};

exports.profile = async (req, res) => {
  return res
        .status(responseStatus.code_200)
        .send(sendResponse(req.user,false, "Profile data"));
  
};
