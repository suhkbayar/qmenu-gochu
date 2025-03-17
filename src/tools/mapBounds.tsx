export const calculateHardBounds = (
  polygonCoords: Array<{ lat: number; lng: number }>,
  lat: number,
  lng: number,
  fallbackLocation: { lat: number; lng: number },
) => {
  // Ray casting algorithm for point-in-polygon detection
  const isPointInPolygon = (point: { lat: number; lng: number }, polygon: Array<{ lat: number; lng: number }>) => {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].lng;
      const yi = polygon[i].lat;
      const xj = polygon[j].lng;
      const yj = polygon[j].lat;

      const intersect =
        yi > point.lat !== yj > point.lat && point.lng < ((xj - xi) * (point.lat - yi)) / (yj - yi) + xi;

      if (intersect) inside = !inside;
    }
    return inside;
  };

  // Calculate bounding box for efficiency
  const bounds = polygonCoords.reduce(
    (acc, coord) => ({
      north: Math.max(acc.north, coord.lat),
      south: Math.min(acc.south, coord.lat),
      east: Math.max(acc.east, coord.lng),
      west: Math.min(acc.west, coord.lng),
    }),
    {
      north: -90,
      south: 90,
      east: -180,
      west: 180,
    },
  );

  // First check if point is within bounding box (fast rejection)
  const isWithinBoundingBox = lat <= bounds.north && lat >= bounds.south && lng <= bounds.east && lng >= bounds.west;

  // Only perform detailed point-in-polygon check if within bounding box
  const isWithinBounds = isWithinBoundingBox && isPointInPolygon({ lat, lng }, polygonCoords);

  if (!isWithinBounds) {
    console.warn('Location is out of delivery bounds. Using fallback location.');
    return {
      isWithinBounds: false,
      center: fallbackLocation,
      bounds,
    };
  }

  return {
    isWithinBounds: true,
    center: { lat, lng },
    bounds,
  };
};

export const fallbackCenter = {
  lat: 47.9153187,
  lng: 106.8977819,
};
