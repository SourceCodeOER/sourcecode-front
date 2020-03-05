import { Middleware } from '@nuxt/types'

const middleware: Middleware = ({app}) => {
    app.$accessor.exercises.RESET();
    app.$accessor.tags.CLEAR();
};

export default middleware;
