/* Replace with your SQL commands */
ALTER TABLE images DROP COLUMN state;
ALTER TABLE images DROP COLUMN weight;
ALTER TABLE images DROP COLUMN loss;
ALTER TABLE images DROP COLUMN point_count;
ALTER TABLE images DROP COLUMN box_count;
ALTER TABLE images DROP COLUMN updated_at;

ALTER TABLE boxes DROP COLUMN is_grand_truth;
ALTER TABLE points DROP COLUMN is_grand_truth;
ALTER TABLE points DROP COLUMN confidence;
