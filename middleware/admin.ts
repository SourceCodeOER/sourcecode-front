import { Middleware } from '@nuxt/types'

const middleware: Middleware = ({redirect, app, $auth}) => {
  const isAdmin = $auth.loggedIn && $auth.user && ['admin', 'super_admin'].includes($auth.user.role);
  if (!isAdmin) {
    redirect('/')
  }
};

export default middleware;
