<template>
  <div>
    PreExamMode
    {{ msg }}
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
  props: {
    msg: String
  }
})
export default class PreExamMode extends Vue {}
</script>

<style scoped></style>
