/** True when the JWT's exp claim has passed. A token that can't be read counts as expired. */
export function isTokenExpired (token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    if (typeof payload?.exp !== 'number') return false // no expiry claim
    return payload.exp * 1000 <= Date.now()
  } catch {
    return true
  }
}
