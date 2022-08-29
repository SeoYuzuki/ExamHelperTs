<template>
  <div>
    ExamMode
    {{ topicList }}
  </div>
</template>

<script lang="ts">
import Topic from "../types/Topic";
import { Options, Vue } from "vue-class-component";

@Options({
  props: {
    topicList: []
  }
})
export default class ExamMode extends Vue {
  topicIndex: number;
}
</script>

<style scoped></style>
