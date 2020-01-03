import { Middleware } from '@nuxt/types'

const allowedRoutesName:string[] = ['gestion-mes-favoris-id'];
// @ts-ignore
const middleware: Middleware = ({from, app}) => {

  if (process.client && allowedRoutesName.findIndex((el) => el === from.name) === -1) {
    app.$accessor.search.RESET_SEARCH_CRITERION()
    app.$accessor.tags.CLEAR()
  }
};

export default middleware;