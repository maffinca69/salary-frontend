<template>
  <transition name="modal-fade">

    <div  @click.self="$modal.close(name)" v-if="isOpen">
      <div class="modal">
        <div class="modal-content">
          <v-dialog
              v-model="isOpen"
              max-width="500"
          >
            <v-card>
              <v-toolbar dark color="primary">
                <v-toolbar-title>
                  <slot name="header"></slot>
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-items>
                  <v-btn icon dark @click="isOpen = false">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </v-toolbar-items>
              </v-toolbar>

              <v-card-text class="mt-4">
                <slot></slot>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>

                <slot name="footer"></slot>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import ModalPlugin from '../../plugins/Modal'
export default {
  name: 'Modal',
  props: ['name'],
  data() {
    return {
      isOpen: false
    }
  },
  created() {
    ModalPlugin.eventBus.$on('open', name => {
      return this.isOpen = name === this.$options.parent.$options._componentTag
    })
    ModalPlugin.eventBus.$on('close', name => {
      if (name === this.$options.parent.$options._componentTag) {
        this.isOpen = false
      }
    })
  }
}
</script>
