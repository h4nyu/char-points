/* Replace with your SQL commands */
ALTER TABLE boxes ADD COLUMN id uuid PRIMARY KEY DEFAULT uuid_generate_v4();
ALTER TABLE points ADD COLUMN id uuid PRIMARY KEY DEFAULT uuid_generate_v4();
