import client from "../database";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const pepper = process.env.BCRYPT_PASSWORD;
const saltRounds = process.env.SALT_ROUNDS;

export type User = {
    id?: number | string;
    firstname?: string;
    lastname?: string;
    password?: string;
};

export type ReturnJson = {
    success: number;
    msg?: string;
    user?: User;
};

export class UserModel {
    async create(u: User): Promise<User> {
        const hash = bcrypt.hashSync(
            u.password + (pepper as string),
            parseInt(saltRounds as string)
        );
        const sql =
            "INSERT INTO public.users(\
                firstname, lastname, password)\
                VALUES ( $1, $2, $3) RETURNING *";
        try {
            // @ts-ignore
            const conn = await client.connect();
            const result = await conn.query(sql, [
                u.firstname,
                u.lastname,
                hash
            ]);
            const user = result.rows[0];
            conn.release();
            return user;
        } catch (err) {
            throw new Error(
                `Could not add user ${u.firstname} ${u.lastname}. Error: ${err}`
            );
        }
    }


    async index(): Promise<User[]> {
        const sql = "SELECT id, firstname, lastname FROM public.users;";
        try {
            // @ts-ignore
            const conn = await client.connect();

            const result = await conn.query(sql);

            const users = result.rows;

            conn.release();
            return users;
        } catch (err) {
            throw new Error(`error getting users: ${err}`);
        }
    }

    async show(id: string | number): Promise<{ success: number; user?: User }> {
        const sql = "SELECT * FROM public.users WHERE id=$1;";
        try {
            // @ts-ignore
            const conn = await client.connect();

            const result = await conn.query(sql, [id]);
            conn.release();

            if (result.rows.length) {
                const user = result.rows[0];
                return { success: 1, user: user };
            }
            return { success: 0 };
        } catch (err) {
            throw new Error(`error getting user: ${err}`);
        }
    }

    async delete(id: string | number): Promise<User> {
        const sql = "DELETE FROM public.users WHERE id=$1;";
        try {
            // @ts-ignore
            const conn = await client.connect();

            const result = await conn.query(sql, [id]);

            const user = result.rows[0];

            conn.release();
            return user;
        } catch (err) {
            throw new Error(`error deleting user: ${err}`);
        }
    }
}
