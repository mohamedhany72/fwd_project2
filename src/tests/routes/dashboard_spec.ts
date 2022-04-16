import supertest from "supertest";
import app from "../../server";
import client from "../../database";

import { UserModel } from "../../models/user";
import { ProductModel } from "../../models/product";
import { OrderModel } from "../../models/order";

const userClass = new UserModel();
const orderClass = new OrderModel();
const productClass = new ProductModel();

const request = supertest(app);

const resretId = async (): Promise<void> => {
    const sql =
        "ALTER SEQUENCE users_id_seq RESTART WITH 1;\
                 ALTER SEQUENCE products_id_seq RESTART WITH 1;\
                 ALTER SEQUENCE orders_id_seq RESTART WITH 1;\
                 ALTER SEQUENCE orders_products_id_seq RESTART WITH 1;";
    // @ts-ignore
    const conn = await client.connect();
    await conn.query(sql);
    conn.release();
};

let token: string;
let badToken: string;

describe("Testing Routes: Dashboard", (): void => {
    beforeAll(async (): Promise<void> => {
        await resretId();
        // creating a new user and assign the token value
        await request
            .post("/api/users/signup")
            .send({
                firstname: "Mohamed",
                lastname: "Hany",
                password: "password"
            })
            .expect((res) => {
                token = "Bearer " + res.body;
                badToken = token + "inavlid";
            });
        // creating product 1
        await productClass.create({ name: "item 1", price: 10 });
        // creating product 2
        await productClass.create({ name: "item 2", price: 20 });

        // creating the order
        await request
            .post("/api/orders")
            .set("authorization", token)
            .send({
                products: [
                    { id: 1, quantity: 20 },
                    { id: 2, quantity: 10 }
                ]
            });
    });
    afterAll(async (): Promise<void> => {
        await orderClass.delete(1);
        await userClass.delete(1);
        await productClass.delete(1);
        await productClass.delete(2);
        await resretId();
    });

    it("get all user orders with invalid token", async (): Promise<void> => {
        const response = await request
            .get("/api/dashboard")
            .set("authorization", badToken);
        expect(response.status).toBe(401);
    });
    it("get all user orders with valid token", async (): Promise<void> => {
        const response = await request
            .get("/api/dashboard")
            .set("authorization", token);
        expect(response.status).toBe(200);
    });

    it("get single order with invalid token", async (): Promise<void> => {
        const response = await request
            .get("/api/dashboard/1")
            .set("authorization", badToken);
        expect(response.status).toBe(401);
        expect(response.body).toEqual("Access denied, invalid token");
    });
    it("get single order by id of order that doesn't exist", async (): Promise<void> => {
        const response = await request
            .get("/api/dashboard/6")
            .set("authorization", token);
        expect(response.status).toBe(404);
        expect(response.body.msg).toEqual("Order doesn't exist");
    });
    it("get single order by bad id", async (): Promise<void> => {
        const response = await request
            .get("/api/dashboard/1g")
            .set("authorization", token);
        expect(response.status).toBe(401);
        expect(response.body).toEqual("order id must be intger!");
    });
    it("get single order with valid criteria", async (): Promise<void> => {
        const response = await request
            .get("/api/dashboard/1")
            .set("authorization", token);
        expect(response.status).toBe(200);
    });
});
