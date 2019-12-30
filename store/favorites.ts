import {actionTree, mutationTree} from "nuxt-typed-vuex";
import {Configuration, CreateConfigurationRequest} from "~/types";

export const state = () => ({
  favorites: [] as Configuration[]
});

export const mutations = mutationTree(state, {
  INIT(state, configurations: Configuration[]) {
    state.favorites = configurations
  },
  RESET(state) {
    state.favorites = []
  },
  ADD_CONFIGURATION(state, configuration:Configuration) {

  }
});

export const actions = actionTree({state, mutations}, {
  async fetch({commit}) {
    try {
      const response: Configuration[] = await this.app.$axios.$get('/api/configurations');
      console.log(response);
      commit('INIT', response)
    } catch (e) {
      commit('RESET')
    }
  },
  async createFavorite({commit}, favorite:CreateConfigurationRequest) {
    try {
      await this.app.$axios.$post('/api/configurations', favorite);
      const response: Configuration[] = await this.app.$axios.$get('/api/configurations');
      commit('INIT', response)
    } catch (e) {
      commit('RESET')
    }
  }
});
