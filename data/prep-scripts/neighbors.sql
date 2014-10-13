WITH flattened AS (
	SELECT id,the_geom
	FROM neighbors
	GROUP BY id,the_geom
),

center AS (
	SELECT id,the_geom
	FROM customer
	GROUP BY id,the_geom
),

closest AS (
	SELECT c.id      
	FROM center c, flattened f
	ORDER BY c.the_geom <-> f.the_geom
	LIMIT 10
)

SELECT n.id,n.date_time,n.kwh_consumed,n.kwh_generated,n.gen_type,n.the_geom      
FROM neighbors n, closest c
WHERE n.id = c.id;
