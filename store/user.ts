import {mutationTree} from 'nuxt-typed-vuex'
import {User} from "~/types";
import {actionTree} from "~/node_modules/nuxt-typed-vuex";


export const state = () => ({
  user: {
    fullName:'',
    role: 'guest'
  } as User
});

export const mutations = mutationTree(state, {
  SET_USER_INFO(state, user: User) {
    state.user = user
  }
});


export const actions = actionTree({state, mutations}, {})
