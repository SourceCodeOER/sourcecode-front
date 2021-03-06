import {
  Exercise,
  MetadataSearchExerciseRequest,
  MetadataSearchExerciseResponse,
  DataSearchExerciseRequest,
  SearchExerciseRequest,
  SearchExerciseResponse,
  IncludeOptionsExerciseRequest,
  OrderByExerciseRequest,
  FilterOptionsExerciseRequest
} from "~/types";
import {actionTree, getterTree, mutationTree} from "nuxt-typed-vuex";
import {AxiosError} from "axios";

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
  /**
   * The include options settings to filter exercises
   */
  includeOptions: {} as IncludeOptionsExerciseRequest,
  /**
   * The filter options settings to filter exercises
   */
  filterOptions: {} as FilterOptionsExerciseRequest,
  /**
   * The orderBy options to make ordering of exercises
   */
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
    state.filterOptions = {};
    state.orderBy = [];
    state.search_criterion = {
      title: "",
      tags: []
    };
  },
  /**
   * Reset the search criterion with default values and keeps the previous selected user_ids array
   * @param state
   * @constructor
   */
  RESET_SEARCH_CRITERION(state) {
    state.search_criterion = {
      tags: [],
      title: '',
      user_ids: state.search_criterion.user_ids
    };
  },
  /**
   * Reset the vote criteria
   * @param state
   * @constructor
   */
  RESET_VOTE(state) {
    delete state.search_criterion.vote
  },
  /**
   * Reset the state filter option for filtering exercises
   * @param state
   * @constructor
   */
  RESET_STATE(state) {
    delete state.filterOptions.state
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
   * Update the search criterion by merging old and new data
   * @param state
   * @param searchCriterion
   * @constructor
   */
  UPDATE_SEARCH_CRITERION(state, searchCriterion: DataSearchExerciseRequest | undefined) {
    state.search_criterion = {...state.search_criterion, ...searchCriterion};
  },
  /**
   * Update the new include options by merging old and new data
   * @param state
   * @param includeOptions
   * @constructor
   */
  UPDATE_INCLUDE_OPTIONS(state, includeOptions: IncludeOptionsExerciseRequest | undefined) {
    state.includeOptions = {...state.includeOptions, ...includeOptions}
  },
  /**
   * Update the new filter options by merging old and new data
   * @param state
   * @param filterOptions
   * @constructor
   */
  UPDATE_FILTER_OPTIONS(state, filterOptions: FilterOptionsExerciseRequest | undefined) {
    state.filterOptions = {...state.filterOptions, ...filterOptions}
  },
  /**
   * Update the order by array by merging old and new data
   * @param state
   * @param orderBy
   * @constructor
   */
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
    commit('UPDATE_FILTER_OPTIONS', searchRequest.filterOptions);

    const newSearchRequest: SearchExerciseRequest = {
      data: state.search_criterion,
      includeOptions: state.includeOptions,
      orderBy: state.orderBy,
      filterOptions: state.filterOptions,
      metadata
    };

    try {
      const response: SearchExerciseResponse = await this.app.$axios.$post('/api/search', newSearchRequest);
      commit('INIT', response);
    } catch (e) {
      const errorAxios = e as AxiosError;

      if (errorAxios.response) {
        const status: number = errorAxios.response.status;

        if (status === 400) {
          this.$displayError("Une erreur est survenue lors du chargement des exercices.", {statusCode: status});
        } else if (status === 401) {
          this.$displayError(`Vous devez vous connecter pour charger ces exercices.`, {statusCode: status});
        } else if (status === 403) {
          this.$displayError(`Vous n'êtes pas autorisé à effectuer cette action.`, {statusCode: status});
        } else if (status === 500) {
          this.$displayError(`Une erreur est survenue depuis nos serveurs, veuillez-nous en excuser.`, {statusCode: status});
        } else {
          this.$displayError("Une erreur est survenue lors du chargement des exercices.", {statusCode: status});
        }
      } else {
          this.$displayError(`Une erreur est survenue lors du chargement des exercices.`, {statusCode: 400});
      }

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
      orderBy: state.orderBy,
      filterOptions: state.filterOptions
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
      const errorAxios = e as AxiosError;

      if (errorAxios.response) {
        const status: number = errorAxios.response.status;

        if (status === 400) {
          this.$displayError("Une erreur est survenue lors du chargement des exercices.", {statusCode: status});
        } else if (status === 401) {
          this.$displayError(`Vous devez vous connecter pour charger ces exercices.`, {statusCode: status});
        } else if (status === 403) {
          this.$displayError(`Vous n'êtes pas autorisé à effectuer cette action.`, {statusCode: status});
        } else if (status === 500) {
          this.$displayError(`Une erreur est survenue depuis nos serveurs, veuillez-nous en excuser.`, {statusCode: status});
        } else {
          this.$displayError("Une erreur est survenue lors du chargement des exercices.", {statusCode: status});
        }
      } else {
        this.$displayError(`Une erreur est survenue lors du chargement des exercices.`, {statusCode: 400});
      }

      commit('RESET')
    }
  }
});
