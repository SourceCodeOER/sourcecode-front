<template>
  <div class="container--with-menu" id="Profile">
    <div class="banner banner__nav banner--with-shadow-bottom">
      <div class="banner__nav">
        <span>
          Gestion > Mon profil
        </span>
      </div>
    </div>

    <div class="wrapper">
      <div class="content">
        <h1>Mon profil</h1>

        <div class="profile__item">
          <h2 class="title--secondary-color">Rôle</h2>
          {{user.role}}
        </div>
        <div class="profile__item">
          <h2 class="title--secondary-color">Adresse mail</h2>
          {{user.email}}
        </div>
        <div class="profile__item">
          <h2 class="title--secondary-color">Nom complet</h2>
          {{user.fullName}}
        </div>

      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator'
  import Icon from "~/components/Symbols/Icon.vue";
  import {UserInfo} from "~/types";

  @Component({
    components: {
      Icon
    },
    async asyncData({$auth}) {
      return {user: $auth.user}
    }
  })
  export default class extends Vue {
    user!: UserInfo;

    mounted() {
      console.log(this.user)
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/css/_variables";
  @import "../../assets/css/_function";

  #Profile {

    h1 {
      margin-bottom: 20px;
    }

    .content {
      background-color: white;
      border-radius: 4px;
      @include box-shadow($SHADOW);
      padding: 20px;

    }

    .profile__item {
      h2 {
        margin-bottom: 5px;
      }

      margin-bottom: 20px;
    }
  }
</style>
