# Welcome to my storefront project

  This project is the backend of the website

## package installation instructions and how to setup and connect to the database
node version: v16.14.2
1. download this code to run on a local machine
2. run "npm i" to install all dependancies
3. create .ENV file and add the following variables
    POSTGRES_HOST=127.0.0.1         
    POSTGRES_PORT=5432     
    POSTGRES_DB=db_name   
    POSTGRES_TEST_DB=test_db_name   
    POSTGRES_USER=user_name    
    POSTGRES_PASS=user_pass   
    ENV=dev   
    BCRYPT_PASSWORD=any_pass   
    SALT_ROUNDS=1   
    TOKEN_SECRET=tokensecret   


4. run "npm run migrateup" to migrate database tables



now you are ready to use the app

## Ports the backend and database are running on
backend: 3000

database: 5432

## For routes and schema see REQUIREMENTS.md
