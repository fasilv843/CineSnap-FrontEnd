/** Great-circle distance in kilometres between two [longitude, latitude] points (GeoJSON order). */
export function distanceKm ([lon1, lat1]: number[], [lon2, lat2]: number[]): number {
  const toRad = (deg: number): number => deg * Math.PI / 180
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2
  return 6371 * 2 * Math.asin(Math.sqrt(a))
}

export function formatDistance (km: number): string {
  return km < 1 ? `${Math.round(km * 1000)} m` : `${km < 10 ? km.toFixed(1) : Math.round(km)} km`
}
