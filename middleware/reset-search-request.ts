import { Middleware } from '@nuxt/types'

const middleware: Middleware = ({app}) => {
    app.$accessor.search.RESET_SEARCH_CRITERION();
    app.$accessor.tags.CLEAR();
};

export default middleware;
