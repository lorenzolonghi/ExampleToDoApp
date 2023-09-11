CREATE DATABASE todolist;
USE todolist;

CREATE TABLE users (
    pkuser int AUTO_INCREMENT,
    email varchar(60),
    password varchar(255),
    PRIMARY KEY (pkuser)
);

CREATE TABLE todo (
    pktodo int AUTO_INCREMENT,
    title varchar(60),
    completed int,
    fkuser int,
    PRIMARY KEY (pktodo),
    FOREIGN KEY (fkuser) REFERENCES users(pkuser)
);