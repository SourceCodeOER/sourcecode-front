import { Middleware } from '@nuxt/types'

const middleware: Middleware = ({app}) => {
    app.$accessor.search.RESET();
    app.$accessor.tags.CLEAR();
};

export default middleware;
