export default function ({ app, redirect, from, route }) {
  if (
    route.path === '/auth/login' ||
    route.path === '/profile' ||
    route.path === '/change-password' ||
    route.path === '/auth/password-reset/[*]'
  ) {
    return
  }

  if (app.$auth.loggedIn) {
    if (app.$auth.user.password_expired) {
      return redirect('/change-password')
    }
  }
}
