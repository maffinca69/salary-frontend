<template>
  <v-app id="inspire">
    <v-navigation-drawer
        v-model="drawer"
        app
        class="deep-purple accent-4"
        dark
    >
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="text-h6">
            {{ user.full_name || 'Пользователь' }}
          </v-list-item-title>
          <v-list-item-subtitle>
            {{ user.username || ''}}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense nav>
        <v-list-item
            v-for="item in items"
            :key="item.title"
            link
            @click.prevent="clickItem(item.action)"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <template v-slot:append>
        <div class="pa-2">
          <v-btn block @click.prevent="logout">
            Выйти
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <v-app-bar app class="deep-purple accent-4" dark>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>Статистика зарплаты</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <v-snackbar top timeout="2500" v-model="alert.show" :color="alert.color" :icon="alert.color === 'success' ? 'mdi-check-circle' : 'mdi-close-circle'">
        {{ alert.text }}
      </v-snackbar>
      <router-view @alert="showAlert" v-slot="{ Component }">
        <transition name="slide">
          <component :is="Component" />
        </transition>
      </router-view>
    </v-main>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: "Dashboard",
  data: () => ({
    drawer: null,
    items: [
      { title: 'Дашборд', icon: 'mdi-view-dashboard', action: 'home'},
      { title: 'Настройки профиля', icon: 'mdi-account-settings-outline', action: 'profile' },
    ],
    right: null,
    alert: {
      show: false,
      color: 'red',
      text: ''
    }
  }),
  created() {
    this.$store.dispatch('fetchUser')
  },
  computed: {
    ...mapGetters([
        'user'
    ])
  },
  methods: {
    showAlert(color, text) {
      this.alert.color = color
      this.alert.text = text
      this.alert.show = true
    },
    closeDrawer() {
      this.drawer = null
    },
    logout() {
      this.$store.dispatch('logout')
    },
    clickItem(action) {
      this.$router.push({name: action});
      this.closeDrawer();
    }
  }
}
</script>

<style scoped>

</style>
