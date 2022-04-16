import client from "../../database";
import { UserModel } from "../../models/user";
import { OrderModel } from "../../models/order";
import { ProductModel } from "../../models/product";
import { OrderProductModel, OrderProduct } from "../../models/order_product";
import { DashboardQueries } from "../../models/services/dashboard";

const userClass = new UserModel();
const orderClass = new OrderModel();
const productClass = new ProductModel();

const opClass = new OrderProductModel();
const dashClass = new DashboardQueries();

const record: OrderProduct = {
    id: 1,
    order_id: 1,
    product_id: 1,
    quantity: 20
};

const resetIds = async (): Promise<void> => {
    const sql =
        "ALTER SEQUENCE users_id_seq RESTART WITH 1;\
    ALTER SEQUENCE orders_id_seq RESTART WITH 1;\
    ALTER SEQUENCE orders_products_id_seq RESTART WITH 1;\
    ALTER SEQUENCE products_id_seq RESTART WITH 1;";

    // @ts-ignore
    const conn = await client.connect();
    await conn.query(sql);
    conn.release();
};

describe("Testing Model: order_product", (): void => {
    beforeAll(async (): Promise<void> => {
        // reset the id sequence of every
        await resetIds();

        // create user
        await userClass.create({
            firstname: "Mohamed",
            lastname: "Hany",
            password: "password"
        });

        // create product
        await productClass.create({
            name: "ball",
            price: 25
        });

        // create order
        await orderClass.create({
            user_id: 1,
            status: "active"
        });
    });
    afterAll(async (): Promise<void> => {
        // delete product
        await productClass.delete(1);

        // delete user
        await userClass.delete(1);

        // reset the id sequence of every
        await resetIds();
    });

    it("index method should exist", (): void => {
        expect(opClass.index).toBeDefined();
    });
    it("index method should return empty array", async (): Promise<void> => {
        const result = await opClass.index();
        expect(result).toEqual([]);
    });

    it("create method should exist", (): void => {
        expect(opClass.create).toBeDefined();
    });
    it("create method should create the product order record", async (): Promise<void> => {
        const result = await opClass.create(record);
        expect(result).toEqual(record);
    });

    it("index method should return the record within the array", async (): Promise<void> => {
        const result = await opClass.index();
        expect(result).toEqual([record]);
    });

    it("show method should exist", (): void => {
        expect(opClass.show).toBeDefined();
    });
    it("show mmethod should return the record", async (): Promise<void> => {
        const result = await opClass.show(1);
        expect(result).toEqual(record);
    });

    it("delete method should exist", (): void => {
        expect(opClass.delete).toBeDefined();
    });
    it("delete method should remove the record", async (): Promise<void> => {
        await opClass.delete(1);
        const result = await opClass.index();
        expect(result).toEqual([]);
    });
});

describe("Testing dashboard quries associated with order_product model", (): void => {
    beforeAll(async (): Promise<void> => {
        // reset the id sequence of every
        await resetIds();

        // create user
        await userClass.create({
            firstname: "Mohamed",
            lastname: "Hany",
            password: "password"
        });

        // create product
        await productClass.create({
            name: "ball",
            price: 25
        });

        // create order
        await orderClass.create({
            user_id: 1,
            status: "active"
        });

        // create order product record
        await opClass.create(record);
    });
    afterAll(async (): Promise<void> => {
        // delete product
        await productClass.delete(1);

        // delete user
        await userClass.delete(1);

        // reset the id sequence of every
        await resetIds();
    });

    it("productsInAllOrders method should exist", (): void => {
        expect(dashClass.productsInAllOrders).toBeDefined();
    });
    it("productsInAllOrders should return values", async (): Promise<void> => {
        const result = await dashClass.productsInAllOrders(1);
        expect(result).toEqual([
            {
                name: "ball",
                price: 25,
                quantity: 20,
                order_id: 1
            }
        ]);
    });

    it("productsInOrder method should exist", (): void => {
        expect(dashClass.productsInOrder).toBeDefined();
    });
    it("productsInOrder should return all products associated with that order", async (): Promise<void> => {
        const result = await dashClass.productsInOrder(1);
        expect(result).toEqual([
            {
                name: "ball",
                price: 25,
                quantity: 20,
                order_id: 1
            }
        ]);
    });
});
