<template>
  <v-container>
    <v-row class="ma-0 ma-md-3" v-if="!loading">
      <v-col cols="12" md="4">
        <v-card outlined class="pa-6" width="100%">
          <transition name="fade" mode="out-in">
          <v-row :key="showLossInfo">
            <v-col>
              <span>Зарплата</span>
              <h1>{{ (showLossInfo ? losses.loss_salary : info.currentMonth.salary).toLocaleString('hi-IN') + ' ₽' }}</h1>
            </v-col>
            <v-col class="mt-4" md="4">
              <v-icon x-large :color="showLossInfo ? 'red' : 'green'">mdi-currency-rub</v-icon>
            </v-col>
          </v-row>
          </transition>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card outlined class="pa-6" width="100%">
            <v-row :key="showLossInfo">
              <v-col>
                <span>Выработка</span>
                <v-tooltip v-if="showLossInfo" top>
                  <template v-slot:activator="{ on, attrs }">
                    <h1 v-bind="attrs" v-on="on">{{ losses.loss_hours }}</h1>
                  </template>
                  <span>Рабочие часы, которые не были отмечены</span>
                </v-tooltip>
                <h1 v-else>{{ showLossInfo ? losses.loss_hours : info.currentMonth.hours }}</h1>
              </v-col>
              <v-col class="mt-4 text-center align-content-center justify-center">
                <v-icon
                    @click.prevent="showLossInfo = !showLossInfo"
                    x-large
                    :color="showLossInfo ? 'red' : 'blue'">
                  mdi-clock
                </v-icon>
              </v-col>
            </v-row>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card outlined class="pa-6" width="100%">
          <v-row>
            <v-col>
              <span>Премия</span>
              <h1>{{ this.info.currentMonth.prize.toLocaleString('hi-IN') + ' ₽' }}</h1>
            </v-col>
            <v-col class="mt-4" md="4">
              <v-icon x-large color="green">mdi-currency-rub</v-icon>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>


    <v-skeleton-loader max-width="calc(100% - 32px)" transition="scale-transition" :loading="!info.short_labels"
                       type="image">
      <div class="pa-4">
        <vue-apex-charts v-if="info.labels.length" height="400" width="100%" type="line" :options="options"
                         :series="charts.salary.series"/>
      </div>
    </v-skeleton-loader>

    <v-row class="ma-0 ma-md-3">
      <v-col cols="12" md="6">
        <h2>Отмеченное время</h2>
        <v-skeleton-loader max-width="calc(100% - 32px)" transition="scale-transition" :loading="!info.short_labels"
                           type="image">
          <div class="pa-4">
            <vue-apex-charts v-if="info.labels.length" width="100%" type="line" :options="options"
                             :series="charts.time.series"/>
          </div>
        </v-skeleton-loader>
      </v-col>
      <v-col cols="12" md="6">
        <h2>Премия</h2>
        <v-skeleton-loader max-width="calc(100% - 32px)" transition="scale-transition" :loading="!info.short_labels"
                           type="image">
          <div class="pa-4">
            <vue-apex-charts v-if="info.labels.length" width="100%" type="line" :options="options"
                             :series="charts.prize.series"/>
          </div>
        </v-skeleton-loader>
      </v-col>
    </v-row>

    <h2 class="mt-4">Кол-во отмеченного времени</h2>
    <v-skeleton-loader max-width="calc(100% - 32px)" transition="scale-transition" :loading="!info.short_labels"
                       type="image">
      <div class="pa-4">
        <vue-apex-charts v-if="info.labels.length" :height="this.isMobile() ? 700 : 300" width="100%" type="bar"
                         :options="options" :series="charts.tracked.series"/>
      </div>
    </v-skeleton-loader>
  </v-container>
</template>

<script>
import {mapGetters} from 'vuex'
import dateFormat from 'dateformat'
import VueApexCharts from 'vue-apexcharts'
import isMobile from "@/mixins/isMobile";

export default {
  name: "Index",
  components: {
    VueApexCharts,
  },
  mixins: [isMobile],
  data: () => ({
    dateFormat,
    options: {
      chart: {
        toolbar: {
          tools: {
            download: true,
            selection: false,
            zoom: false,
            zoomin: false,
            zoomout: false,
            pan: false,
            reset: false,
            customIcons: []
          },
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
        }
      },
      xaxis: {
        categories: []
      }
    },
    charts: {
      salary: {
        series: [
          {
            name: 'Зарплата',
            data: []
          },
          {
            name: 'Премия',
            data: []
          },
        ],
      },
      time: {
        series: [{
          name: 'Время',
          data: []
        }],
      },
      prize: {
        series: [{
          name: 'Премия',
          data: []
        }],
      },
      tracked: {
        series: [
          {
            name: 'Отмеченное время',
            data: []
          },
          {
            name: 'Рабочие часы',
            data: []
          },
        ],
      }
    },

    loading: true,
    showLossInfo: false,
    info: {
      full: {},
      labels: [],
      values: [],
      currentMonth: {}
    },
    prizeValues: [],
    trackedValues: []
  }),
  computed: {
    ...mapGetters([
      'user',
      'statistic',
      'losses'
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
    start.setMonth(start.getMonth() - 11); // за год. 11, т.к учитывается индекс
    this.$store.dispatch('statistic', {
      from: dateFormat(start, format),
      to: dateFormat(new Date(), format)
    })
    this.$store.dispatch('losses')
  },
  mounted() {
    this.options.plotOptions.bar.horizontal = this.isMobile()
    if (this.statistic) {
      this.loadInfo(this.statistic)
    }
  },
  methods: {
    loadInfo(payload) {
      if (!Object.keys(payload).length) return

      this.info = payload;
      this.info.currentMonth = this.info.tracked_time[this.info.tracked_time.length - 1];
      this.prizeValues = this.info.tracked_time.map(el => el.prize)
      this.trackedValues = this.info.tracked_time.map(el => el.hours)
      let workHours = this.info.tracked_time.map(el => el.full_hours)

      this.charts.prize.series[0].data = this.prizeValues
      this.charts.time.series[0].data = this.trackedValues
      this.charts.tracked.series[0].data = this.trackedValues
      this.charts.tracked.series[1].data = workHours
      this.charts.salary.series[0].data = this.info.values
      this.charts.salary.series[1].data = this.prizeValues

      this.options.xaxis.categories = this.info.labels
      this.loading = false
    },
  }
}
</script>
