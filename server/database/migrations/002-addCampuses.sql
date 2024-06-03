-- transaction not needed here because it runs as a tx when loading
CREATE TYPE campus AS ENUM ('keele', 'glendon', 'markham');

ALTER TABLE section ADD COLUMN campus campus NOT NULL DEFAULT 'keele';

ALTER TABLE application ADD COLUMN campus campus NOT NULL DEFAULT 'keele';

ALTER TABLE application ADD UNIQUE (applicant, course, term, campus);

ALTER TABLE application DROP CONSTRAINT IF EXISTS application_applicant_course_term_key;