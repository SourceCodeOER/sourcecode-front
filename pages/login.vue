<template>
  <div class="container">
    <div class="wrapper">
      <picture>
        <img src="@/assets/logo/logo.png" alt="Source Code : Logo">
      </picture>

      <h1>Se connecter</h1>
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
  import {AxiosError} from "axios";
  import {BusEvent} from "~/components/Event/BusEvent";
  import {AuthRequest} from "~/types";

  @Component({
    layout: 'authentication',
    components: {
      ValidationProvider,
      ValidationObserver
    },
    auth: "guest"
  })
  export default class extends Vue {

    form: AuthRequest = {
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
            switch (error.response.status) {
              case 401:
                this.$displayError("La combinaison adresse email / mot de passe est incorrecte.");
                break;
              case 400:
                this.$displayError("Un ou plusieurs champs semblent incorrectes.");
                break;
              default:
                this.$displayError("Une erreur est survenue depuis notre serveur :(");
                break;
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
