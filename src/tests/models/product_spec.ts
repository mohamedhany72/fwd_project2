import client from "../../database";
import { ProductModel, Product } from "../../models/product";
// import { UserModel } from "../../models/user";

const productClass = new ProductModel();
// const userClass = new UserModel();

const product: Product = {
    id: 1,
    name: "ball",
    price: 25
};

describe("Testing Model: Product", () => {
    beforeAll(async (): Promise<void> => {
        // await userClass.create({
        //     firstname: "Mohamed",
        //     lastname:"Hany",
        //     password:"password"
        // });
        const sql = "ALTER SEQUENCE products_id_seq RESTART WITH 1;";
        // @ts-ignore
        const conn = await client.connect();
        await conn.query(sql);
        conn.release();
    });

    afterAll(async (): Promise<void> => {
        // await userClass.delete(1)
        const sql = "ALTER SEQUENCE products_id_seq RESTART WITH 1;";
        // @ts-ignore
        const conn = await client.connect();
        await conn.query(sql);
        conn.release();
    });

    it("index should exist", (): void => {
        expect(productClass.index).toBeDefined();
    });
    it("index should retun empty array", async (): Promise<void> => {
        const result = await productClass.index();
        expect(result).toEqual([]);
    });

    it("create method should exist", (): void => {
        expect(productClass.create).toBeDefined();
    });
    it("create method should create the product", async (): Promise<void> => {
        const result = await productClass.create(product);
        expect(result).toEqual(product);
    });

    it("index method should array containing the product", async (): Promise<void> => {
        const result = await productClass.index();
        expect(result).toEqual([product]);
    });

    it("show method should exist", (): void => {
        expect(productClass.show).toBeDefined();
    });
    it("show method should return the product", async (): Promise<void> => {
        const result = await productClass.show(1);
        expect(result.product).toEqual(product);
    });

    it("delete method should exist", (): void => {
        expect(productClass.delete).toBeDefined();
    });
    it("delete method should delete the product", async (): Promise<void> => {
        await productClass.delete(1);
        const result = await productClass.index();
        expect(result).toEqual([]);
    });
});
