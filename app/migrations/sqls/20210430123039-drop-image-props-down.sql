/* Replace with your SQL commands */
ALTER TABLE images ADD COLUMN state text NOT NULL DEFAULT 'Todo';
ALTER TABLE images ADD COLUMN weight double precision NOT NULL DEFAULT 1.0;
ALTER TABLE images ADD COLUMN loss double precision;
ALTER TABLE images ADD COLUMN updated_at timestamp NOT NULL DEFAULT now();
ALTER TABLE images ADD COLUMN box_count integer NOT NULL DEFAULT 0;
ALTER TABLE images ADD COLUMN point_count integer NOT NULL DEFAULT 0;

ALTER TABLE boxes ADD COLUMN is_grand_truth boolean NOT NULL DEFAULT true;
ALTER TABLE points ADD COLUMN is_grand_truth boolean NOT NULL DEFAULT true;
ALTER TABLE points ADD COLUMN confidence double precision ;
