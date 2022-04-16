import express from "express";
import { DashboardQueries } from "../../models/services/dashboard";
import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../../models/user";
import { Order, OrderModel } from "../../models/order";

const dashboard = express.Router();
const model = new DashboardQueries();
const orderModel = new OrderModel();

const getUserOrder = async (
    req: express.Request,
    res: express.Response
): Promise<void> => {
    let token: string;
    let decode: JwtPayload | string;
    try {
        const authorizationHeader = req.headers.authorization;
        token = (authorizationHeader as string).split(" ")[1];
        decode = jwt.verify(token, process.env.TOKEN_SECRET as string);
    } catch {
        res.status(401);
        res.json("Access denied, invalid token");
        return;
    }

    const order_id = req.params.id;
    const user_id = (decode as User).id;
    // @ts-ignore
    if (isNaN(order_id)) {
        res.status(401);
        res.json("order id must be intger!");
        return;
    }

    // check if order exists and user owns the order
    try {
        const orderResult = await orderModel.show(order_id);
        if (orderResult.success) {
            if ((orderResult.order as Order).user_id != user_id) {
                res.status(401);
                res.json({
                    success: 0,
                    msg: "Access denied, user don't own the order"
                });
                return;
            }
        } else {
            res.status(404);
            res.json({
                success: 0,
                msg: "Order doesn't exist"
            });
            return;
        }
    } catch (err) {
        res.status(500);
        res.send("Server side error!");
        return;
    }

    // get all products in the order
    try {
        const result = model.productsInOrder(order_id);
        res.status(200);
        res.json({
            success: 1,
            data: result
        });
    } catch {
        res.status(500);
        res.send("Server side error!");
    }
};

const getAllUserOrders = async (
    req: express.Request,
    res: express.Response
): Promise<void> => {
    let token: string;
    let decode: JwtPayload | string;
    try {
        const authorizationHeader = req.headers.authorization;
        token = (authorizationHeader as string).split(" ")[1];
        decode = jwt.verify(token, process.env.TOKEN_SECRET as string);
    } catch {
        res.status(401);
        res.json("Access denied, invalid token");
        return;
    }
    const user_id = (decode as User).id;

    try {
        const result = await model.productsInAllOrders(user_id as string);
        res.status(200);
        res.json({
            success: 1,
            data: result
        });
    } catch {
        res.status(500);
        res.send("Server side error!");
    }
};

dashboard.get("/:id", getUserOrder);
dashboard.get("/", getAllUserOrders);

export default dashboard;
