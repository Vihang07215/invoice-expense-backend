const express = require("express");
const router = express.Router();
const ClientController = require("../controllers/ClientController");
const authMiddleware = require("../middelwares/auth");

router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Clients
 *   description: Client management
 */

/**
 * @swagger
 * /api/client/addclient:
 *   post:
 *     summary: Create a new client
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - phone
 *               - address
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               phone:
 *                 type: string
 *                 example: "9876543210"
 *               address:
 *                 type: string
 *                 example: Ahmedabad, India
 *     responses:
 *       201:
 *         description: Client created
 *       401:
 *         description: Unauthorized
 */
router.post("/addclient",authMiddleware, ClientController.createClient);

/**
 * @swagger
 * /api/client/getclient:
 *   get:
 *     summary: Get all clients
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of clients
 *       401:
 *         description: Unauthorized
 */
router.get("/getclient", authMiddleware,ClientController.getClients);

/**
 * @swagger
 * /api/client/getclientby/{id}:
 *   get:
 *     summary: Get client by ID
 *     tags: [Clients]
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
 *         description: Client data
 *       404:
 *         description: Client not found
 *       401:
 *         description: Unauthorized
 */
router.get("/getclientby/:id", ClientController.getClientById);

module.exports = router;
