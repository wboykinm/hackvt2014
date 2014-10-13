CREATE TABLE montpelier_hourly (
	ID text,
	DATE_TIME text,
	KWH_CONSUMED text,
	KWH_GENERATED text,
	GEN_TYPE text,
	LATITUDE text,
	LONGITUDE text
);

COPY 
	montpelier_hourly 
FROM 
	'/Users/wboykinm/Dropbox/Consulting/hackvt2014/montpelier-30days.csv' 
DELIMITER ',' CSV
;
