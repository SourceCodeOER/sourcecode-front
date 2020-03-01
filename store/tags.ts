import {
  Category,
  SelectedTag,
  CategoryWithTags,
  CategoryWithSelectedTags, TagExtended, TagState
} from '~/types'
import {mutationTree, actionTree, getterTree} from 'nuxt-typed-vuex'

const cloneDeep = require('lodash.clonedeep');

const DEACTIVATED = false;
const ACTIVE = true;

/**
 * helper function to map an array of SelectedTag into a map containing array or number of id's of a related category
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
  defaultTags: [] as CategoryWithSelectedTags[],
  /**
   * All the tags selected
   */
  selectedTags: [] as SelectedTag[],
  /**
   * The defaultTags array with modification that can be modified for selection of tags
   */
  tags: [] as CategoryWithSelectedTags[],
  /**
   * The tag id's that are selected (CNF form)
   * example : [1, [2, 3]] = 1 n (2 v 3)
   */
  tagsRequest: [] as (number | number[])[],
  /**
   * Array of id's categories representing all the selected categories
   */
  selectedCategories: [] as number[],
  /**
   * Filter tag with their current state
   */
  selectedTagState: [] as TagState[]
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

    state.tags[i].tags[j].isSelected = ACTIVE;
  },
  /**
   * Remove a tag in the selectedTag and update the state in the tags array too
   * @param state
   * @param id
   * @constructor
   */
  REMOVE_TAG(state, {tag_id, category_id}: SelectedTag) {
    const index = state.selectedTags.findIndex((el) => el.tag_id === tag_id);
    state.selectedTags.splice(index, 1);

    const i = state.tags.findIndex((el) => el.id === category_id);
    const j = state.tags[i].tags.findIndex((el) => el.tag_id === tag_id);
    state.tags[i].tags[j].isSelected = DEACTIVATED;

  },
  /**
   * Initialization given an array of CategoryWithSelectedTags
   * default tags keeps a default copy of the data in order to clear the data
   * @param state
   * @param tags
   * @constructor
   */
  INIT(state, tags: CategoryWithSelectedTags[]) {
    state.defaultTags = cloneDeep(tags);
    state.tags = tags;
    state.selectedCategories = [];
    const selectedTags: SelectedTag[] = state.selectedTags;

    selectedTags.forEach((tag: SelectedTag) => {

      const tagsCategory: CategoryWithSelectedTags | undefined = tags.find((el: CategoryWithSelectedTags) => el.id === tag.category_id);

      if (tagsCategory !== undefined) {
        const selectedTag: SelectedTag | undefined = tagsCategory.tags.find((el: SelectedTag) => el.tag_id === tag.tag_id);

        if (selectedTag !== undefined) {
          selectedTag.isSelected = ACTIVE
        }
      }
    });
  },
  /**
   * Clear all the data and copy the original defaultTags array into the tags array
   * @param state
   * @constructor
   */
  CLEAR(state) {
    state.selectedTags = [];
    state.tags = cloneDeep(state.defaultTags);
    state.tagsRequest = [];
    state.selectedCategories = [];
    state.selectedTagState = []
  },
  /**
   * Set the tag state filter
   * @param state
   * @param tagState
   * @constructor
   */
  SET_SELECTED_TAG_STATE(state, tagState: TagState[]) {
    state.selectedTagState = tagState;
  },
  REMOVE_SELECTED_TAG_STATE(state, tagStates: TagState[]) {
    const selectedTagState = state.selectedTagState;
    state.selectedTagState = selectedTagState
      .filter(tagState => tagStates.findIndex(tag => tag === tagState) === -1);
  },
  UPDATE_SELECTED_TAG_STATE(state, tagStates: TagState[]) {
      const selectedTagState: TagState[] = state.selectedTagState;
      const notOverwriteTagState: TagState[] = [];

      for (let n = 0; n < tagStates.length; n++) {
        let overwrite = false;
        const element = tagStates[n];

        for (let m = 0; m < selectedTagState.length && !overwrite; m++) {
          if (element === selectedTagState[m]) {
            selectedTagState[m] = element;
            overwrite = true;
          }
        }

        if (!overwrite) {
          notOverwriteTagState.push(element)
        }
      }

      state.selectedTagState = [...state.selectedTagState, ...notOverwriteTagState]
  },
  /**
   * set the tag request array containing a CNF like structure
   * @param state
   * @param tagsRequest
   * @constructor
   */
  SET_TAGS_REQUEST(state, tagsRequest: (number | number[])[]) {
    state.tagsRequest = tagsRequest
  },
  /**
   * add a category into the selectedCategories array
   * @param state
   * @param index
   * @constructor
   */
  ADD_CATEGORY(state, index: number) {
    const indexOfId = state.selectedCategories.findIndex(id => index === id);

    if (indexOfId === -1) {
      state.selectedCategories.push(index)
    }
  },
  /**
   * Remove a category from the selectedCategories array
   * @param state
   * @param index
   * @constructor
   */
  REMOVE_CATEGORY(state, index: number) {

    const indexOfId = state.selectedCategories.findIndex(id => index === id);

    if (indexOfId !== -1) {
      state.selectedCategories.splice(indexOfId, 1);
    }

  }
});


