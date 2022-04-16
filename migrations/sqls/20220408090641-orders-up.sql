CREATE TABLE IF NOT EXISTS public.orders
(
    id SERIAL PRIMARY KEY,
    user_id integer,
    status character varying(100),
    CONSTRAINT users_id_fk FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

ALTER TABLE IF EXISTS public.orders
    OWNER to fwd_user;