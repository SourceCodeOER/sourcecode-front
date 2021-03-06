import {actionTree, mutationTree} from "nuxt-typed-vuex";
import {Configuration, CreateConfigurationRequest} from "~/types";
import {AxiosError} from "axios";

export const state = () => ({
  favorites: [] as Configuration[],
  loaded:false
});

export const mutations = mutationTree(state, {
  INIT(state, configurations: Configuration[]) {
    state.favorites = configurations;
    state.loaded = true;
  },
  RESET(state) {
    state.favorites = [];
    state.loaded = false;
  },
  ADD_CONFIGURATION(state, configuration:Configuration) {
    state.favorites.push(configuration)
  },
  REMOVE_CONFIGURATION(state, id:number) {
    const index = state.favorites.findIndex(config => config.id === id);

    if(index !== -1) {
      state.favorites.splice(index, 1)
    }
  },
  UPDATE_CONFIGURATION(state, configuration:Configuration) {
    const index = state.favorites.findIndex(config => config.id === configuration.id);

    if(index !== -1) {
      state.favorites[index] = configuration;
    }
  }
});

export const actions = actionTree({state, mutations}, {
  async fetch({commit}) {
    try {
      const response: Configuration[] = await this.app.$axios.$get('/api/configurations');
      commit('INIT', response)
    } catch (e) {
      const errorAxios = e as AxiosError;

      if (errorAxios.response) {
        const status: number = errorAxios.response.status;

        if (status === 400) {
          this.$displayError("Une erreur est survenue.", {statusCode: status});
        } else if (status === 500) {
          this.$displayError(`Une erreur est survenue depuis nos serveurs, veuillez-nous en excuser.`, {statusCode: status});
        } else {
          this.$displayError("Une erreur est survenue.", {statusCode: status});
        }
      } else {
        this.$displayError("Une erreur est survenue.", {statusCode: 400});
      }

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
