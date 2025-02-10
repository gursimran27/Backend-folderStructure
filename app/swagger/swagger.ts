import swaggerAutogen from "swagger-autogen";

const swaggerGen = swaggerAutogen();

const doc = {
  info: {
    title: "My API",
    description: "Description",
  },
  host: "localhost:3000",
};

const outputFile = "./swagger-output.json";
const routes = ["../routes.ts"];

swaggerGen(outputFile, routes, doc);
