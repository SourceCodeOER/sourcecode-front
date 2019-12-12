import {Historical, SelectedTag} from "~/types";
import {actionTree, mutationTree} from "nuxt-typed-vuex";

const cloneDeep = require('lodash.clonedeep');


export const state = () => ({
  /**
   * Contains the historical of all the filters and title entered for a search request
   */
  historical: [] as Historical[]
});

export const mutations = mutationTree(state, {
  /**
   * Add a new historical Object to the array of historical
   * @param state
   * @param historical
   * @constructor
   */
  ADD_HISTORICAL(state, historical: Historical) {
    state.historical.push(historical)
  }
});

export const actions = actionTree({state, mutations}, {
  /**
   * Add the new tags and title (one of the two has to exist) and set the time where the historical has been added to the array
   * @param commit
   * @param historical
   */
  addHistorical({commit}, historical: { tags?: SelectedTag[], title?: string }) {
    if (historical.tags && historical.tags.length !== 0 || historical.title) {
      const moment: string = this.app.$moment().format(this.app.$moment.HTML5_FMT.TIME_SECONDS);
      commit('ADD_HISTORICAL', {tags: cloneDeep(historical.tags), datetime: moment, title: historical.title})
    }
  }
});
