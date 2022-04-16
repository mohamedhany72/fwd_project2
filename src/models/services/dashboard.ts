import Client from "../../database";

export class DashboardQueries {
    // Get all products that have been included in orders
    async productsInAllOrders(user_id: number | string): Promise<
        {
            name: string;
            price: number;
            quantity: number;
            order_id: string | number;
        }[]
    > {
        try {
            //@ts-ignore
            const conn = await Client.connect();
            const sql =
                "SELECT name, price, quantity, order_id FROM orders_products\
            INNER JOIN products ON products.id = orders_products.product_id\
            INNER JOIN orders on orders_products.order_id = orders.id\
            WHERE orders.user_id = $1";
            

            const result = await conn.query(sql, [user_id]);

            conn.release();

            return result.rows;
        } catch (err) {
            throw new Error(`unable get products and orders: ${err}`);
        }
    }

    // Get all products that have been included in orders
    async productsInOrder(id: number | string): Promise<
        {
            name: string;
            price: number;
            quantity: number;
            order_id: string | number;
        }[]
    > {
        try {
            //@ts-ignore
            const conn = await Client.connect();
            const sql =
                "SELECT name, price, quantity, order_id FROM orders_products \
            INNER JOIN products ON products.id = orders_products.id \
            WHERE orders_products.order_id = $1";

            const result = await conn.query(sql, [id]);

            conn.release();

            return result.rows;
        } catch (err) {
            throw new Error(`unable get products and order: ${err}`);
        }
    }
}
