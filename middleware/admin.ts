import { Middleware } from '@nuxt/types'
import {User} from "~/assets/js/api/user";

const middleware: Middleware = ({redirect, app, $auth}) => {
  const isAdmin = $auth.loggedIn && $auth.user && [User.ADMIN, User.SUPER_ADMIN].includes($auth.user.role);
  if (!isAdmin) {
    redirect('/')
  }
};

export default middleware;
