import {actionTree, getAccessorType, mutationTree} from 'nuxt-typed-vuex'

// Import all your submodules
import * as tags from '~/store/tags'
import * as historical from '~/store/historical'
import * as search from '~/store/search'
import * as favorites from '~/store/favorites'
import * as users from '~/store/users'
import {Environment} from "~/types";


/*
  Import the shared environment variables between server and client
 */
const getSharedEnv = () =>
  process.server
    ? require('~/server/utils/sharedEnv') || {}
    : {};

export const state = () => ({
  sharedEnv: {} as Environment
});

export const mutations = mutationTree(state, {
  setSharedEnv (state, content) {
    state.sharedEnv = content
  }
});

export const actions = actionTree({state, mutations}, {
  async nuxtServerInit ({ commit }) {
    if (process.server) {
      commit('setSharedEnv', getSharedEnv())
    }
  }
});


// This compiles to nothing and only serves to return the correct type of the accessor
export const accessorType = getAccessorType({
  state,
  mutations,
  actions,
  modules: {
    // The key (submodule) needs to match the Nuxt namespace (e.g. ~/store/submodule.ts)
    tags,
    historical,
    search,
    favorites,
    users
  },
});
