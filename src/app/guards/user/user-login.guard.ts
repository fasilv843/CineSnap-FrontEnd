/* eslint-disable @typescript-eslint/semi */
import { Router, type CanActivateFn } from '@angular/router';

const router = new Router()

export const userLoginGuard: CanActivateFn = (route, state) => {
  const token = localStorage.getItem('userToken')
  if (token !== '') {
    void router.navigate(['/user/home'])
    return false
  }
  return true
};

export const userLogoutGuard: CanActivateFn = (route, state) => {
  console.log(route);
  console.log(state);
  const token = localStorage.getItem('userToken')
  if (token == null) {
    void router.navigate(['/'])
    return false
  }
  return true
}
