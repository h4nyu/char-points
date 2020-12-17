/* Replace with your SQL commands */
UPDATE images SET has_box = false  WHERE has_box IS NULL;
ALTER TABLE images ALTER COLUMN has_box SET NOT NULL;
UPDATE images SET has_point = false  WHERE has_point IS NULL;
ALTER TABLE images ALTER COLUMN has_point SET NOT NULL;
