import express from "express";
import { engine } from "express-handlebars";
import { CommonRoutesConfig } from "./common/common.routes.config";
import { UserRoutes } from "./routes/users/user.routes.config";
import { AuthRoutes } from "./auth/auth.routes.config";
import cors from "cors";

const app = express();
const port = 3000;

const routes: Array<CommonRoutesConfig> = [];

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:8000",
  })
);

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

app.get("/", (req, res) => {
  res.render("home", {
    message: "Welcome to NodeJS with Typescript",
    name: "Tobi"
  });
});

routes.push(new UserRoutes(app));
routes.push(new AuthRoutes(app));


app.listen(port, () => {
  routes.forEach((route: CommonRoutesConfig) => {
    console.log(`Routes configured for ${route.getName()}`);
  })
  console.log(`Server is running on port ${port}`);
});
