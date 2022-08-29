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
        style="width: 200px"
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
      <PreExamMode v-if="mode === Mode.MainPage" msg="ttt" />
      <ExamMode v-if="mode === Mode.ExamPage" :topicList="topicList" />

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
import { Source, Mode } from "../enum/enum";

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
  // enum ----------------------------------------
  Mode = Mode;
  Source = Source;

  topicUploadList: Topic[] = [];
  topicLibList: Topic[] = []; //ok
  selectedTopics: string[] = [];

  topicFromWhere: Source = Source.SELECT; //先寫死

  msg!: string;
  mode: Mode = Mode.MainPage;

  changeMode(): void {
    this.mode = Mode.ExamPage;
  }

  onSelectChange(): void {
    console.log("onSelectChange");
    this.topicFromWhere = Source.SELECT;
  }
  get topicList(): Topic[] {
    if (this.topicFromWhere === Source.SELECT) {
      // 顯示下拉選項區選擇的topic
      return this.topicLibList.filter((e: Topic) =>
        this.selectedTopics.includes(e.topicName)
      );
    }
    if (this.topicFromWhere === Source.UPLOAD) {
      return this.topicUploadList;
    }
    return [];
  }

  // mounted ----------------------------------------
  mounted() {
    console.log("mounted", Source);
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
