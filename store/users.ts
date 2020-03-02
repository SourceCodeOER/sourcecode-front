import {
  MetadataSearchUserResponse,
  SearchUserRequest,
  SearchUserRequestMetadata,
  UserInfo, SearchUserResponse, TagState, UserRole
} from "~/types";
import {actionTree, getterTree, mutationTree} from "nuxt-typed-vuex";

export const state = () => ({
  /**
   * The users currently loaded
   */
  users: [] as UserInfo[],
  /**
   * The metadata needed for retrieving users
   */
  metadata: {
    currentPage: 1,
    totalItems: 0,
    totalPages: 0,
    pageSize: 20
  } as MetadataSearchUserResponse,
  /**
   * The search criterion
   */
  search_criterion: {} as SearchUserRequest,
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
  INIT(state, data: SearchUserResponse) {
    state.metadata = data.metadata;
    state.users = data.data;
  },
  /**
   * Reset the parameters of the search request
   * @param state
   * @constructor
   */
  RESET(state) {
    state.metadata = {
      currentPage: 1,
      totalItems: 0,
      totalPages: 0,
      pageSize: state.metadata.pageSize
    };

    state.search_criterion = {};
  },
  /**
   * Add a list of users to the previous one
   * @param state
   * @param users
   * @constructor
   */
  ADD_USERS(state, users: UserInfo[]) {
    users.forEach(user => state.users.push(user));
  },
  /**
   * Set a new metadata object to replace the old one
   * @param state
   * @param metadata
   * @constructor
   */
  SET_METADATA(state, metadata: MetadataSearchUserResponse) {
    state.metadata = metadata
  },
  REMOVE_SELECTED_USER_ROLE(state, userRoles: UserRole[]) {
    const selectedUserRole: UserRole[] | undefined = state.search_criterion.roles;

    if (selectedUserRole) {
      state.search_criterion.roles = selectedUserRole
        .filter(userRole => userRoles.findIndex(role => role === userRole) === -1);
    }
  },
  UPDATE_SELECTED_USER_ROLE(state, userRoles: UserRole[]) {
    const selectedUserRole: UserRole[] | undefined = state.search_criterion.roles;
    const notOverwriteUserRole: UserRole[] = [];

    if (selectedUserRole) {
      for (let n = 0; n < userRoles.length; n++) {
        let overwrite = false;
        const element = userRoles[n];

        for (let m = 0; m < selectedUserRole.length && !overwrite; m++) {
          if (element === selectedUserRole[m]) {
            selectedUserRole[m] = element;
            overwrite = true;
          }
        }

        if (!overwrite) {
          notOverwriteUserRole.push(element)
        }
      }
      state.search_criterion.roles = [...selectedUserRole, ...notOverwriteUserRole]
    } else {
      state.search_criterion.roles = userRoles
    }

  }
});

export const actions = actionTree({state, mutations, getters}, {
  /**
   * Fetch a completely new set of users based on a searchRequest
   * @param commit
   * @param state
   * @param searchRequest
   */
  async fetch({commit, state}, searchRequest: SearchUserRequest) {
    const metadata: SearchUserRequestMetadata = {};

    if (searchRequest.metadata) {
      metadata.size = !!searchRequest.metadata.size ? searchRequest.metadata.size : state.metadata.pageSize;
      metadata.page = !!searchRequest.metadata.page ? searchRequest.metadata.page : 1;
    } else {
      metadata.page = 1;
      metadata.size = state.metadata.pageSize
    }

    const newSearchRequest: SearchUserRequest = {
      ...state.search_criterion,
      ...searchRequest,
      metadata
    };

    try {
      const response: SearchUserResponse = await this.app.$axios.$get('/api/users', {
        params: newSearchRequest
      });
      commit('INIT', response);
    } catch (e) {
      commit('RESET')
    }
  },
  /**
   * Fetch the next users based on the exact same SearchRequest
   * @param commit
   * @param state
   */
  async next({commit, state}) {
    const request: SearchUserRequest = {
      ...state.search_criterion,
      metadata: {
        page: state.metadata.currentPage + 1,
        size: state.metadata.pageSize
      }
    };

    try {
      const response: SearchUserResponse = await this.app.$axios.$get('/api/users', {params: request});
      commit('ADD_USERS', response.data);
      commit('SET_METADATA', response.metadata);
    } catch (e) {
      commit('RESET')
    }
  }
});
