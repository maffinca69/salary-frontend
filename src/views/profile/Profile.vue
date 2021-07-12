<template>
  <v-container fluid>
    <v-layout column>
      <v-form ref="form" @submit.prevent="validate">
        <v-card width="auto" :loading="disableFields">
          <v-card-text>
            <v-container fill-height fluid>
              <v-row align="center" justify="center">
                <transition name="slide-fade" mode="out-in">
                  <div :key="Math.random().toString(36).substring(7)">
                    <v-avatar :color="color" @click="openAvatarPicker" size="96">
                      <span class="white--text text-h5">{{ avatarShortName }}</span>
                    </v-avatar>
                  </div>
                </transition>
              </v-row>
              <v-row align="center" justify="center" class="mt-5 text-center">
                Тут должна была быть аватарка, но ее нет ¯\_(ツ)_/¯
              </v-row>
            </v-container>
            <v-text-field
                required
                :disabled="disableFields"
                :error-messages="errorMessages.first_name"
                v-model="form.first_name"
                label="Имя"></v-text-field>
            <v-text-field
                required
                :disabled="disableFields"
                :error-messages="errorMessages.last_name"
                v-model="form.last_name"
                label="Фамилия"></v-text-field>
            <v-text-field
                required
                :disabled="disableFields"
                :error-messages="errorMessages.username"
                v-model="form.username"
                hint="Используется для входа в учетную запись"
                persistent-hint
                label="Юзернейм"/>
            <v-text-field
                type="password"
                required
                :disabled="disableFields"
                :error-messages="errorMessages.password"
                v-model="form.password"
                label="Пароль"/>
            <v-text-field
                type="password"
                required
                :disabled="disableFields"
                :error-messages="errorMessages.password_confirmation"
                v-model="form.password_confirmation"
                label="Подтверждение пароля"/>
          </v-card-text>
          <v-card-actions>
            <v-btn block :disabled="disableFields" color="primary" :loading="disableFields" @click.prevent="validate">
              <v-icon left dark>mdi-content-save</v-icon>
              Сохранить
            </v-btn>
          </v-card-actions>
          <v-card-actions>
            <v-btn block class="white--text" :disabled="disableFields" color="red" :loading="disableFields" @click.prevent="$modal.open(redmineModal)">
              <v-icon left dark>mdi-content-save</v-icon>
              Интеграция с Redmine
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-layout>
  </v-container>
</template>

<script>
import {mapGetters} from 'vuex';
import axios from '@/plugins/axios'

export default {
  name: "Profile",
  data: () => ({
    redmineModal: 'redmine-integration-modal',
    loading: false,
    disable: false,
    form: {
      first_name: '',
      last_name: '',
      username: '',
      userData: {

      }
    },
    errorMessages: {},
    colors: [
      'red',
      'pink',
      'indigo',
      'purple',
      'blue',
      'teal',
      'green',
    ],
    color: 'red'
  }),
  computed: {
    ...mapGetters([
      'user'
    ]),
    disableFields() {
      return Object.keys(this.user).length === 0 || this.disable;
    },
    avatarShortName() {
      if (!this.form.first_name || !this.form.last_name) {
        return ''
      }

      return (this.form.first_name.charAt(0) + this.form.last_name.charAt(0)).toUpperCase()
    }
  },
  watch: {
    user(data) {
      this.form = data;
    },
  },
  mounted() {
    this.setRandomAvatarColor()
    this.form = this.user;
  },
  methods: {
    setRandomAvatarColor() {
      this.color = this.colors[Math.floor(Math.random() * this.colors.length)]
    },
    openAvatarPicker() {
      this.showAvatarPicker = true
    },
    selectAvatar(avatar) {
      this.form.avatar = avatar
    },
    async validate() {
      if (!this.$refs.form.validate()) {
        return;
      }

      this.disable = true

      this.errorMessages = {}
      await this.save(this.form).catch(error => {
        this.errorMessages = error.response.data.errors
      }).finally(() => {
        this.disable = false
      });
    },
    async save(payload) {
      return await axios.post('/users/update', payload).then(response => {
        const data = response.data.data
        this.form = data
        this.$store.commit('setUser', data)
        this.$emit('alert', 'success', 'Данные успешно обновлены!')
      })
    }
  }
}
</script>

<style scoped>

</style>
