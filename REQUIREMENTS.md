# Information about routes (handlers) and schema

## Routes in the app
1. / 
  the main url of the app
  it takes no params or body variabes and don't need authentication

2. /api
  the api route
  it takes no params or body variabes and don't need authentication
  
3. /api/users
  users route
  requests
  1. get: /api/users/:id (show the user - require authentication token)
  2. get: /api/users (show all users - require authentication token)
  3. post: /api/users/signup (create user - doesn't require authentication)
    need to pass (firstname, lastname, password) in request's body
    returns a valid token to use later in authentication

4. /api/products
  products route
  requests:
  1. get: /api/products/ (get all products)
  2. get: /api/products/:id (get product by id)
  3. post: /api/products/ (create product - require authentication token)
    need to pass (name, price) in request's body
    returns the created product

5. /api/orders
  orders route
  1. post: /api/orders/ (create order - require authentication token)
    need to pass ids and quantities of products as array in request body [{id:1, quantity:1},{id:2, quantity: 2},...]
    returns the created order
  2.put: /api/orders/ (change order status from active to complete - require authentication token - user must own the order)

6. /api/dashboard
  dashboard route
  1.get: /api/dashboard/:id (get all products in a single order owned by the user - :id -> order id - require authentication token)
  2.get: /api/dashbaord/ (get all products in all orders owned by the user - require authentication token)
  

## schema

CREATE TABLE IF NOT EXISTS public.users
(
    id SERIAL PRIMARY KEY,
    firstname character varying(100),
    lastname character varying(100),
    password character varying(200)
);

ALTER TABLE IF EXISTS public.users
    OWNER to fwd_user;
    
    
CREATE TABLE IF NOT EXISTS public.products
(
    id SERIAL PRIMARY KEY,
    name character varying(100),
    price integer
);

ALTER TABLE IF EXISTS public.products
    OWNER to fwd_user;
    
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
  

