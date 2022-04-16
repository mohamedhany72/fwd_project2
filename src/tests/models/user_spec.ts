import { UserModel, User } from "../../models/user";
import client from "../../database";

const userClass = new UserModel();

const userObj: User = {
    id: 1,
    firstname: "Mohamed",
    lastname: "Hany",
    password: "password"
};
const userReturned: User = {
    id: 1,
    firstname: "Mohamed",
    lastname: "Hany"
};
const resretId = async (): Promise<void> => {
    const sql = "ALTER SEQUENCE users_id_seq RESTART WITH 1;";
    // @ts-ignore
    const conn = await client.connect();
    await conn.query(sql);
    conn.release();
};

describe("Testing Model: user", () => {
    beforeAll(async (): Promise<void> => {
        await resretId();
    });
    afterAll(async (): Promise<void> => {
        await resretId();
    });

    it("index method should exist", (): void => {
        expect(userClass.create).toBeDefined();
    });
    it("index method should return empty array", async (): Promise<void> => {
        const result = await userClass.index();
        expect(result).toEqual([]);
    });

    it("create method should exist", (): void => {
        expect(userClass.create).toBeDefined();
    });
    it("create method should create the user", async (): Promise<void> => {
        const result = await userClass.create(userObj);
        const user: User = {
            id: result.id,
            firstname: result.firstname,
            lastname: result.lastname
        };
        expect(user).toEqual(userReturned);
    });

    it("index method should return the user array", async (): Promise<void> => {
        const result = await userClass.index();
        // const user: User[] = [
        //     {
        //         id: result[0].id,
        //         firstname: result[0].firstname,
        //         lastname: result[0].lastname
        //     }
        // ];
        expect(result).toEqual([userReturned]);
    });

    it("show method should exist", (): void => {
        expect(userClass.show).toBeDefined();
    });
    it("show method should return the user", async (): Promise<void> => {
        const result = await userClass.show(1);
        const user: User = {
            id: (result.user as User).id,
            firstname: (result.user as User).firstname,
            lastname: (result.user as User).lastname
        };
        expect(user).toEqual(userReturned);
    });

    it("delete method should exist", (): void => {
        expect(userClass.delete).toBeDefined();
    });
    it("delete method should delete the user", async (): Promise<void> => {
        await userClass.delete(1);
        const result = await userClass.index();
        expect(result).toEqual([]);
    });
});
