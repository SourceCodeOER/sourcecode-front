import { getAccessorType } from 'nuxt-typed-vuex'

// Import all your submodules
import * as tags from '~/store/tags'


// This compiles to nothing and only serves to return the correct type of the accessor
export const accessorType = getAccessorType({
  modules: {
    // The key (submodule) needs to match the Nuxt namespace (e.g. ~/store/submodule.ts)
    tags
  },
})
