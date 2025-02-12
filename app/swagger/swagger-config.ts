import swaggerJSDoc from "swagger-jsdoc";
import path from "path";

const options: swaggerJSDoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
          title: "My API",
          version: "1.0.0",
          description: "API Documentation with Swagger and Bearer Authentication",
        },
        servers: [
          {
            url: "http://localhost:4000/api/v1",
          }
        ],
        components: {
          securitySchemes: {
            bearerAuth: {
              type: "http",
              scheme: "bearer",
              bearerFormat: "JWT",
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
  apis: [path.join(__dirname, "../user/user.route.ts")],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
