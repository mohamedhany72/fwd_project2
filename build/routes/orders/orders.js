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
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var dotenv_1 = __importDefault(require("dotenv"));
var order_1 = require("../../models/order");
var order_product_1 = require("../../models/order_product");
var product_1 = require("../../models/product");
dotenv_1.default.config();
var orders = express_1.default.Router();
var model = new order_1.OrderModel();
var poModel = new order_product_1.OrderProductModel();
var pModel = new product_1.ProductModel();
var create = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var token, decode, authorizationHeader, products, user_id, result, order_id, valid_products, i, product, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                try {
                    authorizationHeader = req.headers.authorization;
                    token = authorizationHeader.split(" ")[1];
                    decode = jsonwebtoken_1.default.verify(token, process.env.TOKEN_SECRET);
                }
                catch (err) {
                    res.status(401);
                    res.json("Access denied, invalid token");
                    return [2 /*return*/];
                }
                products = req.body.products;
                user_id = decode.id;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 10, , 11]);
                return [4 /*yield*/, model.create({
                        user_id: user_id,
                        status: "active"
                    })];
            case 2:
                result = _b.sent();
                order_id = result.id;
                valid_products = false;
                i = 0;
                _b.label = 3;
            case 3:
                if (!(i < products.length)) return [3 /*break*/, 7];
                // validate user inputs
                if (isNaN(products[i].id) || isNaN(products[i].quantity)) {
                    return [3 /*break*/, 6];
                }
                return [4 /*yield*/, pModel.show(products[i].id)];
            case 4:
                product = _b.sent();
                if (!product.success) {
                    return [3 /*break*/, 6];
                }
                else if (!valid_products) {
                    valid_products = true;
                }
                // add
                return [4 /*yield*/, poModel.create({
                        order_id: order_id,
                        product_id: products[i].id,
                        quantity: products[i].quantity
                    })];
            case 5:
                // add
                _b.sent();
                _b.label = 6;
            case 6:
                i++;
                return [3 /*break*/, 3];
            case 7:
                if (!!valid_products) return [3 /*break*/, 9];
                return [4 /*yield*/, model.delete(order_id)];
            case 8:
                _b.sent();
                res.status(401);
                res.json({
                    success: 0,
                    msg: "order has no products!"
                });
                return [2 /*return*/];
            case 9:
                res.status(200);
                res.json({
                    success: 1,
                    order: result
                });
                return [2 /*return*/];
            case 10:
                _a = _b.sent();
                res.status(500);
                res.json({
                    success: 0,
                    msg: "server side error"
                });
                return [2 /*return*/];
            case 11: return [2 /*return*/];
        }
    });
}); };
var completeOrder = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var token, decode, authorizationHeader, user_id, order_id, result, _a, result, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                try {
                    authorizationHeader = req.headers.authorization;
                    token = authorizationHeader.split(" ")[1];
                    decode = jsonwebtoken_1.default.verify(token, process.env.TOKEN_SECRET);
                }
                catch (err) {
                    res.status(401);
                    res.json("Access denied, invalid token");
                    return [2 /*return*/];
                }
                user_id = decode.id;
                order_id = req.body.order_id;
                if (isNaN(order_id)) {
                    res.status(401);
                    res.json({
                        success: 0,
                        msg: "order id must be number"
                    });
                    return [2 /*return*/];
                }
                _c.label = 1;
            case 1:
                _c.trys.push([1, 3, , 4]);
                return [4 /*yield*/, model.show(order_id)];
            case 2:
                result = _c.sent();
                // console.log(result);
                if (result.success) {
                    if (result.order.user_id != user_id) {
                        res.status(401);
                        res.json({
                            success: 0,
                            msg: "Access denied, user doesn't own the order"
                        });
                        return [2 /*return*/];
                    }
                }
                else {
                    res.status(404);
                    res.json({
                        success: 0,
                        msg: "Order desn't exist"
                    });
                    return [2 /*return*/];
                }
                return [3 /*break*/, 4];
            case 3:
                _a = _c.sent();
                res.status(500);
                res.json({
                    success: 0,
                    msg: "server side error, can't access order"
                });
                return [3 /*break*/, 4];
            case 4:
                _c.trys.push([4, 6, , 7]);
                return [4 /*yield*/, model.updateStatus(order_id, "complete")];
            case 5:
                result = _c.sent();
                res.status(200);
                res.json({
                    success: 1,
                    order: result
                });
                return [2 /*return*/];
            case 6:
                _b = _c.sent();
                res.status(500);
                res.json({
                    success: 0,
                    msg: "server side error, can't update status"
                });
                return [2 /*return*/];
            case 7: return [2 /*return*/];
        }
    });
}); };
orders.post("/", create);
orders.put("/", completeOrder);
exports.default = orders;
