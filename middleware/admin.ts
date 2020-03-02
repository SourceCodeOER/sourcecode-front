import { Middleware } from '@nuxt/types'

const middleware: Middleware = ({redirect, app, $auth}) => {
  const isAdmin = $auth.loggedIn && $auth.user && $auth.user.role === 'admin' || $auth.user.role === 'super_admin';
  if (!isAdmin) {
    redirect('/')
  }
};

export default middleware;
