import express from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../../models/user";
import { Order, OrderModel } from "../../models/order";
import { OrderProductModel } from "../../models/order_product";
import { ProductModel } from "../../models/product";

dotenv.config();

const orders = express.Router();
const model = new OrderModel();
const poModel = new OrderProductModel();
const pModel = new ProductModel();

const create = async (
    req: express.Request,
    res: express.Response
): Promise<void> => {
    let token: string;
    let decode: JwtPayload | string;
    try {
        const authorizationHeader = req.headers.authorization;
        token = (authorizationHeader as string).split(" ")[1];
        decode = jwt.verify(token, process.env.TOKEN_SECRET as string);
    } catch (err) {
        res.status(401);
        res.json("Access denied, invalid token");
        return;
    }

    const products = req.body.products;
    const user_id = (decode as User).id;
    try {
        const result = await model.create({
            user_id: user_id as number,
            status: "active"
        });
        const order_id = result.id;

        let valid_products = false;

        for (let i = 0; i < products.length; i++) {
            // validate user inputs
            if (isNaN(products[i].id) || isNaN(products[i].quantity)) {
                continue;
            }

            // check product existence
            const product = await pModel.show(products[i].id as number);
            if (!product.success) {
                continue;
            } else if (!valid_products) {
                valid_products = true;
            }

            // add
            await poModel.create({
                order_id: order_id as number,
                product_id: products[i].id as number,
                quantity: products[i].quantity as number
            });
        }

        // if valid_products remain false then there's no products in the order, so delete that invalid order
        if (!valid_products) {
            await model.delete(order_id as number);
            res.status(401);
            res.json({
                success: 0,
                msg: "order has no products!"
            });
            return;
        }

        res.status(200);
        res.json({
            success: 1,
            order: result
        });
        return;
    } catch {
        res.status(500);
        res.json({
            success: 0,
            msg: "server side error"
        });
        return;
    }
};

const completeOrder = async (
    req: express.Request,
    res: express.Response
): Promise<void> => {
    let token: string;
    let decode: JwtPayload | string;
    try {
        const authorizationHeader = req.headers.authorization;
        token = (authorizationHeader as string).split(" ")[1];
        decode = jwt.verify(token, process.env.TOKEN_SECRET as string);
    } catch (err) {
        res.status(401);
        res.json("Access denied, invalid token");
        return;
    }

    const user_id = (decode as User).id;
    // validate body parameters
    const order_id = req.body.order_id;
    if (isNaN(order_id)) {
        res.status(401);
        res.json({
            success: 0,
            msg: "order id must be number"
        });
        return;
    }
    // check if user owns the order
    try {
        const result = await model.show(order_id);
        // console.log(result);
        if (result.success) {
            if ((result.order as Order).user_id != user_id) {
                res.status(401);
                res.json({
                    success: 0,
                    msg: "Access denied, user doesn't own the order"
                });
                return;
            }
        } else {
            res.status(404);
            res.json({
                success: 0,
                msg: "Order desn't exist"
            });
            return;
        }
    } catch {
        res.status(500);
        res.json({
            success: 0,
            msg: "server side error, can't access order"
        });
    }

    // complete the order
    try {
        const result = await model.updateStatus(
            order_id as string | number,
            "complete"
        );

        res.status(200);
        res.json({
            success: 1,
            order: result
        });
        return;
    } catch {
        res.status(500);
        res.json({
            success: 0,
            msg: "server side error, can't update status"
        });
        return;
    }
};

orders.post("/", create);
orders.put("/", completeOrder);

export default orders;
