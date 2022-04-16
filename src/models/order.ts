import client from "../database";

export type Order = {
    id?: number | string;
    user_id: number;
    status: string;
};

export class OrderModel {
    // select all the orders
    async index(): Promise<Order[]> {
        try {
            const sql = "SELECT * FROM public.orders;";
            // @ts-ignore
            const conn = await client.connect();
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        } catch (err) {
            throw new Error(`error get orders ${err}`);
        }
    }

    // select single order
    async show(
        id: string | number
    ): Promise<{ success: number; order?: Order }> {
        try {
            const sql = "SELECT * FROM public.orders WHERE id=$1;";
            // @ts-ignore
            const conn = await client.connect();
            const result = await conn.query(sql, [id]);
            conn.release();
            // return result.rows[0];
            if (result.rows.length) {
                return {
                    success: 1,
                    order: result.rows[0]
                };
            }
            return { success: 0 };
        } catch (err) {
            throw new Error(`error get order ${err}`);
        }
    }

    // create order
    async create(o: Order): Promise<Order> {
        try {
            const sql =
                "INSERT INTO public.orders(\
                    user_id, status)\
                    VALUES ($1, $2) RETURNING *;";
            // @ts-ignore
            const conn = await client.connect();
            const result = await conn.query(sql, [o.user_id, o.status]);
            const weapon = result.rows[0];

            conn.release();
            return weapon;
        } catch (err) {
            throw new Error(`error create order ${err}`);
        }
    }

    // update order
    async updateStatus(id: number | string, status: string): Promise<Order> {
        try {
            const sql =
                "UPDATE public.orders\
                SET status=$1\
                WHERE id=$2 RETURNING *;";
            // @ts-ignore
            const conn = await client.connect();
            const result = await conn.query(sql, [status, id]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`error update order ${err}`);
        }
    }

    // delete an order
    async delete(id: string | number): Promise<Order> {
        try {
            const sql = "DELETE FROM public.orders WHERE id=($1);";
            // @ts-ignore
            const conn = await client.connect();
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`error delete order ${err}`);
        }
    }
}
