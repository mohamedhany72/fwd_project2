import client from "../database";

export type Product = {
    id?: number | string;
    name: string;
    price: number;
};

export class ProductModel {
    // select all the products
    async index(): Promise<Product[]> {
        try {
            const sql = "SELECT * From public.products;";
            // @ts-ignore
            const conn = await client.connect();
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        } catch (err) {
            throw new Error(`error get weapons ${err}`);
        }
    }

    // select single product
    async show(
        id: string | number
    ): Promise<{ success: number; product?: Product }> {
        try {
            const sql = "SELECT * FROM public.products WHERE id=$1;";
            // @ts-ignore
            const conn = await client.connect();
            const result = await conn.query(sql, [id]);
            conn.release();
            if (result.rows.length) {
                return {
                    success: 1,
                    product: result.rows[0]
                };
            }
            return { success: 0 };
        } catch (err) {
            throw new Error(`error get product ${err}`);
        }
    }

    // create product
    async create(p: Product): Promise<Product> {
        try {
            const sql =
                "INSERT INTO public.products(\
                    name, price)\
                    VALUES ( $1, $2) RETURNING *;";
            // @ts-ignore
            const conn = await client.connect();
            const result = await conn.query(sql, [p.name, p.price]);
            const product = result.rows[0];

            conn.release();
            return product;
        } catch (err) {
            throw new Error(`error create product ${err}`);
        }
    }

    async delete(id: string | number): Promise<Product> {
        try {
            const sql = "DELETE FROM public.products WHERE id=($1);";
            // @ts-ignore
            const conn = await client.connect();
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`error delete product ${err}`);
        }
    }
}
