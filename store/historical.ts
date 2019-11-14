import {SelectedTag} from "~/types";
import {actionTree, mutationTree} from "nuxt-typed-vuex";
const cloneDeep = require('lodash.clonedeep');


export interface Historical {
  datetime: string,
  tags: SelectedTag[]
}

export const state = () => ({
  historical: [] as Historical[]
});

export const mutations = mutationTree(state, {
  ADD_HISTORICAL(state, selectedTags: Historical) {
    state.historical.push(selectedTags)
  }
});

export const actions = actionTree({state, mutations}, {
  addHistorical({commit}, selectedTags: SelectedTag[]) {
    const moment: string = this.app.$moment().format(this.app.$moment.HTML5_FMT.TIME_SECONDS);
    commit('ADD_HISTORICAL', {tags: cloneDeep(selectedTags), datetime: moment})
  }
});
