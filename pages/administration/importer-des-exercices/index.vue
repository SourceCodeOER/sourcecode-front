<template>
  <div class="container--with-menu" id="CreateExercise">
    <div class="banner banner--with-shadow-bottom">
      <div class="banner__nav">
        <span>
          Administration > Importation d'exercices
        </span>
      </div>
    </div>

    <div class="wrapper">
      <ImportForm title="Importer des exercices"/>
    </div>
  </div>

</template>


<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator'
  import ImportForm from "~/components/Gestion/ImportForm.vue";

  @Component({
    components: {ImportForm},
    middleware: ['auth', 'admin']
  })
  export default class extends Vue {
  }
</script>

