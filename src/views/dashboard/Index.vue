<template>
  <v-container fluid class="ma-3">
    <v-row class="mb-6" no-gutters>
      <v-col>
        <h2>Dashboard</h2>

        <div class="mt-5 mb-5">
          <v-row>
            <v-col>
              <v-card outlined class="pa-5" max-width="280">
                <v-row>
                  <v-col>
                    <span>Зарплата</span>
                    <h1>170.500</h1>
                  </v-col>
                  <v-col class="mt-4 text-center align-content-center justify-center">
                    <v-icon x-large color="green" class="ms-6 me-6">mdi-currency-rub</v-icon>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
            <v-col>
              <v-card outlined class="pa-5" max-width="280">
                <v-row>
                <v-col>
                  <span>Затрекано</span>
                  <h1>116 ч.</h1>
                </v-col>
                <v-col class="mt-4 text-center align-content-center justify-center">
                  <v-icon x-large color="blue" class="ms-6 me-6">mdi-clock</v-icon>
                </v-col>
              </v-row>
              </v-card>
            </v-col>
            <v-col>
              <v-card outlined class="pa-5" max-width="280">
                <v-row>
                  <v-col>
                    <span>Премия</span>
                    <h1>9.900</h1>
                  </v-col>
                  <v-col class="mt-4 text-center align-content-center justify-center">
                    <v-icon x-large color="green" class="ms-6 me-6">mdi-currency-rub</v-icon>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
          </v-row>
        </div>

        <div class="text-center mt-2">
          <v-skeleton-loader max-width="calc(100% - 32px)" transition="scale-transition" :loading="!info.short_labels"
                             type="image">
            <v-sheet
                class="v-sheet--offset white"
                outlined
                elevation="1"
                :rounded="'lg'"
                max-width="calc(100% - 32px)"
            >
              <v-sparkline
                  :labels="info.short_labels"
                  :value="info.values"
                  stroke-linecap="round"
                  auto-draw
                  label-size="5"
                  :smooth="radius || false"
                  color="light-blue accent-4"
                  line-width="2"
                  padding="16"
              ></v-sparkline>
            </v-sheet>
          </v-skeleton-loader>
        </div>
      </v-col>
    </v-row>
    <v-row class="mb-6" no-gutters>
      <v-col>
        <h2>Отмеченное время</h2>
        <div class="text-center mt-2">
          <v-skeleton-loader max-width="calc(100% - 32px)" transition="scale-transition" :loading="!info.short_labels"
                             type="image">
            <v-sheet
                class="v-sheet--offset text-center align-center white"
                elevation="12"
                :rounded="'lg'"
                max-width="calc(100% - 32px)"
            >
              <v-skeleton-loader v-if="!info.short_labels" type="image"/>
              <v-sparkline
                  :labels="info.short_labels"
                  :value="trackedValues"
                  auto-draw
                  stroke-linecap="round"
                  :smooth="radius || false"
                  color="light-blue accent-4"
                  line-width="2"
                  padding="16"
              ></v-sparkline>
            </v-sheet>
          </v-skeleton-loader>
        </div>
      </v-col>
      <v-col class="mb-6" no-gutters>
        <h2>Премия</h2>
        <div class="text-center mt-2">
          <v-skeleton-loader max-width="calc(100% - 32px)" transition="scale-transition" :loading="!info.short_labels"
                             type="image">
            <v-sheet
                class="v-sheet--offset text-center align-center white"
                elevation="12"
                :rounded="'lg'"
                max-width="calc(100% - 32px)"
            >
              <v-skeleton-loader v-if="!info.short_labels" type="image"/>
              <v-sparkline
                  :labels="info.short_labels"
                  :value="prizeValues"
                  auto-draw
                  :smooth="radius || false"
                  stroke-linecap="round"
                  color="light-blue accent-4"
                  line-width="2"
                  padding="16"
              ></v-sparkline>
            </v-sheet>
          </v-skeleton-loader>
        </div>
      </v-col>
    </v-row>

    <h2 class="mt-4">Кол-во отмеченного времени</h2>
    <v-row no-gutters class="text-start">
      <v-col v-for="(item, index) in info.tracked_time" :key="index" cols="4" md="2">
        <h3 class="mt-4 text-capitalize">{{ item.name }}</h3>
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-progress-circular
                :rotate="-90"
                :size="100"
                class="mt-2"
                :width="15"
                :value="item.percent"
                :color="getColorFromPercent(item.percent)"
                v-bind="attrs"
                v-on="on"
            >
              {{ item.percent }}
            </v-progress-circular>
          </template>
          <span>{{
              item.prize === 0 ? ('Потери: ' + convertToCurrency(item.loss_salary) + '₽') : ('Премия: ' + convertToCurrency(item.prize) + '₽')
            }}</span>
        </v-tooltip>

      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import {mapGetters} from 'vuex'
import dateFormat from 'dateformat'

export default {
  name: "Index",
  data: () => ({
    dateFormat,
    radius: 2,
    gradient: ['purple', 'white'],
    info: {
      full: {},
      labels: [],
      values: []
    },
    prizeValues: [],
    trackedValues: []
  }),
  computed: {
    ...mapGetters([
      'user',
      'statistic'
    ]),
  },
  watch: {
    statistic(data) {
      this.loadInfo(data)
    }
  },
  created() {
    const format = 'yyyy-mm-dd'
    let start = new Date();
    start.setMonth(start.getMonth() - 12); // за год
    this.$store.dispatch('statistic', {
      from: dateFormat(start, format),
      to: dateFormat(new Date(), format)
    })
  },
  mounted() {
    if (this.statistic) {
      this.loadInfo(this.statistic)
    }
  },
  methods: {
    convertToCurrency: (value) => Number(value).toFixed(value.length >= 4 ? 3 : 2),
    loadInfo(payload) {
      if (!Object.keys(payload).length) return

      this.info = payload;
      this.prizeValues = this.info.tracked_time.map(el => el.prize)
      this.trackedValues = this.info.tracked_time.map(el => el.hours)
    },
    getColorFromPercent: percent => {
      if (percent >= 95) {
        return 'green'
      }

      if (percent >= 85) {
        return 'amber'
      }

      return 'deep-orange'
    },
  }
}
</script>

<style scoped>

</style>
