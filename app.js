const express = require("express");
const dotenv = require("dotenv");
const router = require("./routes/index");
const bodyParser = require("body-parser");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
dotenv.config();
const app = express();
app.use(bodyParser.json());


app.use(express.json());
app.use(cors()); 
// Routes
app.use("/api", router);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {console.log(`Server running on port ${PORT}`),
console.log(`http://localhost:${PORT}/api-docs`);});
