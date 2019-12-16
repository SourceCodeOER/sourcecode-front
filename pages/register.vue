<template>
  <div class="container">

    <div class="wrapper">
      <picture>
        <img src="@/assets/logo/logo.png" alt="Source Code : Logo">
      </picture>

      <h1>Rejoignez notre communauté !</h1>
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

        <ValidationProvider tag="label"
                            mode="eager"
                            name="nom complet"
                            rules="required"
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

  @Component({
    layout: 'authentification',
    components: {
      ValidationProvider,
      ValidationObserver
    }
  })
  export default class extends Vue {
    form: { password: string; fullName: string; email: string } = {
      email: '',
      password: '',
      fullName: ''
    };

    isSubmit: boolean = false;

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

          await this.$auth.loginWith('local', {
            data: {
              email: this.form.email,
              password: this.form.password
            },
          });

          this.$router.push('/');
          //this.responseMessage = this.$t('contact.success');
        } catch (e) {
          throw new e
          //this.responseMessage = this.$t('contact.error');
        }

        this.isSubmit = true;

        this.resetFields();

        requestAnimationFrame(() => {
          this.observer.reset();
        });

        setTimeout(() => {
          this.isSubmit = false;
        }, 5000);
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../assets/css/_auth";
</style>
