/** The browser's current position, or null when it's unsupported or the user declines. */
export async function getLocation (): Promise<{ lon: number, lat: number } | null> {
  return await new Promise((resolve) => {
    if (!('geolocation' in navigator)) {
      resolve(null)
      return
    }
    navigator.geolocation.getCurrentPosition(
      (position) => { resolve({ lat: position.coords.latitude, lon: position.coords.longitude }) },
      () => { resolve(null) },
      { timeout: 15000 }
    )
  })
}
