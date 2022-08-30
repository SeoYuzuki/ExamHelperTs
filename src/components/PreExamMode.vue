<template>
  <div>
    <Row :gutter="16">
      <Col span="4"> 請選擇題庫: </Col>
      <Col span="10">
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
      </Col>
    </Row>
    <Row :gutter="16">
      <Col span="4"> 或選擇檔案: </Col>
      <Col span="10">
        <input multiple type="file" ref="file" @change="readFile()" />
      </Col>
    </Row>
    <Row :gutter="16">
      <Col span="10" offset="10">
        <Button type="primary" @click="changeMode">確定</Button>
      </Col>
    </Row>
    <br />
  </div>
</template>

<script lang="ts">
import { Source } from "@/enum/enum";
import Topic from "@/types/Topic";
import { getTopicsByFile } from "../utils/UploadUtils";
import { Vue } from "vue-class-component";

export default class PreExamMode extends Vue {
  $refs!: {
    file: HTMLInputElement;
  };

  selectedTopics: string[] = [];
  topicLibList: Topic[] = [];

  topicUploadList: Topic[] = [];

  topicFromWhere: Source = Source.SELECT; //先寫死

  changeMode(): void {
    if (this.topicList.length > 0) {
      this.$emit("onTopicsSelected", this.topicList);
    } else {
      this.$Message.warning("請選擇題庫");
    }
  }

  async readFile(): Promise<void> {
    this.topicFromWhere = Source.UPLOAD;
    this.topicUploadList = await getTopicsByFile(this.$refs.file.files);
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

  onSelectChange(): void {
    this.topicFromWhere = Source.SELECT;
  }

  // mounted ----------------------------------------
  mounted(): void {
    this.loadTopicLib();
  }

  loadTopicLib(): void {
    let jsons = require.context("../topicLib", false, /\.json$/);
    this.topicLibList = jsons.keys().map((obj) => {
      return jsons(obj);
    });
  }
}
</script>

<style scoped></style>
