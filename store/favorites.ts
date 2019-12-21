import {actionTree, mutationTree} from "nuxt-typed-vuex";
import {Configuration} from "~/types";

export const state = () => ({
  favorites: [] as Configuration[]
});

export const mutations = mutationTree(state, {
  INIT(state, configurations: Configuration[]) {
    state.favorites = configurations
  },
  RESET(state) {
    state.favorites = []
  }
});

export const actions = actionTree({state, mutations}, {
  async fetch({commit}) {
    try {
      const response: Configuration[] = await this.app.$axios.$get('/api/configurations');
      commit('INIT', response)
    } catch (e) {
      commit('RESET')
    }
  }
});
