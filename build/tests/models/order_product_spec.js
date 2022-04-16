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
var database_1 = __importDefault(require("../../database"));
var user_1 = require("../../models/user");
var order_1 = require("../../models/order");
var product_1 = require("../../models/product");
var order_product_1 = require("../../models/order_product");
var dashboard_1 = require("../../models/services/dashboard");
var userClass = new user_1.UserModel();
var orderClass = new order_1.OrderModel();
var productClass = new product_1.ProductModel();
var opClass = new order_product_1.OrderProductModel();
var dashClass = new dashboard_1.DashboardQueries();
var record = {
    id: 1,
    order_id: 1,
    product_id: 1,
    quantity: 20
};
var resetIds = function () { return __awaiter(void 0, void 0, void 0, function () {
    var sql, conn;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                sql = "ALTER SEQUENCE users_id_seq RESTART WITH 1;\
    ALTER SEQUENCE orders_id_seq RESTART WITH 1;\
    ALTER SEQUENCE orders_products_id_seq RESTART WITH 1;\
    ALTER SEQUENCE products_id_seq RESTART WITH 1;";
                return [4 /*yield*/, database_1.default.connect()];
            case 1:
                conn = _a.sent();
                return [4 /*yield*/, conn.query(sql)];
            case 2:
                _a.sent();
                conn.release();
                return [2 /*return*/];
        }
    });
}); };
describe("Testing Model: order_product", function () {
    beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // reset the id sequence of every
                return [4 /*yield*/, resetIds()];
                case 1:
                    // reset the id sequence of every
                    _a.sent();
                    // create user
                    return [4 /*yield*/, userClass.create({
                            firstname: "Mohamed",
                            lastname: "Hany",
                            password: "password"
                        })];
                case 2:
                    // create user
                    _a.sent();
                    // create product
                    return [4 /*yield*/, productClass.create({
                            name: "ball",
                            price: 25
                        })];
                case 3:
                    // create product
                    _a.sent();
                    // create order
                    return [4 /*yield*/, orderClass.create({
                            user_id: 1,
                            status: "active"
                        })];
                case 4:
                    // create order
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    afterAll(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // delete product
                return [4 /*yield*/, productClass.delete(1)];
                case 1:
                    // delete product
                    _a.sent();
                    // delete user
                    return [4 /*yield*/, userClass.delete(1)];
                case 2:
                    // delete user
                    _a.sent();
                    // reset the id sequence of every
                    return [4 /*yield*/, resetIds()];
                case 3:
                    // reset the id sequence of every
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it("index method should exist", function () {
        expect(opClass.index).toBeDefined();
    });
    it("index method should return empty array", function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, opClass.index()];
                case 1:
                    result = _a.sent();
                    expect(result).toEqual([]);
                    return [2 /*return*/];
            }
        });
    }); });
    it("create method should exist", function () {
        expect(opClass.create).toBeDefined();
    });
    it("create method should create the product order record", function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, opClass.create(record)];
                case 1:
                    result = _a.sent();
                    expect(result).toEqual(record);
                    return [2 /*return*/];
            }
        });
    }); });
    it("index method should return the record within the array", function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, opClass.index()];
                case 1:
                    result = _a.sent();
                    expect(result).toEqual([record]);
                    return [2 /*return*/];
            }
        });
    }); });
    it("show method should exist", function () {
        expect(opClass.show).toBeDefined();
    });
    it("show mmethod should return the record", function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, opClass.show(1)];
                case 1:
                    result = _a.sent();
                    expect(result).toEqual(record);
                    return [2 /*return*/];
            }
        });
    }); });
    it("delete method should exist", function () {
        expect(opClass.delete).toBeDefined();
    });
    it("delete method should remove the record", function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, opClass.delete(1)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, opClass.index()];
                case 2:
                    result = _a.sent();
                    expect(result).toEqual([]);
                    return [2 /*return*/];
            }
        });
    }); });
});
describe("Testing dashboard quries associated with order_product model", function () {
    beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // reset the id sequence of every
                return [4 /*yield*/, resetIds()];
                case 1:
                    // reset the id sequence of every
                    _a.sent();
                    // create user
                    return [4 /*yield*/, userClass.create({
                            firstname: "Mohamed",
                            lastname: "Hany",
                            password: "password"
                        })];
                case 2:
                    // create user
                    _a.sent();
                    // create product
                    return [4 /*yield*/, productClass.create({
                            name: "ball",
                            price: 25
                        })];
                case 3:
                    // create product
                    _a.sent();
                    // create order
                    return [4 /*yield*/, orderClass.create({
                            user_id: 1,
                            status: "active"
                        })];
                case 4:
                    // create order
                    _a.sent();
                    // create order product record
                    return [4 /*yield*/, opClass.create(record)];
                case 5:
                    // create order product record
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    afterAll(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // delete product
                return [4 /*yield*/, productClass.delete(1)];
                case 1:
                    // delete product
                    _a.sent();
                    // delete user
                    return [4 /*yield*/, userClass.delete(1)];
                case 2:
                    // delete user
                    _a.sent();
                    // reset the id sequence of every
                    return [4 /*yield*/, resetIds()];
                case 3:
                    // reset the id sequence of every
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it("productsInAllOrders method should exist", function () {
        expect(dashClass.productsInAllOrders).toBeDefined();
    });
    it("productsInAllOrders should return values", function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, dashClass.productsInAllOrders(1)];
                case 1:
                    result = _a.sent();
                    expect(result).toEqual([
                        {
                            name: "ball",
                            price: 25,
                            quantity: 20,
                            order_id: 1
                        }
                    ]);
                    return [2 /*return*/];
            }
        });
    }); });
    it("productsInOrder method should exist", function () {
        expect(dashClass.productsInOrder).toBeDefined();
    });
    it("productsInOrder should return all products associated with that order", function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, dashClass.productsInOrder(1)];
                case 1:
                    result = _a.sent();
                    expect(result).toEqual([
                        {
                            name: "ball",
                            price: 25,
                            quantity: 20,
                            order_id: 1
                        }
                    ]);
                    return [2 /*return*/];
            }
        });
    }); });
});
