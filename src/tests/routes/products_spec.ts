import supertest from "supertest";
import app from "../../server";
import client from "../../database";
import { UserModel } from "../../models/user";
import { ProductModel } from "../../models/product";

const userClass = new UserModel();
const productClass = new ProductModel();

const request = supertest(app);

const resretId = async (): Promise<void> => {
    const sql =
        "ALTER SEQUENCE users_id_seq RESTART WITH 1;\
                 ALTER SEQUENCE products_id_seq RESTART WITH 1;";
    // @ts-ignore
    const conn = await client.connect();
    await conn.query(sql);
    conn.release();
};

let token: string;
let badToken: string;

describe("Testing Routes: Products", (): void => {
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
    });

    afterAll(async (): Promise<void> => {
        await userClass.delete(1);
        await productClass.delete(1);
        await resretId();
    });

    it("creating product test with invalid token", async (): Promise<void> => {
        const response = await request
            .post("/api/products")
            .set("authorization", badToken)
            .send({
                name: "item",
                price: 25
            });
        expect(response.status).toBe(401);
    });

    it("creating product test with valid token", async (): Promise<void> => {
        const response = await request
            .post("/api/products")
            .set("authorization", token)
            .send({
                name: "item",
                price: 25
            });
        expect(response.status).toBe(200);
    });

    it("test get product with bad id", async (): Promise<void> => {
        const response = await request.get("/api/products/kn");

        expect(response.status).toBe(401);
    });

    it("test get not existed product", async (): Promise<void> => {
        const response = await request.get("/api/products/5");
        expect(response.status).toBe(404);
    });

    it("test get existed product with valid id", async (): Promise<void> => {
        const response = await request.get("/api/products/1");
        expect(response.status).toBe(200);
    });

    it("test get all products", async (): Promise<void> => {
        const response = await request.get("/api/products");
        expect(response.status).toBe(200);
    });
});
