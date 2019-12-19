<template>
  <div class="container">
    <NotificationError ref="notificationError" :message="message"/>

    <div class="wrapper">
      <picture>
        <img src="@/assets/logo/logo.png" alt="Source Code : Logo">
      </picture>

      <h1>Rejoignez notre communauté !</h1>
      <ValidationObserver ref="observer" tag="form" v-slot="{ valid }" @submit.prevent="validateBeforeSubmit()">
        <ValidationProvider tag="label"
                            name="email"
                            rules="required|email"
                            v-slot="{ errors }">
          Adresse email
          <input id="Email" name="email" v-model="form.email" class="input--grey" type="email">
          <span class="error-message">{{errors[0]}}</span>
        </ValidationProvider>

        <ValidationProvider tag="label"
                            name="mot de passe"
                            rules="required"
                            v-slot="{ errors }">
          Mot de passe
          <input id="Password" name="password" v-model="form.password" class="input--grey" type="password">
          <span class="error-message">{{errors[0]}}</span>
        </ValidationProvider>

        <ValidationProvider tag="label"
                            name="nom complet"
                            rules="required|max:50"
                            v-slot="{ errors }">
          Nom complet
          <input id="FullName" name="fullname" v-model="form.fullName" class="input--grey" type="text">
          <span class="error-message">{{errors[0]}}</span>
        </ValidationProvider>

        <div class="button-wrapper">
          <button :class="{'button--ternary-color': !valid, 'button--ternary-color-reverse': valid}" type="submit">
            S'enregistrer
          </button>
        </div>
      </ValidationObserver>

    </div>
  </div>
</template>

<script lang="ts">
  import {ValidationProvider, ValidationObserver} from 'vee-validate';
  import {Component, Ref, Vue} from "vue-property-decorator";
  import {AxiosError} from "~/node_modules/axios";
  import Notification from "~/components/Notification/Notification";
  import NotificationError from "~/components/Notification/NotificationError.vue";


  @Component({
    layout: 'authentication',
    components: {
      ValidationProvider,
      ValidationObserver,
      NotificationError
    }
  })
  export default class extends Vue {
    form: { password: string; fullName: string; email: string } = {
      email: '',
      password: '',
      fullName: ''
    };

    message: string = "Une erreur est survenue :(";

    @Ref() notificationError!: Notification;

    @Ref() observer!: InstanceType<typeof ValidationObserver>;

    private resetFields() {
      this.form = {
        email: '',
        password: '',
        fullName: ''
      };
    }

    async validateBeforeSubmit() {

      const isValid = await this.observer.validate();
      if (isValid) {

        try {
          await this.$axios.post('auth/register', this.form);

          const {data} = await this.$axios.post('/auth/login', {
            email: this.form.email,
            password: this.form.password
          });

          await this.$auth.setUserToken(data.token);

          this.$accessor.user.SET_USER_INFO(data.user);

          this.$router.back()
        } catch (e) {

          const error: AxiosError = (e as AxiosError);

          if (error.response) {
            switch (error.response.status) {
              case 409:
                this.message = "Cette adresse email existe déjà !";
                break;
              case 400:
                this.message = "Un ou plusieurs champs semblent incorrectes.";
                break;
              default:
                this.message = "Une erreur est survenue depuis notre serveur :(";
                break;
            }
            this.notificationError.display();

            setTimeout(() => {
              this.notificationError.dissim()
            }, 4000)
          }
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../assets/css/_auth";
</style>
