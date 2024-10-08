-- transaction not needed here because it runs as a tx when loading
DO $$ BEGIN
    CREATE TYPE campus AS ENUM ('Keele', 'Glendon', 'Markham');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

ALTER TABLE section ADD COLUMN campus campus NOT NULL DEFAULT 'Keele';

ALTER TABLE application ADD COLUMN campus campus NOT NULL DEFAULT 'Keele';

ALTER TABLE application ADD UNIQUE (applicant, course, term, campus);

ALTER TABLE application DROP CONSTRAINT IF EXISTS application_applicant_course_term_key;