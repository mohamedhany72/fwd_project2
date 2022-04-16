"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var dashboard_1 = require("../../models/services/dashboard");
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var order_1 = require("../../models/order");
var dashboard = express_1.default.Router();
var model = new dashboard_1.DashboardQueries();
var orderModel = new order_1.OrderModel();
var getUserOrder = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var token, decode, authorizationHeader, order_id, user_id, orderResult, err_1, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                try {
                    authorizationHeader = req.headers.authorization;
                    token = authorizationHeader.split(" ")[1];
                    decode = jsonwebtoken_1.default.verify(token, process.env.TOKEN_SECRET);
                }
                catch (_b) {
                    res.status(401);
                    res.json("Access denied, invalid token");
                    return [2 /*return*/];
                }
                order_id = req.params.id;
                user_id = decode.id;
                // @ts-ignore
                if (isNaN(order_id)) {
                    res.status(401);
                    res.json("order id must be intger!");
                    return [2 /*return*/];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, orderModel.show(order_id)];
            case 2:
                orderResult = _a.sent();
                if (orderResult.success) {
                    if (orderResult.order.user_id != user_id) {
                        res.status(401);
                        res.json({
                            success: 0,
                            msg: "Access denied, user don't own the order"
                        });
                        return [2 /*return*/];
                    }
                }
                else {
                    res.status(404);
                    res.json({
                        success: 0,
                        msg: "Order doesn't exist"
                    });
                    return [2 /*return*/];
                }
                return [3 /*break*/, 4];
            case 3:
                err_1 = _a.sent();
                res.status(500);
                res.send("Server side error!");
                return [2 /*return*/];
            case 4:
                // get all products in the order
                try {
                    result = model.productsInOrder(order_id);
                    res.status(200);
                    res.json({
                        success: 1,
                        data: result
                    });
                }
                catch (_c) {
                    res.status(500);
                    res.send("Server side error!");
                }
                return [2 /*return*/];
        }
    });
}); };
var getAllUserOrders = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var token, decode, authorizationHeader, user_id, result, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                try {
                    authorizationHeader = req.headers.authorization;
                    token = authorizationHeader.split(" ")[1];
                    decode = jsonwebtoken_1.default.verify(token, process.env.TOKEN_SECRET);
                }
                catch (_c) {
                    res.status(401);
                    res.json("Access denied, invalid token");
                    return [2 /*return*/];
                }
                user_id = decode.id;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, model.productsInAllOrders(user_id)];
            case 2:
                result = _b.sent();
                res.status(200);
                res.json({
                    success: 1,
                    data: result
                });
                return [3 /*break*/, 4];
            case 3:
                _a = _b.sent();
                res.status(500);
                res.send("Server side error!");
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
dashboard.get("/:id", getUserOrder);
dashboard.get("/", getAllUserOrders);
exports.default = dashboard;
