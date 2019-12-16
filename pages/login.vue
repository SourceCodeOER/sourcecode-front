<template>
  <div class="container">
    <NotificationError ref="notificationError" message="La combinaison email / mot de passe est incorrecte !"/>

    <div class="wrapper">
      <picture>
        <img src="@/assets/logo/logo.png" alt="Source Code : Logo">
      </picture>

      <h1>Se connecter</h1>
      <ValidationObserver ref="observer" tag="form" v-slot="{ valid }" @submit.prevent="validateBeforeSubmit()">
        <ValidationProvider tag="label"
                            mode="eager"
                            name="email"
                            rules="required|email"
                            v-slot="{ errors }">
          Adresse email
          <input id="Email" name="email" v-model="form.email" class="input--grey" type="email">
          <span class="error-message">{{errors[0]}}</span>
        </ValidationProvider>

        <ValidationProvider tag="label"
                            mode="eager"
                            name="mot de passe"
                            rules="required"
                            v-slot="{ errors }">
          Mot de passe
          <input id="Password" name="password" v-model="form.password" class="input--grey" type="password">
          <span class="error-message">{{errors[0]}}</span>
        </ValidationProvider>

        <div class="button-wrapper">
          <button :class="{'button--ternary-color': !valid, 'button--ternary-color-reverse': valid}" type="submit">
            Se connecter
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
  import NotificationError from "~/components/Notification/NotificationError.vue";
  import Notification from "~/components/Notification/Notification";

  @Component({
    layout: 'authentification',
    components: {
      ValidationProvider,
      ValidationObserver,
      NotificationError
    }
  })
  export default class extends Vue {

    @Ref() notificationError!: Notification;

    form: { password: string; email: string } = {
      email: '',
      password: ''
    };

    @Ref() observer!: InstanceType<typeof ValidationObserver>;

    private resetFields() {
      this.form = {
        email: '',
        password: '',
      };
    }

    async validateBeforeSubmit() {

      const isValid = await this.observer.validate();
      if (isValid) {
        try {
          await this.$auth.loginWith('local', {
            data: {
              email: this.form.email,
              password: this.form.password
            },
          });

          this.$router.back()
        } catch (e) {

          const error: AxiosError = (e as AxiosError);

          if (error.response) {
            if (error.response.status === 401) {
              this.notificationError.display();

              setTimeout(() => {
                this.notificationError.dissim()
              }, 4000)
            }
          }
        }

      }
    }
  }
</script>


<style lang="scss" scoped>
  @import "../assets/css/_auth";
</style>
