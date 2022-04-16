import supertest from "supertest";
import app from "../../server";
import client from "../../database";
import { UserModel } from "../../models/user";
import { OrderModel } from "../../models/order";
import { ProductModel } from "../../models/product";

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
let order_id: number;

describe("Testing Routes: Orders", (): void => {
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
    });

    afterAll(async (): Promise<void> => {
        await orderClass.delete(order_id);
        await userClass.delete(1);
        await productClass.delete(1);
        await productClass.delete(2);
        await resretId();
    });

    it("creating order test with invalid token", async (): Promise<void> => {
        const response = await request
            .post("/api/orders")
            .set("authorization", badToken)
            .send({
                products: [
                    { id: 1, quantity: 20 },
                    { id: 2, quantity: 10 }
                ]
            });
        expect(response.status).toBe(401);
    });

    it("creating order test with no products", async (): Promise<void> => {
        const response = await request
            .post("/api/orders")
            .set("authorization", token)
            .send({ products: [] });
        expect(response.status).toBe(401);
    });

    it("creating order test with a not existing products", async (): Promise<void> => {
        const response = await request
            .post("/api/orders")
            .set("authorization", token)
            .send({
                products: [
                    { id: 4, quantity: 20 },
                    { id: 6, quantity: 10 }
                ]
            });
        expect(response.status).toBe(401);
    });

    it("creating order test with a valid token and existing products", async (): Promise<void> => {
        const response = await request
            .post("/api/orders")
            .set("authorization", token)
            .send({
                products: [
                    { id: 1, quantity: 20 },
                    { id: 2, quantity: 10 }
                ]
            });
        expect(response.status).toBe(200);
        order_id = response.body.order.id;
    });

    it("change order status test with invalid token", async (): Promise<void> => {
        const response = await request
            .put("/api/orders")
            .set("authorization", badToken)
            .send({ order_id: order_id });
        expect(response.status).toBe(401);
        expect(response.body).toEqual("Access denied, invalid token");
    });

    it("change order status test with a not existing order", async (): Promise<void> => {
        const response = await request
            .put("/api/orders")
            .set("authorization", token)
            .send({ order_id: 5 });
        expect(response.status).toBe(404);
        expect(response.body.msg).toEqual("Order desn't exist");
    });

    it("change order status test with a bad id", async (): Promise<void> => {
        const response = await request
            .put("/api/orders")
            .set("authorization", token)
            .send({ order_id: "id" });
        expect(response.status).toBe(401);
        expect(response.body.msg).toEqual("order id must be number");
    });

    it("change order status test with a good id and valid token", async (): Promise<void> => {
        const response = await request
            .put("/api/orders")
            .set("authorization", token)
            .send({ order_id: order_id });
        expect(response.status).toBe(200);
    });
});
