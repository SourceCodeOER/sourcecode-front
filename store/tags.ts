import {ExtendedTag, SelectedTag, Tag, TagsCategory} from '~/types'
import {getterTree, mutationTree, actionTree} from 'nuxt-typed-vuex'

const cloneDeep = require('lodash.clonedeep');

const DEACTIVATED = 0;
const ACTIVE = 1;
const PENDING = 2;
const INACTIVE = 3;


/**
 * helper function to map an array of TagSelecter into a map containing array or number of id's of a category
 * @param map
 * @param tags
 */
const arrayToMapOfArray = (map: Map<number, number | number[]>, tags: SelectedTag[]) => {
  for (let tag of tags) {
    const array: number | number[] | undefined = map.get(tag.category);

    if (array !== undefined) {
      if (typeof array === "number") {
        map.set(tag.category, [array, tag.id])
      } else {
        map.set(tag.category, [...array, tag.id])
      }
    } else {
      map.set(tag.category, tag.id)
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
  tags: [] as ExtendedTag[]
});

export const getters = getterTree(state, {
  /**
   * Retrieve all the tags that are already confirmed
   * @param state
   */
  filteredConfirmedTags: state => state.selectedTags.filter((tag) => tag.state === ACTIVE),
  /**
   * Retrieve all the tags that are not confirmed yet but in pending
   * @param state
   */
  filteredSelectedTags: state => state.selectedTags.filter((tag) => tag.state === PENDING)
});

export const mutations = mutationTree(state, {
  /**
   * Add a tag in the selectedTag array and update the state in the tags array
   * @param state
   * @param text
   * @param id
   * @param category
   * @constructor
   */
  ADD_TAG(state, {text, id, category}: SelectedTag) {
    const index: number = state.selectedTags.findIndex((tag: SelectedTag) => id === tag.id);

    if (index !== -1 && state.selectedTags[index].state === DEACTIVATED) {
      const i = state.tags.findIndex((el) => el.id === category);
      const j = state.tags[i].tags.findIndex((el) => el.id === id);

      state.selectedTags[index].state = ACTIVE;
      state.tags[i].tags[j].state = ACTIVE

    } else if (index === -1) {
      const i = state.tags.findIndex((el) => el.id === category);
      const j = state.tags[i].tags.findIndex((el) => el.id === id);

      state.selectedTags.push({text, id, state: PENDING, category});
      state.tags[i].tags[j].state = PENDING
    }
  },
  /**
   * Remove a tag in the selectedTag array unless this is a old confirmed one
   * In this case, just the state is modified and. We update the state in the tags array too
   * @param state
   * @param id
   * @param category
   * @constructor
   */
  REMOVE_TAG(state, {id, category}: SelectedTag) {
    const index: number = state.selectedTags.findIndex((tag: SelectedTag) => id === tag.id);

    if (index !== -1 && state.selectedTags[index].state === ACTIVE) {
      const i = state.tags.findIndex((el) => el.id === category);
      const j = state.tags[i].tags.findIndex((el) => el.id === id);

      state.selectedTags[index].state = DEACTIVATED;
      state.tags[i].tags[j].state = DEACTIVATED

    } else if (index !== -1 && state.selectedTags[index].state === PENDING) {

      const i = state.tags.findIndex((el) => el.id === category);
      const j = state.tags[i].tags.findIndex((el) => el.id === id);

      state.selectedTags.splice(index, 1);
      state.tags[i].tags[j].state = INACTIVE

    }
  },
  /**
   * Applies the tags selection by retaining those who have a state CONFIRMED or PENDING
   * The tags array is updated too for the states
   * @param state
   * @constructor
   */
  APPLY(state) {
    const array: SelectedTag[] = [];

    state.selectedTags.forEach((el) => {
      if (el.state !== DEACTIVATED) {
        el.state = ACTIVE;
        array.push(el)
      }
    });

    state.selectedTags = array;

    for (let i = 0; i < state.tags.length; i++) {
      state.tags[i].tags.forEach((tag) => {
        if (tag.state === PENDING) tag.state = ACTIVE;
        else if (tag.state === DEACTIVATED) tag.state = INACTIVE
      })
    }

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
    state.tags = cloneDeep(state.defaultTags)
  }
})


export const actions = actionTree({state, getters, mutations}, {
  /**
   * Add a tag or remove a tag from the selectedTags array. The tags array is updated for the changed state
   * @param commit
   * @param payload
   */
  addTag({commit}, payload: SelectedTag) {
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
   */
  async apply({commit, getters}) {
    const filteredConfirmedTags: SelectedTag[] = getters.filteredConfirmedTags;

    const map: Map<number, number | number[]> = new Map();

    arrayToMapOfArray(map, filteredConfirmedTags);

    const filteredSelectedTags: SelectedTag[] = getters.filteredSelectedTags;

    arrayToMapOfArray(map, filteredSelectedTags);

    console.log(Array.from(map.values()));

    commit('APPLY')
  },
  /**
   * Fetch all the tags with categories on the database
   * @param commit
   */
  async fetchTags({commit}) {
    const data: TagsCategory[] = [
      {
        id: 1,
        category: "langage",
        tags: [
          {
            id: 1,
            text: "Java"
          },
          {
            id: 2,
            text: "Python"
          },
          {
            id: 3,
            text: "Scala"
          },
          {
            id: 4,
            text: "C"
          }
        ]
      },
      {
        id: 2,
        category: "difficulté",
        tags: [
          {
            id: 5,
            text: "Facile"
          },
          {
            id: 6,
            text: "Normal"
          },
          {
            id: 7,
            text: "Difficile"
          }
        ]
      },
      {
        id: 3,
        category: "type d'exercice",
        tags: [
          {
            id: 8,
            text: "QCM"
          },
          {
            id: 9,
            text: "Exercice papier"
          },
          {
            id: 10,
            text: "Projet"
          },
          {
            id: 11,
            text: "Fill the code"
          },
          {
            id: 12,
            text: "Mission"
          }
        ]
      },
      {
        id: 4,
        category: "plateforme",
        tags: [
          {
            id: 13,
            text: "Inginious"
          },
          {
            id: 14,
            text: "Facebook"
          },
          {
            id: 15,
            text: "Google"
          }
        ]
      },
      {
        id: 5,
        category: "auteur",
        tags: [
          {
            id: 16,
            text: "Kim Jong Un"
          },
          {
            id: 17,
            text: "Rambo"
          },
          {
            id: 18,
            text: "John Doe"
          }
        ]
      },
      {
        id: 6,
        category: "cotation",
        tags: [
          {
            id: 19,
            text: "5 étoiles"
          },
          {
            id: 20,
            text: "Plus de 4 étoiles"
          },
          {
            id: 21,
            text: "Plus de 3 étoiles"
          },
          {
            id: 22,
            text: "Moins de 3 étoiles"
          }
        ]
      },
      {
        id: 7,
        category: "thématique",
        tags: [
          {
            id: 23,
            text: "Paradigmes de programmation"
          },
          {
            id: 24,
            text: "Listes chainées"
          },
          {
            id: 25,
            text: "Pointeurs"
          },
          {
            id: 26,
            text: "Récursion"
          },
          {
            id: 27,
            text: "Boucles"
          }
        ]
      },
      {
        id: 8,
        category: "institution",
        tags: [
          {
            id: 28,
            text: "UCLouvain"
          },
          {
            id: 29,
            text: "ULB"
          },
          {
            id: 30,
            text: "Mons"
          }
        ]
      }
    ];

    try {
      //const data: TagsCategory[] = await this.$axios.$get('api/tags_by_categories');
      const array: ExtendedTag[] = [];

      for (let i in data) {
        const {id, category, tags} = data[i];

        const selectedTags: SelectedTag[] = tags.map((el: Tag) => {
          const selectedTag: SelectedTag = {...el, category: id, state: INACTIVE};
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

  }

})
