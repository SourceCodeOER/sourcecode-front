<template>
  <div class="container--with-menu" id="Exercise">
    <div class="banner banner--with-shadow-bottom">

      <div class="banner__nav banner__nav--with-link">
        <span>
          Exercices > {{exercise.title}}
        </span>
        <nuxt-link to="/exercices" tag="span">
          <Icon type="arrowLeft" class="reversed-arrow" theme="theme--primary-color-light"/>
          Retour à la recherche
        </nuxt-link>
      </div>
    </div>

    <div class="wrapper wrapper--with-panel">

      <Panel>
        <PanelItem>
          <DetailsPanel :exercise="exercise"/>
        </PanelItem>
      </Panel>

      <section class="exercise">
        <h1>{{exercise.title}}</h1>
        <span>Créé le {{$moment(exercise.createdAt).format("DD/MM/YY à H:mm")}}</span> | <span>Mis à jour le {{$moment(exercise.updatedAt).format("DD/MM/YY à H:mm")}}</span>
        <button v-if="isTheCreator || ['admin', 'super_admin'].includes(userRole)" @click="modifyExercise" class="button--ternary-color-reverse">Modifier l'exercice</button>

        <h2 class="title--primary-color__light">Description</h2>

        <article v-html="exercise.description" class="exercise-article"></article>
      </section>
    </div>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from "vue-property-decorator";
  import {Exercise, UserRole} from "~/types";
  import Icon from "~/components/Symbols/Icon.vue";
  import hljs from 'highlight.js/lib/highlight';
  import javascript from 'highlight.js/lib/languages/javascript';
  import css from 'highlight.js/lib/languages/css'
  import java from 'highlight.js/lib/languages/java'
  import python from 'highlight.js/lib/languages/python'
  import cmake from 'highlight.js/lib/languages/cmake'
  import cs from 'highlight.js/lib/languages/cs'
  import Panel from "~/components/Panel/Panel.vue";
  import PanelItem from "~/components/Panel/PanelItem.vue";
  import DetailsPanel from "~/components/Panel/Item/DetailsPanel.vue";

  hljs.registerLanguage('javascript', javascript);
  hljs.registerLanguage('css', css);
  hljs.registerLanguage('java', java);
  hljs.registerLanguage('python', python);
  hljs.registerLanguage('cmake', cmake);
  hljs.registerLanguage('cs', cs);

  @Component({
    components: {
      DetailsPanel,
      PanelItem,
      Panel,
      Icon
    },
    async asyncData({params, error, app: {$axios}}) {
      const id = params.id;

      try {
        const exercise: Exercise = await $axios.$get(`api/exercises/${id}`, {params: {includeOptions: {includeCreator:true}}});
        return {exercise}
      } catch (e) {
        error({statusCode: 404, message: "Cette exercice est introuvable"});
      }


    },
    auth: false,
    middleware: ['exercises-store']
  })
  export default class extends Vue {
    exercise!: Exercise;

    get creator() {
      return this.exercise.creator ? this.exercise.creator.email : ''
    }

    get user(): string | undefined {
      if(this.$auth.loggedIn) {
        return this.$auth.user.email
      } else {
        return undefined
      }
    }

    get userRole(): UserRole | undefined {
      if(this.user) {
        return this.$auth.user.role
      } else {
        return undefined
      }
    }

    get isTheCreator() {
      if(!this.user || !this.userRole) return false;
      else {
        return this.user === this.creator
      }
    }

    modifyExercise() {
      if(this.userRole === 'admin' || this.userRole === 'super_admin') {
        this.$router.push('/administration/exercices/' + this.exercise.id)
      } else if(this.userRole === 'user') {
        this.$router.push('/gestion/mes-exercices/' + this.exercise.id)
      }
    }

    mounted() {
      if (process.client) {
        const exercise: Element | null = document.querySelector("#Exercise");

        if (exercise) {
          exercise.querySelectorAll('pre code').forEach((block) => {
            hljs.highlightBlock(block);
          });
        }
      }
    }

  }
</script>

<style lang="scss" scoped>

  @import "../../assets/css/_variables";
  @import "../../assets/css/_function";
  @import "../../assets/css/_font";

  #Exercise {

    .exercise {
      position: relative;

      button {
        position: absolute;
        right: 20px;
        top:20px;
        font-size: .75em;
      }
    }

    section {
      background-color: white;
      @include box-shadow($SHADOW);
      border-radius: 4px;
      margin-bottom: 30px;
      padding: 20px;

      h1 {
        margin-bottom: 5px;
      }

      h2 {
        margin-bottom: 10px;
        margin-top: 30px;
      }

      article {
        font-size: .875em;
      }
    }
  }
</style>
