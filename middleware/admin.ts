import { Middleware } from '@nuxt/types'

const middleware: Middleware = ({redirect, app, $auth}) => {
  const isAdmin = $auth.loggedIn && $auth.user && $auth.user.role === 'admin';
  if (!isAdmin) {
    redirect('/')
  }
};

export default middleware;
