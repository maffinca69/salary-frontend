<template>
  <v-form ref="form" @submit.prevent="validate">
    <v-text-field
        label="Логин"
        prepend-icon="mdi-account"
        v-model="form.username"
        required
        :error-messages="errorMessages.username"
    ></v-text-field>

    <v-text-field
        label="Пароль"
        prepend-icon="mdi-lock"
        type="password"
        v-model="form.password"
        :error-messages="errorMessages.password"
        required
    ></v-text-field>

    <v-text-field
        label="Подтверждение пароля"
        prepend-icon="mdi-lock"
        type="password"
        v-model="form.password_confirmation"
        required
    ></v-text-field>

    <div class="text-center">
      <v-btn
          :loading="loading"
          color="primary"
          large
          type="submit"
          text
          rounded
      >{{ 'Зарегистрироваться' }}</v-btn>
      <v-btn
          @click.prevent="login"
          color="primary"
          large
          text
          rounded
      >{{ 'Войти' }}</v-btn>
    </div>
  </v-form>
</template>

<script>
// import axios from '@/plugins/axios'

export default {
  data() {
    return {
      form: {
        username: null,
        password: null,
      },
      errorMessages: {},
      loading: false,
    };
  },
  methods: {
    async validate() {
      if (this.$refs.form.validate()) {
        this.loading = true;
        this.errorMessages = {}
        await this.register(this.form).then(() => {
          this.$router.push({name: 'login', params: {username: this.form.username}})
        }).catch(error => {
          this.errorMessages = error.response.data.errors
        });
        this.loading = false;
      }
    },
    async register(form) {
      return this.$store.dispatch('register', form)
    },
    login() {
      this.$router.push({name: 'login'})
    }
  },
};
</script>
