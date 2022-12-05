<template>
  <div>
    <div id="block0">
      <Row :gutter="16">
        <Col span="8"> 請選擇題庫: </Col>
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
        <Col span="8"> 或選擇檔案: </Col>
        <Col span="10">
          <input multiple type="file" ref="file" @change="readFile()" />
        </Col>
      </Row>
      <Row :gutter="16">
        <Col span="8"> Quistions Order: </Col>
        <Col span="10">
          <RadioGroup v-model="quistionsOrder">
            <Radio label="Default"> </Radio>
            <Radio label="Sorted"></Radio>
            <Radio label="Random"></Radio>
          </RadioGroup>
        </Col>
      </Row>
      <Row :gutter="16">
        <Col span="8"> Options Order: </Col>
        <Col span="10">
          <RadioGroup v-model="optionsOrder">
            <Radio label="Sorted"></Radio>
            <Radio label="Random"></Radio>
          </RadioGroup>
        </Col>
      </Row>
      <Row :gutter="16">
        <Col span="24">
          <Button type="primary" @click="changeMode" long>確定</Button>
        </Col>
      </Row>
      <br />
    </div>
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

  quistionsOrder = "Default";
  optionsOrder = "Sorted";

  changeMode(): void {
    if (this.topicList.length > 0) {
      let sortedTopicList: Topic[] = JSON.parse(JSON.stringify(this.topicList));
      if (this.quistionsOrder === "Default") {
        // DO nothing
      } else if (this.quistionsOrder === "Sorted") {
        sortedTopicList.forEach((qList) => {
          // 排序
          qList.questionElementList = qList.questionElementList.sort((a, b) => {
            return parseInt(a.title) - parseInt(b.title);
          });
        });
      } else if (this.quistionsOrder === "Random") {
        sortedTopicList.forEach((qList) => {
          // 亂序
          qList.questionElementList = qList.questionElementList.sort(() => {
            return Math.random() - 0.5;
          });
        });
      }

      if (this.optionsOrder === "Random") {
        sortedTopicList.forEach((qList) => {
          // 亂序
          qList.questionElementList.forEach((e) => {
            e.options.sort(() => {
              return Math.random() - 0.5;
            });
          });
        });
      }

      this.$emit("onTopicsSelected", sortedTopicList);
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
