import { Middleware } from '@nuxt/types'

const middleware: Middleware = ({app}) => {
    app.$accessor.users.RESET();
};

export default middleware;
