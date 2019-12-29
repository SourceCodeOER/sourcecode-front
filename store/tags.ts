import {Category, ExtendedTag, SelectedTag, Tag, TagsCategory} from '~/types'
import {mutationTree, actionTree, getterTree} from 'nuxt-typed-vuex'
import {GetterTree} from "~/node_modules/vuex";

const cloneDeep = require('lodash.clonedeep');

const DEACTIVATED = 0;
const ACTIVE = 1;

/**
 * helper function to map an array of TagSelecter into a map containing array or number of id's of a category
 * @param map
 * @param tags
 */
const arrayToMapOfArray = (map: Map<number, number | number[]>, tags: SelectedTag[]) => {
  for (let tag of tags) {
    const array: number | number[] | undefined = map.get(tag.category_id);

    if (array !== undefined) {
      if (typeof array === "number") {
        map.set(tag.category_id, [array, tag.tag_id])
      } else {
        map.set(tag.category_id, [...array, tag.tag_id])
      }
    } else {
      map.set(tag.category_id, tag.tag_id)
    }
  }
};

export const state = () => ({
  /**
   * The default tags fetched
   */
  defaultTags: [] as ExtendedTag[],
  /**
   * All the tags selected in the filter section
   */
  selectedTags: [] as SelectedTag[],
  /**
   * The defaultTags array with modification of state for tags
   */
  tags: [] as ExtendedTag[],
  /**
   * The tag id's that are selected (CNF form)
   * example : [1, [2, 3]] = 1 n (2 v 3)
   */
  tagsRequest: [] as (number | number[])[]
});

export const mutations = mutationTree(state, {
  /**
   * Add a tag in the selectedTag array and update the state in the tags array
   * @param state
   * @param selectedTag
   * @constructor
   */
  ADD_TAG(state, selectedTag: SelectedTag) {
    state.selectedTags.push(selectedTag);
    const i = state.tags.findIndex((el) => el.id === selectedTag.category_id);
    const j = state.tags[i].tags.findIndex((el) => el.tag_id === selectedTag.tag_id);

    state.tags[i].tags[j].state = ACTIVE;
  },
  /**
   * Remove a tag in the selectedTag array unless this is a old confirmed one
   * In this case, just the state is modified and. We update the state in the tags array too
   * @param state
   * @param id
   * @param category
   * @constructor
   */
  REMOVE_TAG(state, {tag_id, category_id}: SelectedTag) {
    const index = state.selectedTags.findIndex((el) => el.tag_id === tag_id);
    state.selectedTags.splice(index, 1);

    const i = state.tags.findIndex((el) => el.id === category_id);
    const j = state.tags[i].tags.findIndex((el) => el.tag_id === tag_id);
    state.tags[i].tags[j].state = DEACTIVATED;

  },
  /**
   * Initialization given an array of TagSelecter
   * default tags keeps a default copy of the data in order to clear the data
   * @param state
   * @param tags
   * @constructor
   */
  INIT(state, tags) {
    state.defaultTags = cloneDeep(tags);
    state.tags = tags;
  },
  /**
   * Enable to clear the data in the selected array and get the default copy of defaultTags for tags
   * @param state
   * @constructor
   */
  CLEAR(state) {
    state.selectedTags = [];
    state.tags = cloneDeep(state.defaultTags);
    state.tagsRequest = [];
  },
  SET_TAGS_REQUEST(state, tagsRequest: (number | number[])[]) {
    state.tagsRequest = tagsRequest
  }
});


export const actions = actionTree({state, mutations}, {
  /**
   * Add a tag or remove a tag from the selectedTags array. The tags array is updated for the changed state
   * @param commit
   * @param payload
   */
  addOrRemoveTag({commit}, payload: SelectedTag) {
    if (payload.state === ACTIVE) {
      commit('ADD_TAG', payload)
    } else {
      commit('REMOVE_TAG', payload)
    }
  },
  /**
   * Apply modifications to filter with tags
   * @param commit
   * @param getters
   * @param state
   * @param mode
   */
  apply({commit, getters, state}, mode: "strict" | "default") {

    if (mode === "strict") {
      const array: number[][] = state.selectedTags.map(tag => [tag.tag_id]);
      commit('SET_TAGS_REQUEST', array);

    } else {
      const map: Map<number, number | number[]> = new Map();

      arrayToMapOfArray(map, state.selectedTags);

      commit('SET_TAGS_REQUEST', Array.from(map.values()));
    }

  },
  /**
   * Enable to apply a filter with a custom confirmedTags array
   * @param commit
   * @param state
   * @param payload
   * @param confirmedTags
   */
  applyConfirmedTags({commit, state}, payload: { confirmedTags: SelectedTag[], mode: "strict" | "default" }) {

    commit('CLEAR');

    payload.confirmedTags.forEach(el => {
      el.state = 1;
      commit('ADD_TAG', el)
    });

    if (payload.mode === "strict") {
      const array: number[][] = payload.confirmedTags.map(tag => [tag.tag_id]);
      commit('SET_TAGS_REQUEST', array);
    } else {

      const map: Map<number, number | number[]> = new Map();
      arrayToMapOfArray(map, payload.confirmedTags);

      commit('SET_TAGS_REQUEST', Array.from(map.values()));
    }


  },
  /**
   * Fetch all the tags with categories on the database
   * @param commit
   * @param state
   */
  async fetch({commit, state}) {

    try {
      const data: TagsCategory[] = await this.$axios.$get('api/tags_by_categories');
      const array: ExtendedTag[] = [];

      for (let i in data) {
        const {id, category, tags} = data[i];

        const selectedTags: SelectedTag[] = tags.map((el: Tag) => {
          const selectedTag: SelectedTag = {...el, category_id: id, state: DEACTIVATED};
          return selectedTag
        });

        array.push({
          id,
          category,
          tags: selectedTags
        })
      }

      const selectedTags: SelectedTag[] = state.selectedTags;

      selectedTags.forEach((tag: SelectedTag) => {

        const tagsCategory: ExtendedTag | undefined = array.find(el => el.id === tag.category_id);

        if (tagsCategory !== undefined) {
          const selectedTag: SelectedTag | undefined = tagsCategory.tags.find((el) => el.tag_id === tag.tag_id);

          if (selectedTag !== undefined) {
            selectedTag.state = ACTIVE
          }
        }
      });

      commit('INIT', array)
    } catch (e) {
      commit('CLEAR')
    }

  }

})


export const getters = getterTree(state, {
  categories: (state): Category[] => state.tags.map(tag => {
    return {
      category_id: tag.id,
      category_text: tag.category
    }
  })
})
