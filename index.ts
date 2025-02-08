import express, { type Express, type Request, type Response } from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import http from "http";

import { initDB } from "./app/common/services/database.service";
import { initPassport } from "./app/common/services/passport-jwt.service";
import { loadConfig } from "./app/common/helper/config.hepler";
import { type IUser } from "./app/user/user.dto";
import errorHandler from "./app/common/middleware/error-handler.middleware";
import routes from "./app/routes";

loadConfig();

// When using authentication (e.g., JWT or Passport.js), middleware often attaches the logged-in user to req.user, so this ensures TypeScript recognizes it.
declare global {
  //Allows us to modify or extend existing TypeScript types in a global scope
  namespace Express {
    // we can modify a library’s types without directly changing its source code by extending its namespace.
    interface User extends Omit<IUser, "password"> {} //Extends the User interface in Express.Removes the password field from the IUser type
    interface Request {
      //Extends Express' built-in Request type to include a user property
      user?: User;
    }
  }
}

const port = Number(process.env.PORT) ?? 5000;

const app: Express = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(morgan("dev"));

const initApp = async (): Promise<void> => {
  // init mongodb
  await initDB();

  // passport init
  initPassport();

  // set base path to /api
  app.use("/api/v1", routes);

  app.get("/", (req: Request, res: Response) => {
    res.send({ status: "ok" });
  });

  //Error handling middleware (it should be the last middleware)  need to pass it as the last middleware in your application setup, after all routes and other middlewares so inorder to catch errors using next(error)
  app.use(errorHandler);

  http.createServer(app).listen(port, () => {
    console.log("Server is runnuing on port", port);
  });
};

void initApp();
