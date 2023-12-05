// Function to check is passed jwt token is expired or not
export function isTokenExpired (token: string): boolean {
  const payload = JSON.parse(atob(token.split('.')[1]))
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (payload?.exp) {
    const expireTime = payload.exp * 1000
    if (expireTime > Date.now()) return false
    console.warn('token is expired')
    return true
  }

  console.warn('Token don\'t have expiration date')
  return false
}

// Extracts jwt token payload
export function parseJwt (token: string): any {
  const base64Url = token.split('.')[1]
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  const jsonPayload = decodeURIComponent(atob(base64))

  return JSON.parse(jsonPayload)
}
