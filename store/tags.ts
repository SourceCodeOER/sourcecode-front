import {
  Category,
  SelectedTag,
  CategoryWithTags,
  CategoryWithSelectedTags, TagExtended, TagsSettingsRequest, TagState
} from '~/types'
import {mutationTree, actionTree, getterTree} from 'nuxt-typed-vuex'

const cloneDeep = require('lodash.clonedeep');

const DEACTIVATED = false;
const ACTIVE = true;

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
  defaultTags: [] as CategoryWithSelectedTags[],
  /**
   * All the tags selected in the filter section
   */
  selectedTags: [] as SelectedTag[],
  /**
   * The defaultTags array with modification of state for tags
   */
  tags: [] as CategoryWithSelectedTags[],
  /**
   * The tag id's that are selected (CNF form)
   * example : [1, [2, 3]] = 1 n (2 v 3)
   */
  tagsRequest: [] as (number | number[])[],
  selectedCategories: [] as number[],
  selectedTagState: 'default' as TagState
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
          selectedTag.state = ACTIVE
        }
      }
    });
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
    state.selectedCategories = [];
    state.selectedTagState = 'default'
  },
  RESET_SETTINGS(state) {
    state.selectedCategories = [];
    state.selectedTagState = 'default';
  },
  RESET_SELECTED_TAG_STATE(state) {
    state.selectedTagState = 'default';
  },
  SET_SELECTED_TAG_STATE(state, tagState: TagState) {
    state.selectedTagState = tagState;
  },
  SET_TAGS_REQUEST(state, tagsRequest: (number | number[])[]) {
    state.tagsRequest = tagsRequest
  },
  ADD_CATEGORY(state, index: number) {
    const indexOfId = state.selectedCategories.findIndex(id => index === id);

    if (indexOfId === -1) {
      state.selectedCategories.push(index)
    }
  },
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
      el.state = true;
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
  async fetch({commit, state}, stateOfTags:TagState="default") {

    try {
      const data: CategoryWithTags[] = await this.$axios.$get('api/tags_by_categories', {params: {
        state:stateOfTags
        }});
      const array: CategoryWithSelectedTags[] = [];

      for (let i in data) {
        const {id, category, tags}: CategoryWithTags = data[i];

        const selectedTags: SelectedTag[] = tags.map((el: TagExtended) => {
          const selectedTag: SelectedTag = {...el, state: DEACTIVATED};
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
  addOrRemoveCategory({commit, state}, payload: { index: number, state: boolean }) {
    if (payload.state) {
      commit('ADD_CATEGORY', payload.index)
    } else {
      commit('REMOVE_CATEGORY', payload.index)
    }
  }


});


export const getters = getterTree(state, {
  categories: (state): Category[] => {
    return state.tags.map((categoryWithSelectedTags: CategoryWithSelectedTags) => {
      return {
        id: categoryWithSelectedTags.id,
        category: categoryWithSelectedTags.category
      }
    })
  },
  filteredTagByCategories: (state) => {

    const tagState: boolean | undefined = state.selectedTagState === 'validated' ? true : state.selectedTagState === 'pending' ? false : undefined;

    let categoriesWithTags:CategoryWithSelectedTags[];

    if (state.selectedCategories.length > 0) {
      categoriesWithTags = state.tags.filter(categoryWithSelectedTag => {
        return state.selectedCategories.findIndex(id => categoryWithSelectedTag.id === id) !== -1
      })


    } else {
      categoriesWithTags = state.tags;
    }

    if(tagState !== undefined) {
      return categoriesWithTags.map(cat => {
          return {
            ...cat,
            tags: cat.tags.filter(el => el.isValidated === tagState)
          }
        })
    } else {
      return categoriesWithTags
    }
  }
});
