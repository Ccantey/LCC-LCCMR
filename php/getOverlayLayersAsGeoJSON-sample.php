<?php
 
//database login info
# Connect to PostgreSQL database
$conn = new PDO('pgsql:host=####;dbname=####','####','####'); 


//Here is the complex SQL to return all legislators:
//will have to do some phanagling to return appropriately formated data.
$sql = 'SELECT lccmrid, acres, origpurch, owner, eashold, contact, purchdate, type, title, county, notes, 
        public.ST_AsGeoJSON(public.ST_Transform((ST_Centroid(geom)),4326),6) AS geojson 
        FROM landacq_03192015';

$rs = $conn->query($sql);
if (!$rs) {
    echo 'An SQL error occured.\n';
    exit;
}
# Build GeoJSON feature collection array
$geojson = array(
   'type'      => 'FeatureCollection',
   'features'  => array()
);

# Loop through rows to build feature arrays
while ($row = $rs->fetch(PDO::FETCH_ASSOC)) {
    $properties = $row;
    # Remove geojson and geometry fields from properties
    unset($properties['geojson']);
    unset($properties['the_geom']);
    $feature = array(
         'type' => 'Feature',
         'geometry' => json_decode($row['geojson'], true),
         'properties' => $properties
    );
    # Add feature arrays to feature collection array
    array_push($geojson['features'], $feature);
}

header('Content-type: application/json');
echo json_encode($geojson, JSON_NUMERIC_CHECK  );
$conn = NULL;
?>
