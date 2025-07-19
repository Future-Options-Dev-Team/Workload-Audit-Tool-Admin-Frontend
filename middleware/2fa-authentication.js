export default function ({ app, redirect, from, route }) {
  if (
    route.path === '/auth/login'
    || route.path === '/auth/forgot-password'
    || route.path === '/auth/otp'
    || route.path === '/auth/password-reset/[*]'
  ) {
    return
  }
  if (app.$auth.loggedIn
    && app.$auth.user.settings.allow_two_factor_authentication
    && !app.$auth.user.otp_verified
  ) {
    return redirect('/auth/otp')
  }
}
