<template>
  <div class="container--with-menu" id="Exercise">
    <div class="banner banner--with-shadow-bottom">

      <div class="banner__nav banner__nav--with-link">
        <span>
          Bibliothèque > {{exercise.title}}
        </span>
        <nuxt-link to="/exercices" tag="span">
          <Icon type="arrowLeft" class="reversed-arrow" theme="theme--primary-color"/>
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
        <div class="status">
          <b>statut</b> -
          <template v-if="exercise.state === 'VALIDATED'">
            Valide <Icon type="check" theme="theme--green"/>
          </template>

          <template v-else-if="exercise.state === 'NOT_VALIDATED'">
            Non valide <Icon type="close" theme="theme--red-light"/>
          </template>

          <template v-else-if="exercise.state === 'PENDING'">
            En attente <Icon type="send" theme="theme--yellow"/>
          </template>

          <template v-else-if="exercise.state === 'DRAFT'">
            Brouillon <Icon title="Créé" type="paper" theme="theme--primary-color-light"/>
          </template>

          <template v-else-if="exercise.state === 'ARCHIVED'">
            Archivé <Icon type="archive" theme="theme--red-light"/>
          </template>
        </div>
        <div class="score__info">
          <div v-if="$auth.loggedIn">
            <h4 class="title--primary-color__light">Votre note</h4>
            <Rating :rating="rating" @rating="rate"/>
          </div>
          <div>
            <h4 class="title--primary-color__light">Moyenne de l'exercice</h4>
            <div class="avg-score" v-if="nbVotes !== 0">
              <span>{{avgVote}}</span>
              <Icon theme="theme--primary-color" type="star"/>
            </div>
            <div v-else>
              <span>Pas encore évalué</span>
            </div>
          </div>
        </div>
        <button v-if="isTheCreator || isAdmin || isSuperAdmin" @click="modifyExercise"
                class="button--ternary-color-reverse modify-button">Modifier l'exercice
        </button>

        <h2 class="title--primary-color__light">Description</h2>

        <article v-html="exercise.description" class="exercise-article"></article>

        <template v-if="!!exercise.url || !!exercise.file">

          <h2 class="title--primary-color__light">Sources</h2>

          <a v-if="!!exercise.url" :href="exercise.url" target="_blank" class="button-wrapper">
            <button class=" button--ternary-color-reverse">
              Lien vers l'exercice
            </button>
          </a>

          <div v-if="!!exercise.file" @click="downloadFile" class="button-wrapper">
            <button class="button--ternary-color-reverse">
              Télécharger l'exercice
            </button>
          </div>

        </template>

      </section>
    </div>
  </div>
</template>

<script lang="ts">
  import {Component, Mixins} from "vue-property-decorator";
  import {Exercise, ExerciseMetrics} from "~/types";
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
  import UserMixins from "~/components/Mixins/Api/UserMixins";
  import {AxiosError} from "axios";
  import Rating from "~/components/Rating/Rating.vue";

  hljs.registerLanguage('javascript', javascript);
  hljs.registerLanguage('css', css);
  hljs.registerLanguage('java', java);
  hljs.registerLanguage('python', python);
  hljs.registerLanguage('cmake', cmake);
  hljs.registerLanguage('cs', cs);

  const download = require('downloadjs');

  @Component({
    components: {
      Rating,
      DetailsPanel,
      PanelItem,
      Panel,
      Icon
    },
    async asyncData({params, error, app: {$axios}}) {
      const id = params.id;

      try {
        const exercise: Exercise = await $axios.$get(`api/exercises/${id}`, {params: {includeOptions: {includeCreator: true}}});
        return {exercise}
      } catch (e) {
        const axiosError = e as AxiosError;

        if (axiosError.response) {
          const status: number = axiosError.response.status;

          if (status === 404) {
            error({statusCode: status, message: "Cet exercice est introuvable."});
          } else if (status === 410) {
            error({statusCode: 410, message: "Cet exercice a été archivé."});
          } else if (status === 500) {
            error({
              statusCode: status,
              message: "Une erreur est survenue depuis nos serveurs, veuillez-nous en excuser."
            });
          }
        } else {
          error({statusCode: 404, message: "Cet exercice est introuvable."});
        }

        return {exercise: undefined}

      }


    },
    auth: false,
    middleware: ['exercises-store']
  })
  export default class extends Mixins(UserMixins) {
    exercise!: Exercise;

    get creator() {
      return this.exercise.creator ? this.exercise.creator.email : ''
    }

    get isTheCreator() {
      if (!this.user) return false;
      else {
        return this.user.email === this.creator
      }
    }

    get rating() {
      return this.exercise.vote ? this.exercise.vote : 0
    }

    get avgVote() {

      const metrics: ExerciseMetrics | undefined = this.exercise.metrics;

      if(metrics) {
        return metrics.avg_score
      }

      return '-'
    }

    get nbVotes() {
      const metrics: ExerciseMetrics | undefined = this.exercise.metrics;

      if (metrics) {
        return metrics.votes
      }

      return 0
    }

    private async rate(i: number) {
      if (this.$auth.loggedIn) {
        try {
          await this.$axios.$post('/api/vote_for_exercise', {exercise_id: this.exercise.id, score: i});
          this.$displaySuccess('Merci pour votre retour !');
        } catch (e) {
          const error = e as AxiosError;

          if (error.response) {
            const status = error.response.status;

            if (status === 400) {
              this.$displayError('Une erreur est survenue, vérifiez vos données');
            } else if (status === 401) {
              this.$displayError('Vous devez vous connecter pour effectuer cette action !');
            } else if (status === 403) {
              this.$displayError("Vous n'êtes pas autorisé à effectuer cette action !");
            } else if (status === 500) {
              this.$displayError("Une erreur est survenue depuis nos serveurs, veuillez nous en excuser.");
            } else {
              this.$displayError("Une erreur est survenue.");
            }
          } else {
            this.$displayError("Une erreur est survenue.");
          }
        }
      }
    }

    modifyExercise() {
      if (this.isAdmin || this.isSuperAdmin) {
        this.$router.push('/administration/exercices/' + this.exercise.id)
      } else if (this.isUser) {
        this.$router.push('/gestion/mes-exercices/' + this.exercise.id)
      }
    }

    async downloadFile() {
      try {

        const result:Blob = await this.$axios.$get(`/files/${this.exercise.file}`, {responseType: 'blob'});

        download(result, "archive.zip", result.type);

        this.$displaySuccess("Téléchargement éffectué.");

      } catch (e) {
        const error = e as AxiosError;

        if (error.response) {
          const status: number = error.response.status;

          if (status === 404) {
            this.$displayError(`Ce fichier est introuvable`);
          } else if (status === 500) {
            this.$displayError(`Une erreur est survenue lors du téléchargement.`);
          }
        } else {
          this.$displayError(`Une erreur est survenue lors du téléchargement.`);
        }
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

    .status {
        font-weight: 300;
        line-height: 25px;
        margin-top: 5px;
        svg {
          vertical-align: middle;
          width: 25px;
          margin-left: 5px;
        }

    }

    .exercise {
      position: relative;

      .score__info {
        display: flex;

        h4 {
          margin-bottom: 5px;
        }

        > div:not(:first-child) {
          margin-left: 35px;
        }

      }

      .avg-score {
        display: inline-block;

        span {
          display: inline-block;
        }

        svg {
          width: 25px;
          vertical-align: -6px;
        }
      }

      .button-wrapper {
        text-align: left;
      }

      button {
        font-size: .75em;
        min-width: 250px;
      }

      button.modify-button {
        position: absolute;
        right: 20px;
        top: 20px;
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
