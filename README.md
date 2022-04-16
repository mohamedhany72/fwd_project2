# Welcome to my storefront project

  This project is the backend of the website

## package installation instructions and how to setup and connect to the database
1. create .ENV file and add the following variables
    POSTGRES_HOST=   
    POSTGRES_DB=   
    POSTGRES_TEST_DB=   
    POSTGRES_USER=    
    POSTGRES_PASS=   
    ENV=dev   
    BCRYPT_PASSWORD=   
    SALT_ROUNDS=   
    TOKEN_SECRET=   

2. run "npm i" to install all dependancies
3. run "npm migrate up" to migrate database tables

now you are ready to use the app

## Ports the backend and database are running on
backend: 3000

database: 5432

## For routes and schema see REQUIREMENTS.md
