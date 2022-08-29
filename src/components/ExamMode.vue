<template>
  <div>
    ExamMode
    {{ msg }}
  </div>
</template>

<script lang="ts">
import Topic from "../types/Topic";
import { Options, Vue } from "vue-class-component";

@Options({
  props: {
    msg: Topic
  }
})
export default class ExamMode extends Vue {}
</script>

<style scoped></style>
