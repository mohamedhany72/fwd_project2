CREATE TABLE IF NOT EXISTS public.users
(
    id SERIAL PRIMARY KEY,
    firstname character varying(100),
    lastname character varying(100),
    password character varying(200)
);

ALTER TABLE IF EXISTS public.users
    OWNER to fwd_user;