/* Replace with your SQL commands */
CREATE EXTENSION "uuid-ossp";
CREATE TABLE charpoints ( 
    id text NOT NULL PRIMARY KEY,
    x integer NOT NULL,
    y integer NOT NULL,
    point_type smallint NOT NULL,
    image_id text NOT NULL
);

