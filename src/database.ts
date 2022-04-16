import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

const {
    POSTGRES_HOST,
    POSTGRES_DB,
    POSTGRES_PORT,
    POSTGRES_TEST_DB,
    POSTGRES_USER,
    POSTGRES_PASS,
    ENV
} = process.env;

let client: Pool | undefined;

if (ENV === "dev") {
    client = new Pool({
        host: POSTGRES_HOST,
        port: (POSTGRES_PORT as unknown) as number,
        database: POSTGRES_DB,
        user: POSTGRES_USER,
        password: POSTGRES_PASS
    });
}

if (ENV === "test") {
    client = new Pool({
        host: POSTGRES_HOST,
        port: (POSTGRES_PORT as unknown) as number,
        database: POSTGRES_TEST_DB,
        user: POSTGRES_USER,
        password: POSTGRES_PASS
    });
}

export default client;
