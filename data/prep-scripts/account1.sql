CREATE TABLE account1 (
	id text,
	date_time text,
	Main text,
	DHW text,
	Dryer text,
	Range text,
	Outlet1 text,
	Outlet2 text,
	Washer text,
	NA text,
	Light1 text,
	Outlet3 text,
	HP text,
	Outlet4 text,
	Outlet5 text,
	Outlet6 text,
	CondP text,
	Outlet7 text,
	Light2 text,
	Vent text
);

COPY 
	account1
FROM 
	'/Users/wboykinm/Dropbox/Consulting/hackvt2014/net-zero-home-submetered-data/hackVT.acct1.csv' 
DELIMITER ',' CSV HEADER
;
