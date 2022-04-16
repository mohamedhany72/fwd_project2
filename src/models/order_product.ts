import client from "../database";

export type OrderProduct = {
    id?: number | string;
    order_id: number;
    product_id: number;
    quantity: number;
};

export class OrderProductModel {
    async index(): Promise<OrderProduct[]> {
        try {
            const sql = "SELECT * FROM public.orders_products;";
            // @ts-ignore
            const conn = await client.connect();
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        } catch (err) {
            throw new Error(`error get all products_orders ${err}`);
        }
    }

    async show(id: string | number): Promise<OrderProduct> {
        try {
            const sql = "SELECT * FROM public.orders_products WHERE id=$1;";
            // @ts-ignore
            const conn = await client.connect();
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`error get product_order ${err}`);
        }
    }

    async create(po: OrderProduct): Promise<OrderProduct> {
        try {
            const sql =
                "INSERT INTO public.orders_products(\
                    order_id, product_id, quantity)\
                    VALUES ( $1, $2, $3) RETURNING *;";
            // @ts-ignore
            const conn = await client.connect();
            const result = await conn.query(sql, [
                po.order_id,
                po.product_id,
                po.quantity
            ]);
            const product = result.rows[0];

            conn.release();
            return product;
        } catch (err) {
            throw new Error(`error create product_order ${err}`);
        }
    }


    async delete(id: string | number): Promise<OrderProduct> {
        try {
            const sql = "DELETE FROM public.orders_products WHERE id=$1;";
            // @ts-ignore
            const conn = await client.connect();
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`error delete product from order ${err}`);
        }
    }
}
