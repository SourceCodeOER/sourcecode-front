import {
  Exercise,
  MetadataSearchExerciseRequest,
  MetadataSearchExerciseResponse,
  DataSearchExerciseRequest,
  SearchExerciseRequest,
  SearchExerciseResponse, IncludeOptionsExerciseRequest, VoteExerciseRequest, OrderByExerciseRequest, Category
} from "~/types";
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
  } as MetadataSearchExerciseResponse,
  /**
   * The search criterion composed by a title and tags id
   */
  search_criterion: {
    title: "",
    tags: []
  } as DataSearchExerciseRequest,
  includeOptions: {} as IncludeOptionsExerciseRequest,
  orderBy: [] as OrderByExerciseRequest[]
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
  INIT(state, data: SearchExerciseResponse) {
    state.metadata = data.metadata;
    state.exercises = data.data;
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
    };
    state.includeOptions = {};
    state.orderBy = [];
    state.search_criterion = {
      title: "",
      tags: []
    };
  },
  /**
   * Reset the search criterion with default values
   * @param state
   * @constructor
   */
  RESET_SEARCH_CRITERION(state) {
    state.search_criterion = {
      tags: [],
      title: ''
    };
  },
  RESET_VOTE(state) {
    delete state.search_criterion.vote
  },
  RESET_STATE(state) {
    delete state.search_criterion.state
  },
  /**
   * Set a new metadata object to replace the old one
   * @param state
   * @param metadata
   * @constructor
   */
  SET_METADATA(state, metadata: MetadataSearchExerciseResponse) {
    state.metadata = metadata
  },
  /**
   * Set a new search criterion
   * @param state
   * @param search_criterion
   * @constructor
   */
  SET_SEARCH_CRITERION(state, search_criterion: DataSearchExerciseRequest) {
    state.search_criterion = search_criterion
  },
  /**
   * Add a list of exercises to the previous one
   * @param state
   * @param exercises
   * @constructor
   */
  ADD_EXERCISES(state, exercises: Exercise[]) {
    exercises.forEach(exercise => state.exercises.push(exercise));
  },
  /**
   * Set the new search criterion based on the new value of the title or of new tags
   * @param state
   * @param searchCriterion
   * @constructor
   */
  UPDATE_SEARCH_CRITERION(state, searchCriterion: DataSearchExerciseRequest | undefined) {
    state.search_criterion = {...state.search_criterion, ...searchCriterion};
  },
  UPDATE_INCLUDE_OPTIONS(state, includeOptions: IncludeOptionsExerciseRequest | undefined) {
    state.includeOptions = {...state.includeOptions, ...includeOptions}
  },
  UPDATE_ORDER_BY(state, orderBy: OrderByExerciseRequest[] | undefined) {

    if (orderBy) {
      const stateOrderBy: OrderByExerciseRequest[] = state.orderBy;
      const notOverwriteOrderBy: OrderByExerciseRequest[] = [];

      for (let n = 0; n < orderBy.length; n++) {
        let overwrite = false;
        const element: OrderByExerciseRequest = orderBy[n];

        for (let m = 0; m < stateOrderBy.length && !overwrite; m++) {
          if (element.field === stateOrderBy[m].field) {
            stateOrderBy[m] = element;
            overwrite = true;
          }
        }

        if (!overwrite) {
          notOverwriteOrderBy.push(element)
        }
      }

      state.orderBy = [...state.orderBy, ...notOverwriteOrderBy]
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
  async fetch({commit, state}, searchRequest: SearchExerciseRequest) {
    const metadata: MetadataSearchExerciseRequest = {};

    if (searchRequest.metadata) {
      metadata.size = !!searchRequest.metadata.size ? searchRequest.metadata.size : state.metadata.pageSize;
      metadata.page = !!searchRequest.metadata.page ? searchRequest.metadata.page : 1;
    } else {
      metadata.page = 1;
      metadata.size = state.metadata.pageSize
    }

    commit('UPDATE_INCLUDE_OPTIONS', searchRequest.includeOptions);
    commit('UPDATE_ORDER_BY', searchRequest.orderBy);
    commit('UPDATE_SEARCH_CRITERION', searchRequest.data);

    const newSearchRequest: SearchExerciseRequest = {
      data: state.search_criterion,
      includeOptions: state.includeOptions,
      orderBy: state.orderBy,
      metadata
    };

    try {
      const response: SearchExerciseResponse = await this.app.$axios.$post('/api/search', newSearchRequest);
      commit('INIT', response);
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

    const request: SearchExerciseRequest = {
      metadata: {
        page: state.metadata.currentPage + 1,
        size: state.metadata.pageSize
      },
      data: {
        ...state.search_criterion
      },
      includeOptions: state.includeOptions,
      orderBy: state.orderBy
    };

    if (state.search_criterion.vote) {
      if (request.data) {
        request.data.vote = state.search_criterion.vote
      } else {
        request.data = {vote: state.search_criterion.vote}
      }
    }

    try {
      const response: SearchExerciseResponse = await this.app.$axios.$post('/api/search', request);
      commit('ADD_EXERCISES', response.data);
      commit('SET_METADATA', response.metadata);
    } catch (e) {
      commit('RESET')
    }
  }
});
