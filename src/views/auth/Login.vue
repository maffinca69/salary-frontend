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
      >{{ 'Войти' }}</v-btn
      >
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
        await this.login(this.form).catch(error => {
          this.errorMessages = error.response.data.errors
        });
        this.loading = false;
      }
    },
    async login(form) {
      return this.$store.dispatch('login', form)
    }
  },
};
</script>
