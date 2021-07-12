<template>
  <div id="modals">
    <redmine-integration-modal></redmine-integration-modal>
  </div>
</template>

<script>
import RedmineIntegrationModal from "../Modals/RedmineIntegrationModal";

export default {
  name: "AppModal",
  components: {
    RedmineIntegrationModal,
  }
}
</script>

<style scoped>

</style>
