"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var users_1 = __importDefault(require("./users/users"));
var orders_1 = __importDefault(require("./orders/orders"));
var products_1 = __importDefault(require("./products/products"));
var dashboards_1 = __importDefault(require("./services/dashboards"));
var routes = express_1.default.Router();
routes.get("/", function (_req, res) {
    res.send("main api rout");
});
routes.use("/users", users_1.default);
routes.use("/orders", orders_1.default);
routes.use("/products", products_1.default);
routes.use("/dashboard", dashboards_1.default);
exports.default = routes;
