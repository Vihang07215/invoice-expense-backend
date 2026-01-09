const express = require('express');
const authRoute= require('./authRoutes');
const clientRoute = require('./clientRoutes');
const invoiceRoute = require('./invoiceRoutes');
const expenseRoute = require('./expenseRoutes');
const router = express.Router();

/**
 * @swagger
 * /api/:
 *   get:
 *     summary: Check API status
 *     tags:
 *       - Status
 *     responses:
 *       200:
 *         description: API is running
 */
router.get('/', (req, res) => {
  res.send({ message: 'Vidhyasetu API Running' });
});
router.use('/auth',authRoute)
router.use('/client',clientRoute)
router.use('/invoice',invoiceRoute)
router.use('/expense',expenseRoute)



module.exports = router;
