CREATE TABLE outages (
	ID text,
	FEEDER_ID text,
	INCIDENT_ID text,
	TIME_OF_OUTAGE text,
	CAUSE_CODE text,
	CAUSE_DESCRIPTION text,
	CUSTOMER_COUNT text,
	TIME_RESTORED text,
	TIME_RESTORED_EST text,
	LATITUDE text,
	LONGITUDE text
);

COPY 
	outages 
FROM 
	'/Users/wboykinm/Dropbox/Consulting/hackvt2014/outages1.csv' 
DELIMITER ',' CSV
;
