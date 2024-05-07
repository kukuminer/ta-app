ALTER TABLE section ALTER COLUMN letter TYPE varchar(10);
-- If this migration gets skipped, ensure there are no views depending
-- on this data type. If there are any, they need to be droppped and remade.