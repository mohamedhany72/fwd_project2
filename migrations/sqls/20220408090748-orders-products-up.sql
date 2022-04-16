CREATE TABLE IF NOT EXISTS public.orders_products
(
    id SERIAL PRIMARY KEY,
    order_id integer,
    product_id integer,
    quantity integer,
    CONSTRAINT orders_id_fk FOREIGN KEY (order_id)
        REFERENCES public.orders (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT products_id_fk FOREIGN KEY (product_id)
        REFERENCES public.products (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE SET NULL
);

ALTER TABLE IF EXISTS public.orders_products
    OWNER to fwd_user;