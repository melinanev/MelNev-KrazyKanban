-- DROP DATABASE
DROP DATABASE IF EXISTS kanban_db;

-- CREATE DATABASE
CREATE DATABASE kanban_db;
\c kanban_db

-- CREATE TABLES
-- First create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    CONSTRAINT unique_username
        UNIQUE (username)   
);

-- Then create tickets table with foreign key reference to users
CREATE TABLE tickets (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    todo TEXT NOT NULL,
    in_progress TEXT NOT NULL,
    done TEXT NOT NULL,
    assignedUserId INTEGER NOT NULL,
    CONSTRAINT fk_assigned_user
        FOREIGN KEY (assignedUserId)
        REFERENCES users(id)
);
 
 


    