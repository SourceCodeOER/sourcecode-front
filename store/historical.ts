import {SelectedTag} from "~/types";
import {actionTree, mutationTree} from "nuxt-typed-vuex";
const cloneDeep = require('lodash.clonedeep');


export interface Historical {
  datetime: string,
  title?:string
  tags?: SelectedTag[]
}

export const state = () => ({
  historical: [] as Historical[]
});

export const mutations = mutationTree(state, {
  ADD_HISTORICAL(state, historical: Historical) {
    state.historical.push(historical)
  }
});

export const actions = actionTree({state, mutations}, {
  addHistorical({commit}, historical: {tags?: SelectedTag[], title?: string}) {
    if(historical.tags && historical.tags.length !== 0 || historical.title) {
      const moment: string = this.app.$moment().format(this.app.$moment.HTML5_FMT.TIME_SECONDS);
      commit('ADD_HISTORICAL', {tags: cloneDeep(historical.tags), datetime: moment, title: historical.title})
    }
  }
});
