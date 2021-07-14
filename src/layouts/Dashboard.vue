<template>
  <v-app id="inspire">
    <v-navigation-drawer
        v-model="drawer"
        app
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
          <v-btn block @click.prevent="logout" dark>
            Выйти
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <v-app-bar app flat>
        <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

        <v-toolbar-title>
          <b>{{ this.$router.currentRoute.meta.title || 'Статистика зарплаты' }}</b>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon v-bind="attrs" v-on="on" color="blue" class="ms-2">mdi-information-outline</v-icon>
            </template>
            <span>Статистика запрашивается в реальном времени</span>
          </v-tooltip>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <div @click.prevent="toggleTheme">
          <v-icon class="me-3" large v-if="!$vuetify.theme.dark">mdi-moon-waxing-crescent</v-icon>
          <v-icon class="me-3" large v-else>mdi-white-balance-sunny</v-icon>
        </div>
    </v-app-bar>
    <app-modal></app-modal>
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
import AppModal from "../components/base/AppModal";

export default {
  name: "Dashboard",
  components: {
    AppModal
  },
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
  mounted() {
    this.$router.push({name: 'index'}).catch(() => {})
    this.$root.$on('alert', (color, text) => {
      this.showAlert(color, text)
    })
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
    },
    toggleTheme() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark
      this.$store.dispatch('toggleTheme')
    }
  }
}
</script>

<style scoped>

</style>
