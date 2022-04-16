# Welcome to my storefront project

  This project is the backend of the website

## package installation instructions and how to setup and connect to the database
node version: v16.14.2
1. download this code to run on a local machine
2. run "npm i" to install all dependancies
3. create .ENV file and add the following variables
    POSTGRES_HOST=127.0.0.1         
    POSTGRES_PORT=5432     
    POSTGRES_DB=storefront   
    POSTGRES_TEST_DB=storefront_test   
    POSTGRES_USER=sf_user    
    POSTGRES_PASS=password1234   
    ENV=dev   
    BCRYPT_PASSWORD=any_pass   
    SALT_ROUNDS=1   
    TOKEN_SECRET=tokensecret   


4. connect to the default postgres database as the server's root user: psql -U postgres
   create user: CREATE USER sf_user WITH PASSWORD 'password1234';
   create env db: CREATE DATABASE storefront;
   create test db: CREATE DATABASE storefront_test;
   Grant for dev db: 
      \c storefront
      GRANT ALL PRIVILEGES ON DATABASE storefront TO sf_user;
   Grant for test db:
      \c storefront_test
      GRANT ALL PRIVILEGES ON DATABASE storefront_test TO sf_user;


5. run "npm run migrateup" to migrate database tables



now you are ready to use the app

## Ports the backend and database are running on
backend: 3000

database: 5432

## For routes and schema see REQUIREMENTS.md
