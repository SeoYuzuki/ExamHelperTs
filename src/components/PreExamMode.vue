<template>
  <div>
    <div id="block0">
      <Row :gutter="16">
        <Col span="8"> 選擇一般題庫: </Col>
        <Col span="8">
          <Select
            style="width: 200px"
            v-model="selectedTopics"
            multiple
            @on-change="onSelectChange"
          >
            <Option v-for="topic in topicLibList" :value="topic" :key="topic">
              {{ topic }}
            </Option>
          </Select>
        </Col>
        <Col span="1">
          <Icon @click="selectedTopics = []" type="ios-close-circle-outline" />
        </Col>
      </Row>
      <Row :gutter="16">
        <Col span="8"> 選擇題目難度:</Col>
        <Col span="10">
          <Rate v-model="starValue" />
        </Col>
      </Row>
      <Row :gutter="16">
        <Col span="8"> 選擇檔案: </Col>
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
          <Button
            type="primary"
            @click="clickConfirm"
            :loading="isLoading"
            long
          >
            確定
          </Button>
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
import { shuffle } from "@/utils/ArrayUtil";
import { useCookies } from "vue3-cookies";
import ReviewQuestion from "@/types/ReviewQuestion";

export default class PreExamMode extends Vue {
  $refs!: {
    file: HTMLInputElement;
  };
  cookies = useCookies().cookies;
  selectedTopics: string[] = [];

  topicUploadList: Topic[] = [];
  // 本地題庫
  localLibList: Topic[] = [];
  // 遠端題庫清單(name list)
  remoteLibList: string[] = [];
  // 題庫清單
  get topicLibList(): string[] {
    let list: string[] = JSON.parse(JSON.stringify(this.remoteLibList));
    this.localLibList.forEach(e => list.push(e.topicName));
    return list;
  }

  // 考題清單
  topicList: Topic[] = [];
  // isLoading
  isLoading = false;

  topicFromWhere: Source = Source.SELECT; //先寫死

  starValue = 1; // 複習題庫
  quistionsOrder = "Default";
  optionsOrder = "Sorted";

  /**
   * 按下確定
   */
  async clickConfirm(): Promise<void> {
    this.isLoading = true;
    for (let libName of this.selectedTopics) {
      let localTopic: Topic | undefined = this.localLibList.find(
        e => e.topicName === libName
      );
      if (localTopic) {
        this.topicList.push(localTopic);
      } else {
        let temp = await this.axios.get(
          `https://seoyuzuki.github.io/ExamLib/${libName}`
        );
        if (temp) {
          this.topicList.push(temp.data);
        }
      }
    }

    if (this.topicList.length > 0) {
      let sortedTopicList: Topic[] = JSON.parse(JSON.stringify(this.topicList));
      if (this.quistionsOrder === "Default") {
        // DO nothing
      } else if (this.quistionsOrder === "Sorted") {
        sortedTopicList.forEach(qList => {
          // 排序
          qList.questionElementList = qList.questionElementList.sort((a, b) => {
            return parseInt(a.title) - parseInt(b.title);
          });
        });
      } else if (this.quistionsOrder === "Random") {
        sortedTopicList.forEach(qList => {
          // 亂序
          shuffle(qList.questionElementList);
        });
      }

      if (this.optionsOrder === "Random") {
        sortedTopicList.forEach(qList => {
          // 亂序
          qList.questionElementList.forEach(e => {
            shuffle(e.options);
          });
        });
      }

      if (this.starValue > 1) {
        let reviewQuestionList: ReviewQuestion[] = JSON.parse(
          this.cookies.get("reviewList")
        );
        sortedTopicList.forEach(qList => {
          // 亂序
          qList.questionElementList = qList.questionElementList.filter(
            qElement => {
              return reviewQuestionList.some(reviewQuestion => {
                return (
                  reviewQuestion.topicName === qList.topicName &&
                  reviewQuestion.title === qElement.title &&
                  reviewQuestion.starValue >= this.starValue
                );
              });
            }
          );
        });
      }

      this.$emit("onTopicsSelected", sortedTopicList);
    } else {
      this.$Message.warning("請選擇題庫");
    }
    this.isLoading = false;
    this.saveCookie();
  }

  saveCookie(): void {
    this.cookies.set(
      "preExamConfig",
      JSON.stringify({
        quistionsOrder: this.quistionsOrder,
        optionsOrder: this.optionsOrder,
        selectedTopics: this.selectedTopics
      }),
      "3y"
    ); // 3 year after, expire
  }

  async readFile(): Promise<void> {
    this.topicFromWhere = Source.UPLOAD;
    this.topicUploadList = await getTopicsByFile(this.$refs.file.files);
  }

  onSelectChange(): void {
    this.topicFromWhere = Source.SELECT;
  }

  // mounted ----------------------------------------
  mounted(): void {
    this.loadTopicLib();
    let preExamConfig: any = this.cookies.get("preExamConfig");
    if (preExamConfig?.quistionsOrder) {
      this.quistionsOrder = preExamConfig.quistionsOrder;
    }
    if (preExamConfig?.optionsOrder) {
      this.optionsOrder = preExamConfig.optionsOrder;
    }
    if (preExamConfig?.selectedTopics) {
      this.selectedTopics = preExamConfig.selectedTopics;
    }
  }

  loadTopicLib(): void {
    // 找本地JSON
    let jsons = require.context("../assets/topicLib", false, /\.json$/);
    this.localLibList = jsons.keys().map(obj => {
      return jsons(obj);
    });

    // 請求倉庫
    this.axios
      .get(`https://seoyuzuki.github.io/ExamLib/libList.json`)
      .then(response => {
        this.remoteLibList = response.data.libList;
      });
  }
}
</script>

<style scoped></style>
