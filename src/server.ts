import express from "express";
import bodyParser from "body-parser";
import routes from "./routes";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (_req, res) => {
    res.send("app running!");
});

// app.all("/api", routes)
app.use("/api", routes);

app.listen(port, (): void => {
    console.log(`server started at port: ${port}`);
});

export default app;
