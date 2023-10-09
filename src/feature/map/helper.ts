export function calculateBearing(pointA: L.LatLng, pointB: L.LatLng) {
  const lat1 = pointA.lat * (Math.PI / 180);
  const lat2 = pointB.lat * (Math.PI / 180);
  const lon1 = pointA.lng * (Math.PI / 180);
  const lon2 = pointB.lng * (Math.PI / 180);

  const y = Math.sin(lon2 - lon1) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);
  let bearing = Math.atan2(y, x) * (180 / Math.PI);

  if (bearing < 0) {
    bearing += 360;
  }

  return bearing;
}
