const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "FinCore API",
      version: "1.0.0",
      description: "API documentation for FinCore backend",
    },
    servers: [
      {
        url: "http://localhost:5000",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            name: { type: "string", example: "Jane Doe" },
            email: { type: "string", format: "email", example: "jane@example.com" },
            role: { type: "string", enum: ["ADMIN", "ANALYST", "VIEWER"], example: "ANALYST" },
            isActive: { type: "boolean", example: true },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        Transaction: {
          type: "object",
          properties: {
            id: { type: "integer", example: 42 },
            amount: { type: "number", format: "float", example: 2500.00 },
            type: { type: "string", enum: ["INCOME", "EXPENSE"], example: "INCOME" },
            category: { type: "string", example: "Salary" },
            description: { type: "string", example: "Monthly salary deposit" },
            date: { type: "string", format: "date", example: "2024-04-01" },
            userId: { type: "integer", example: 1 },
            createdAt: { type: "string", format: "date-time" },
          },
        },
      },
    },
  },
  apis: ["./routes/*.js"],
};

const specs = swaggerJsdoc(options);

module.exports = specs;