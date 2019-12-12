import {Exercise, MetadataResponse, SearchCriterion, SearchRequest, SearchResponse} from "~/types";
import {actionTree, getterTree, mutationTree} from "nuxt-typed-vuex";

export const state = () => ({
  /**
   * The exercises currently loaded
   */
  exercises: [] as Exercise[],
  /**
   * The metadata needed for retrieving exercises
   */
  metadata: {
    currentPage: 1,
    totalItems: 0,
    totalPages: 0,
    pageSize: 20
  } as MetadataResponse,
  /**
   * The search criterion composed by a title and tags id
   */
  search_criterion: {
    title: "",
    tags: []
  } as SearchCriterion
});

export const getters = getterTree(state, {
  /**
   * return true if there is exercises that can still be loaded, false otherwise
   * @param state
   */
  isRemainingPages: (state) => state.metadata.currentPage < state.metadata.totalPages
});

export const mutations = mutationTree(state, {
  /**
   * Initialization of the search criterion and metadata
   * @param state
   * @param data
   * @constructor
   */
  INIT(state, data: SearchResponse) {
    state.metadata = data.metadata;
    state.exercises = data.data
  },
  /**
   * Reset the parameters of the search request
   * @param state
   * @constructor
   */
  RESET(state) {
    state.exercises = [];
    state.metadata = {
      currentPage: 1,
      totalItems: 0,
      totalPages: 0,
      pageSize: state.metadata.pageSize
    }
  },
  /**
   * Set a new metadata object to replace the old one
   * @param state
   * @param metadata
   * @constructor
   */
  SET_METADATA(state, metadata: MetadataResponse) {
    state.metadata = metadata
  },
  /**
   * Add a list of exercises to the previous one
   * @param state
   * @param exercises
   * @constructor
   */
  ADD_EXERCISES(state, exercises: Exercise[]) {
    exercises.forEach(exercise => state.exercises.push(exercise))
  },
  /**
   * Set the new search criterion based on the new value of the title or of new tags
   * @param state
   * @param searchCriterion
   * @constructor
   */
  SET_SEARCH_CRITERION(state, searchCriterion: SearchCriterion | undefined) {
    if (!!searchCriterion) {
      if (!!searchCriterion.title || searchCriterion.title === '') state.search_criterion.title = searchCriterion.title;
      if (!!searchCriterion.tags) state.search_criterion.tags = searchCriterion.tags
    }
  }
});

export const actions = actionTree({state, mutations, getters}, {
  /**
   * Fetch a completely new set of exercises based on a searchRequest
   * @param commit
   * @param state
   * @param searchRequest
   */
  async fetch({commit, state}, searchRequest: SearchRequest) {

    const newSearchRequest:SearchRequest = {data: {...state.search_criterion, ...searchRequest.data}, metadata: {size: state.metadata.pageSize}};
    try {
      const response: SearchResponse = await this.app.$axios.$post('/api/search', newSearchRequest);
      commit('INIT', response);
      commit('SET_SEARCH_CRITERION', searchRequest.data)
    } catch (e) {
      commit('RESET')
    }
  },
  /**
   * Fetch the next exercises based on the exact same SearchRequest
   * @param commit
   * @param state
   */
  async next({commit, state}) {

    const request: SearchRequest = {
      metadata: {
        page: state.metadata.currentPage + 1,
        size: state.metadata.pageSize
      },
      data: {
        ...state.search_criterion
      }
    };

    try {
      const response: SearchResponse = await this.app.$axios.$post('/api/search', request);
      commit('ADD_EXERCISES', response.data);
      commit('SET_METADATA', response.metadata);
    } catch (e) {
      commit('RESET')
    }
  }
});
