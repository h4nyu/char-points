/* Replace with your SQL commands */
CREATE EXTENSION "uuid-ossp";
CREATE TABLE char_points ( 
    id text NOT NULL PRIMARY KEY,
    x integer NOT NULL,
    y integer NOT NULL,
    point_type smallint NOT NULL,
    image_id text NOT NULL
);

CREATE TABLE char_images ( 
    id text NOT NULL PRIMARY KEY,
    data bytea NOT NULL,
    created_at timestamp NOT NULL
);

