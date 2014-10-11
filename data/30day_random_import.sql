CREATE TABLE random_meters (
	ID text,
	DATE_TIME text,
	KWH_CONSUMED text,
	KWH_GENERATED text,
	GEN_TYPE text,
	LATITUDE text,
	LONGITUDE text
);

COPY 
	random_meters 
FROM 
	'/Users/wboykinm/Dropbox/Consulting/hackvt2014/30days-daily-service-area.csv' 
DELIMITER ',' CSV HEADER
;
