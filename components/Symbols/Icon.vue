<template>
  <component :theme="theme" :is="type"/>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from "vue-property-decorator";

  @Component({
    components: {
      album: () => import('./library/AlbumSymbol.vue'),
      arrowLeft: () => import('./library/ArrowLeftSymbol.vue'),
      arrowRight: () => import('./library/ArrowRightSymbol.vue'),
      check: () => import('./library/CheckSymbol.vue'),
      close: () => import('./library/CloseSymbol.vue'),
      codeBlock: () => import('./library/CodeBlockSymbol.vue'),
      codeBasic: () => import('./library/CodeSymbol.vue'),
      cross: () => import('./library/CrossSymbol.vue'),
      document: () => import('./library/DocumentSymbol.vue'),
      eye: () => import('./library/EyeSymbol.vue'),
      filterBasic: () => import('./library/FilterSymbol.vue'),
      lineH: () => import('./library/LineSymbol.vue'),
      plus: () => import('./library/PlusSymbol.vue'),
      quote: () => import('./library/QuoteSymbol.vue'),
      redo: () => import('./library/RedoSymbol.vue'),
      return: () => import('./library/ReturnSymbol.vue'),
      search: () => import('./library/SearchSymbol.vue'),
      starHalf: () => import('./library/StarHalfSymbol.vue'),
      star: () => import('./library/StarSymbol.vue'),
      starEmpty: () => import('./library/StarEmptySymbol.vue'),
      tags: () => import('./library/TagsSymbol.vue'),
      trash: () => import('./library/TrashSymbol.vue'),
      undo: () => import('./library/UndoSymbol.vue'),
      menuBasic: () => import('./library/MenuSymbol.vue'),
      exercises: () => import('./library/ExercisesSymbol.vue'),
      history: () => import('./library/HistorySymbol.vue'),
      user: () => import('./library/UserSymbol.vue'),
      off: () => import('./library/OffSymbol.vue'),
      edit: () => import('./library/EditSymbol.vue'),
      archive: () => import('./library/ArchiveSymbol.vue')
    }
  })
  export default class Icon extends Vue {
    @Prop({type:String, required:true}) type!:string;
    @Prop({type:String, default: 'theme--default'}) theme?:string
  }
</script>
