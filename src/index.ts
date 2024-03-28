import express from "express";
import { engine } from "express-handlebars";

const app = express();
const port = 3000;

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

app.get("/", (req, res) => {
  res.render("home", {
    message: "Welcome to NodeJS with Typescript",
    name: "Tobi"
  });
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
