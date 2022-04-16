import { OrderModel, Order } from "../../models/order";
import client from "../../database";
import { UserModel } from "../../models/user";

const orderClass = new OrderModel();
const userClass = new UserModel();

const order: Order = {
    id: 1,
    user_id: 1,
    status: "active"
};

const resetIds = async (): Promise<void> => {
    const sql =
        "ALTER SEQUENCE users_id_seq RESTART WITH 1;\
    ALTER SEQUENCE orders_id_seq RESTART WITH 1;";
    // @ts-ignore
    const conn = await client.connect();
    await conn.query(sql);
    conn.release();
};

describe("Testing Model: Order", (): void => {
    beforeAll(async (): Promise<void> => {
        // reset ids
        await resetIds();

        // make new user
        await userClass.create({
            firstname: "Mohamed",
            lastname: "Hany",
            password: "password"
        });
    });
    afterAll(async (): Promise<void> => {
        // delete user
        await userClass.delete(1);

        // reset ids
        await resetIds();
    });

    it("index method should exist", (): void => {
        expect(orderClass.index).toBeDefined();
    });
    it("index method should return empty array", async (): Promise<void> => {
        const result = await orderClass.index();
        expect(result).toEqual([]);
    });

    it("create method should exist", (): void => {
        expect(orderClass.create).toBeDefined();
    });
    it("create method should create the order", async (): Promise<void> => {
        const result = await orderClass.create(order);
        expect(result).toEqual(order);
    });

    it("index method should return order in array", async (): Promise<void> => {
        const result = await orderClass.index();
        expect(result).toEqual([order]);
    });

    it("show method should exist", (): void => {
        expect(orderClass.show).toBeDefined();
    });
    it("show method should return the order", async (): Promise<void> => {
        const result = await orderClass.show(1);
        expect(result.order).toEqual(order);
    });

    it("update status method should exist", (): void => {
        expect(orderClass.updateStatus).toBeDefined();
    });
    it("update status method should update the order", async (): Promise<void> => {
        const result = await orderClass.updateStatus(1, "complete");
        expect(result).toEqual({
            id: 1,
            user_id: 1,
            status: "complete"
        });
    });

    it("delete method should exist", (): void => {
        expect(orderClass.delete).toBeDefined();
    });
    it("delete method should delete the order", async (): Promise<void> => {
        await orderClass.delete(1);
        const result = await orderClass.index();
        expect(result).toEqual([]);
    });
});
