import express from "express";
import { ProductModel } from "../../models/product";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const products = express.Router();
const model = new ProductModel();

const index = async (
    _req: express.Request,
    res: express.Response
): Promise<void> => {
    try {
        const result = await model.index();
        res.status(200);
        res.json(result);
        return;
    } catch {
        res.status(500);
        res.send("server side error");
        return;
    }
};

const show = async (
    req: express.Request,
    res: express.Response
): Promise<void> => {
    const id = req.params.id;
    // @ts-ignore
    if (isNaN(id)) {
        res.status(401);
        res.send("enter valid product id!");
        return;
    }
    try {
        const result = await model.show(id);
        if (result.success) {
            res.status(200);
            res.json({
                success: 1,
                product: result.product
            });
            return;
        } else {
            res.status(404);
            res.json({
                success: 0,
                msg: "product not found"
            });
            return;
        }
    } catch {
        res.status(500);
        res.send("server side error");
        return;
    }
};

const create = async (
    req: express.Request,
    res: express.Response
): Promise<void> => {
    let token: string;

    try {
        const authorizationHeader = req.headers.authorization;
        token = (authorizationHeader as string).split(" ")[1];
        jwt.verify(token, process.env.TOKEN_SECRET as string);
    } catch (err) {
        res.status(401);
        res.json("Access denied, invalid token");
        return;
    }

    try {
        const result = await model.create({ name: "item", price: 25 });

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

products.post("/", create);
products.get("/:id", show);
products.get("/", index);
export default products;
