import express from "express";
import users from "./users/users";
import orders from "./orders/orders";
import products from "./products/products";
import dashboard from "./services/dashboards";

const routes = express.Router();

routes.get("/", (_req, res) => {
    res.send("main api rout");
});

routes.use("/users", users);
routes.use("/orders", orders);
routes.use("/products", products);
routes.use("/dashboard", dashboard);

export default routes;
