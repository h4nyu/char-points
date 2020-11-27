/* Replace with your SQL commands */
CREATE INDEX points_image_id_idx ON points (image_id);

CREATE TABLE boxes ( 
    x0 double precision NOT NULL,
    y0 double precision NOT NULL,
    x1 double precision NOT NULL,
    y1 double precision NOT NULL,
    image_id text NOT NULL,
    label text
);
CREATE INDEX boxes_image_id_idx ON boxes (image_id);
