/* Replace with your SQL commands */
ALTER TABLE images DROP COLUMN loss;
ALTER TABLE images DROP COLUMN updated_at;

ALTER TABLE images DROP COLUMN box_count;
ALTER TABLE images ADD COLUMN has_box boolean NOT NULL DEFAULT FALSE;
ALTER TABLE images DROP COLUMN point_count;
ALTER TABLE images ADD COLUMN has_point boolean NOT NULL DEFAULT FALSE;

ALTER TABLE boxes DROP COLUMN is_grand_truth;
ALTER TABLE points DROP COLUMN is_grand_truth;
ALTER TABLE points DROP COLUMN confidence;
