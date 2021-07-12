import Modal from "@/components/Modals/Modal";

const defaultOptions = {
    componentName: 'Modal'
}

export default {
    install(Vue, options = {}) {
        if (this.installed) {
            // Singleton pattern – make sure we don't use more than one plugin instance
            return
        }

        this.installed = true
        this.eventBus = new Vue()

        Vue.prototype.$modal = {
            open: name => {
                this.eventBus.$emit('open', name)
            },
            close: name => {
                this.eventBus.$emit('close', name)
            }
        }

        // Register our Modal component globally
        Vue.component(options.componentName || defaultOptions.componentName, Modal)
    }
}
