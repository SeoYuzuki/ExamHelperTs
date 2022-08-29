<template>
  <div class="hello">
    <!-- <Slider v-model="value" range /> -->
    <Grid :col="4">
      <GridItem>1</GridItem>
      <GridItem>2</GridItem>
      <GridItem>3</GridItem>
      <GridItem>4</GridItem>
      <GridItem>5</GridItem>
      <GridItem>6</GridItem>
      <GridItem>7</GridItem>
      <GridItem>8</GridItem>
      <Select
        style="width: 100px"
        v-model="selectedTopics"
        multiple
        @on-change="onSelectChange"
      >
        <Option
          v-for="topic in topicLibList"
          :value="topic.topicName"
          :key="topic.topicName"
        >
          {{ topic.topicName }}
        </Option>
      </Select>
      <Button type="primary" @click="changeMode">確定</Button>
      {{ mode }}
      <PreExamMode v-if="mode === '1'" msg="ttt" />
      <ExamMode v-if="mode === '2'" msg="rrr" />

      <FooterToolbar extra="额外信息">
        <Button>取消</Button>
        <Button type="primary">提交</Button>
      </FooterToolbar>
    </Grid>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Topic from "../types/Topic";
import ExamMode from "./ExamMode.vue";
import PreExamMode from "./PreExamMode.vue";
import testtopic1 from "./topic1 copy.json";

@Options({
  components: {
    PreExamMode,
    ExamMode
  },
  props: {
    msg: String
  }
})
export default class MainPage extends Vue {
  topicUploadList = [];
  topicLibList: Topic[] = []; //ok
  selectedTopics: string[] = [];

  topicFromWhere = "select"; //先寫死

  msg!: string;
  mode = "1";
  config: Topic = testtopic1;
  changeMode() {
    this.mode = "2";
  }

  onSelectChange() {
    console.log("onSelectChange");
    this.topicFromWhere = "select";
  }
  get topicList() {
    if (this.topicFromWhere === "select") {
      // 顯示下拉選項區選擇的topic
      return this.topicLibList.filter(e =>
        this.selectedTopics.includes(e.topicName)
      );
    }
    if (this.topicFromWhere === "upload") {
      return this.topicUploadList;
    }
    return [];
  }

  // mounted
  mounted() {
    console.log("mounted");
    this.loadTopicLib();
  }
  loadTopicLib() {
    console.log("loadTopicLib");
    let jsons = require.context("../topicLib", false, /\.json$/);
    this.topicLibList = jsons.keys().map(obj => {
      return jsons(obj);
    });
    console.log(this.topicLibList);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
