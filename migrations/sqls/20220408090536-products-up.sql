CREATE TABLE IF NOT EXISTS public.products
(
    id SERIAL PRIMARY KEY,
    name character varying(100),
    price integer
);

ALTER TABLE IF EXISTS public.products
    OWNER to fwd_user;