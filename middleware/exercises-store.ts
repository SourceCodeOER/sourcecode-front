import { Middleware } from '@nuxt/types'

const allowedRoutesName:string[] = ['exercices', 'exercices-id'];
// @ts-ignore
const middleware: Middleware = ({from, app}) => {

  if (process.client && allowedRoutesName.findIndex((el) => el === from.name) === -1) {
    app.$accessor.search.RESET();
    app.$accessor.tags.CLEAR();
  }
};

export default middleware;
