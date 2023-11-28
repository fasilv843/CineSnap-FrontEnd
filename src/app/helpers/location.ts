/* eslint-disable @typescript-eslint/strict-boolean-expressions */
export async function getLocation (): Promise<{ lon: number, lat: number } | null> {
  console.log('getting location, radio clicked')

  return await new Promise((resolve) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude
          const lon = position.coords.longitude
          console.log(lat, lon)
          resolve({ lon, lat })
        },
        () => { resolve(null) }
      )
    } else {
      console.log('No support for geolocation')
      resolve(null)
    }
  })
}
