<template>
<modal :name="name">
  <template v-slot:header>
    Интеграция с Redmine
  </template>
  <v-form ref="form" @submit.prevent="validate">
    <v-text-field
        label="Redmine API KEY"
        required
        :disabled="loading"
        v-model="form.redmine_api_key"
        :error-messages="errorMessages.key">
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
      redmine_api_key: ''
    }
  }),
  computed: {
    ...mapGetters([
      'user'
    ]),
  },
  mounted() {
    if (!this.user) return

    this.form.redmine_api_key = this.user.redmine_api_key
  },
  watch: {
    user(data) {
      this.form.redmine_api_key = data.redmine_api_key
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
