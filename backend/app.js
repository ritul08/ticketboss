const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const path = require("path");

const routes = require("./routes");

const app = express();

/* ---------------- Middleware ---------------- */
app.use(express.json());
app.use(cors());

/* ---------------- Swagger Setup ---------------- */
// IMPORTANT: absolute path using __dirname
const swaggerFilePath = path.join(__dirname, "swagger.yaml");
const swaggerDocument = YAML.load(swaggerFilePath);

// Swagger UI route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

/* ---------------- API Routes ---------------- */
app.use("/reservations", routes);

/* ---------------- Server Start ---------------- */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Swagger UI available at http://localhost:${PORT}/api-docs`);
});
