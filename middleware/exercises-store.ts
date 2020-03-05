import { Middleware } from '@nuxt/types'

const allowedRoutesName:string[] = ['exercices', 'exercices-id'];

const middleware: Middleware = ({from, app}) => {
  if (process.client && from.name && !allowedRoutesName.includes(from.name)) {
    app.$accessor.exercises.RESET();
    app.$accessor.tags.CLEAR();
  }
};

export default middleware;
