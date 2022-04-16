import supertest from "supertest";
import app from "../server";

const request = supertest(app);

describe("Testing Routes: main page", (): void => {
    it("get the main page", async (): Promise<void> => {
        const response = await request.get("/");
        expect(response.status).toBe(200);
    });
    it("get api page", async (): Promise<void> => {
        const response = await request.get("/api");
        expect(response.status).toBe(200);
    });
});
