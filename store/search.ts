import {Exercise, MetadataResponse, SearchCriterion, SearchRequest, SearchResponse} from "~/types";
import {actionTree, getterTree, mutationTree} from "nuxt-typed-vuex";

export const state = () => ({
  exercises: [] as Exercise[],
  metadata: {
    currentPage: 1,
    totalItems: 0,
    totalPages: 0,
    pageSize: 10
  } as MetadataResponse,
  search_criterion: {
    title: "",
    tags: []
  } as SearchCriterion
});

export const getters = getterTree(state, {
  isRemainingPages: (state) => state.metadata.currentPage < state.metadata.totalPages
});

export const mutations = mutationTree(state, {
  INIT(state, data: SearchResponse) {
    state.metadata = data.metadata;
    state.exercises = data.data
  },
  RESET(state) {
    state.exercises = [];
    state.metadata = {
      currentPage: 1,
      totalItems: 0,
      totalPages: 0,
      pageSize: 10
    }
  },
  SET_METADATA(state, metadata: MetadataResponse) {
    state.metadata = metadata
  },
  ADD_EXERCISES(state, exercises: Exercise[]) {
    exercises.forEach(exercise => state.exercises.push(exercise))
  },
  SET_SEARCH_CRITERION(state, searchCriterion: SearchCriterion | undefined) {
    if (!!searchCriterion) {
      if (!!searchCriterion.title) state.search_criterion.title = searchCriterion.title
      if (!!searchCriterion.tags) state.search_criterion.tags = searchCriterion.tags
    }
  }
});

export const actions = actionTree({state, mutations, getters}, {
  async fetch({commit, state}, searchRequest: SearchRequest) {
    const newSearchRequest:SearchRequest = {...searchRequest};
    try {
      const response: SearchResponse = await this.app.$axios.$post('/api/search', searchRequest);
      console.log(response);
      commit('INIT', response);
      commit('SET_SEARCH_CRITERION', searchRequest.data)
    } catch (e) {
      commit('RESET')
    }
  },
  async next({commit, state}) {

    const request: SearchRequest = {
      metadata: {
        page: state.metadata.currentPage + 1
      },
      data: {
        ...state.search_criterion
      }
    };

    try {
      const response: SearchResponse = await this.app.$axios.$post('/api/search', request);
      console.log(response);
      commit('ADD_EXERCISES', response.data);
      commit('SET_METADATA', response.metadata);
    } catch (e) {
      commit('RESET')
    }
  }
});
