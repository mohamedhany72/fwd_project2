"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
var routes_1 = __importDefault(require("./routes"));
var app = (0, express_1.default)();
var port = 3000;
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
app.get("/", function (_req, res) {
    res.send("app running!");
});
// app.all("/api", routes)
app.use("/api", routes_1.default);
app.listen(port, function () {
    console.log("server started at port: ".concat(port));
});
exports.default = app;