export const actions = actionTree({state, mutations}, {
  /**
   * Add a tag or remove a tag from the selectedTags array. The tags array is updated for the changed state
   * @param commit
   * @param payload
   */
  addOrRemoveTag({commit}, payload: SelectedTag) {
    if (payload.isSelected === ACTIVE) {
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
   * @param mode : default for the CNF form and strict only with AND expression
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
   * Enable to apply a filter with a custom SelectedTag array
   * @param commit
   * @param state
   * @param payload
   * @param confirmedTags
   */
  applyConfirmedTags({commit, state}, payload: { confirmedTags: SelectedTag[], mode: "strict" | "default" }) {

    commit('CLEAR');

    payload.confirmedTags.forEach(el => {
      el.isSelected = true;
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
   * @param stateOfTags
   */
  async fetch({commit, state}, stateOfTags: TagState[] = []) {

    try {
      const data: CategoryWithTags[] = await this.$axios.$get('api/tags_by_categories', {
        params: {
          state: stateOfTags
        }
      });
      const array: CategoryWithSelectedTags[] = [];

      for (let i in data) {
        const {id, category, tags}: CategoryWithTags = data[i];

        const selectedTags: SelectedTag[] = tags.map((el: TagExtended) => {
          const selectedTag: SelectedTag = {...el, isSelected: DEACTIVATED};
          return selectedTag
        });

        array.push({
          id,
          category,
          tags: selectedTags
        })
      }

      commit('INIT', array)
    } catch (e) {
      commit('CLEAR')
    }

  },
  /**
   * Add/remove a category from the selectedCategories array
   * @param commit
   * @param state
   * @param payload
   */
  addOrRemoveCategory({commit, state}, payload: { index: number, state: boolean }) {
    if (payload.state) {
      commit('ADD_CATEGORY', payload.index)
    } else {
      commit('REMOVE_CATEGORY', payload.index)
    }
  }


});


export const getters = getterTree(state, {
  /**
   * get the list of all Categories
   * @param state
   */
  categories: (state): Category[] => {
    return state.tags.map((categoryWithSelectedTags: CategoryWithSelectedTags) => {
      return {
        id: categoryWithSelectedTags.id,
        category: categoryWithSelectedTags.category
      }
    })
  },
  /**
   * get Filtered tags and categories
   * @param state
   */
  filteredTagByCategories: (state) => {

    const tagState: TagState[] | undefined = state.selectedTagState;

    let categoriesWithTags: CategoryWithSelectedTags[];

    if (state.selectedCategories.length > 0) {
      categoriesWithTags = state.tags.filter(categoryWithSelectedTag => {
        return state.selectedCategories.findIndex(id => categoryWithSelectedTag.id === id) !== -1
      })


    } else {
      categoriesWithTags = state.tags;
    }

    if (tagState && tagState.length > 0) {

      return categoriesWithTags.map(cat => {
        return {
          ...cat,
          tags: cat.tags.filter(el => tagState.findIndex(state => state === el.state) !== -1)
        }
      })
    } else {
      return categoriesWithTags
    }

  }

});
