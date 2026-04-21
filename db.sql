--MySQL
CREATE TABLE users(
id SMALLINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
name VARCHAR(150) NOT NULL,
lastname VARCHAR(250) NOT NULL
);

CREATE TABLE tasks(
    id SMALLINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(250) NOT NULL,
    priority BOOLEAN NOT NULL,
    user_id SMALLINT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

--insertar 2 tareas
INSERT INTO tasks (name, description, priority, user_id) VALUES ('Tarea 1', 'Descripción de la tarea 1', true, 1);
INSERT INTO tasks (name, description, priority, user_id) VALUES ('Tarea 2', 'Descripción de la tarea 2', false, 1);

--insertar 1 usuario
INSERT INTO users (name, lastname) VALUES ('Juan', 'Pérez');


--POSTGRES
CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    lastname VARCHAR(250) NOT NULL
);

CREATE TABLE tasks(
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(250) NOT NULL,
    priority bool NOT NULL,
    user_id INTEGER REFERENCES users(id)
);