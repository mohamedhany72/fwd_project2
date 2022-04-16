import supertest from "supertest";
import app from "../../server";
import client from "../../database";
import { UserModel } from "../../models/user";
const userClass = new UserModel();

const request = supertest(app);

const resretId = async (): Promise<void> => {
    const sql = "ALTER SEQUENCE users_id_seq RESTART WITH 1;";
    // @ts-ignore
    const conn = await client.connect();
    await conn.query(sql);
    conn.release();
};

let token: string;
let badToken: string;

describe("Testing Routes: Users", (): void => {
    beforeAll(async (): Promise<void> => {
        await resretId();
    });
    afterAll(async (): Promise<void> => {
        await userClass.delete(1);
        await resretId();
    });

    it("creating user test", async (): Promise<void> => {
        const response = await request
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
        expect(response.status).toBe(200);
    });

    it("testing get user with invalid token", async (): Promise<void> => {
        const response = await request
            .get("/api/users/1")
            .set("authorization", badToken);
        expect(response.status).toBe(401);
    });

    it("testing get user with bad id and valid token", async (): Promise<void> => {
        const response = await request
            .get("/api/users/5")
            .set("authorization", token);
        expect(response.status).toBe(404);
    });

    it("testing get user with good id and valid token", async (): Promise<void> => {
        const response = await request
            .get("/api/users/1")
            .set("authorization", token);
        expect(response.status).toBe(200);
    });

    it("testing get all users with invalid token", async (): Promise<void> => {
        const response = await request
            .get("/api/users")
            .set("authorization", badToken);
        expect(response.status).toBe(401);
    });

    it("testing get all users with valid token", async (): Promise<void> => {
        const response = await request
            .get("/api/users")
            .set("authorization", token);
        expect(response.status).toBe(200);
    });
});
