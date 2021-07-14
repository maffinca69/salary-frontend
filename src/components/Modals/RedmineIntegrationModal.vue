<template>
<modal :name="name">
  <template v-slot:header>
    Интеграция с Redmine
  </template>
  <v-form ref="form" @submit.prevent="validate">
    <v-text-field
        label="Логин"
        required
        :disabled="loading"
        v-model="form.username"
        :error-messages="errorMessages.username">
    </v-text-field>
    <v-text-field
        label="Пароль"
        required
        :disabled="loading"
        v-model="form.password"
        :error-messages="errorMessages.password">
    </v-text-field>
  </v-form>
  <template v-slot:footer>
    <v-btn :loading="loading" color="success" block @click.prevent="validate">Сохранить</v-btn>
  </template>
</modal>
</template>

<script>
import axios from '@/plugins/axios'
import { mapGetters } from 'vuex'

export default {
  name: "RedmineIntegrationModal",
  props: {
    name: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    loading: false,
    errorMessages: {},
    form: {
      username: '',
      password: '',
    }
  }),
  computed: {
    ...mapGetters([
      'user'
    ]),
  },
  mounted() {
    if (!this.user) return

    // this.form.username = this.user.redmine.username
    // this.form.password = this.user.redmine.password
  },
  watch: {
    user(data) {
      console.log(data)
      // this.form.username = data.redmine.sername
      // this.form.password = data.redmine.password
    }
  },
  methods: {
    async validate() {
      if (!this.$refs.form.validate()) {
        return;
      }

      await this.saveKey(this.form)
    },
    async saveKey(payload) {
      this.loading = true
      payload = payload.redmine
      return await axios.post('/users/update', payload).then(response => {
        const data = response.data.data
        this.form = data
        this.$store.commit('setUser', data)
        this.$root.$emit('alert', 'success', 'Ключ успешно сохранен!')
        this.$modal.close(this.$options._componentTag)
      }).catch(error => {
        this.errorMessages = error.response.data.errors
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style scoped>

</style>
