<template>
  <div>
    <div id="qBlock" :style="{ 'background-color': colorIn, color: textColor }">
      <div>
        {{ topic.topicName }}
        <Poptip placement="right" width="400">
          <Icon type="ios-information-circle-outline" />
          <template #content>
            topic: {{ topic.topicName }} <br />
            topicInfo: {{ topic.topicInfo }}
          </template>
        </Poptip>
        <Rate @on-change="saveReviewList()" v-model="starValue" />
      </div>

      <br />
      <template v-if="questionElement">
        <div>{{ questionElement.title }}.</div>
        <div v-for="question in questionElement.question" :key="question.title">
          <template v-if="question.startsWith('Picture:')">
            <img
              class="pic"
              :src="`data:image/png;base64,${question.replace('Picture:', '')}`"
            />
          </template>
          <div v-else>{{ question }}</div>
        </div>
        <br />
        <br />
        <!-- 選項 -->
        <Checkbox-Group
          v-if="questionElement.answerType == 'choice'"
          v-model="selectedItems"
        >
          <template
            v-for="(option, index) in questionElement.options"
            :key="option.optTitle"
          >
            <Row>
              <Checkbox :label="option.optTitle" :key="option.optTitle">
                <span :class="showError(option)">
                  {{ charCodeMap[index + 1] }}. {{ option.optContent }}
                </span>
              </Checkbox>
            </Row>
          </template>
        </Checkbox-Group>

        <!-- 非選題之答案 -->
        <template
          v-if="questionElement.answerType === 'non-choice' && isChecked"
        >
          <Card>
            <div v-for="answer in questionElement.answersList" :key="answer">
              <template v-if="answer.startsWith('Picture:')">
                <img
                  class="pic"
                  :src="`data:image/png;base64,${answer.replace(
                    'Picture:',
                    ''
                  )}`"
                />
              </template>
              <div v-else>{{ answer }}</div>
            </div>
          </Card>
        </template>
      </template>
      <br />
      <br />
      <br />
    </div>

    <div id="footer">
      <Row class-name="footer-row" :gutter="16">
        <Col span="8">
          <Button
            class="footer-btn"
            type="primary"
            @click="keydownHandler(37)"
            icon="md-arrow-round-back"
          >
            <!-- <Icon type="md-arrow-round-back" /> -->
          </Button>
        </Col>
        <Col span="8">
          <Button
            class="footer-btn"
            type="primary"
            @click="changeIsChecked()"
            :ghost="!isChecked"
          >
            顯示答案
          </Button>
        </Col>
        <Col span="8">
          <Button class="footer-btn" type="primary" @click="keydownHandler(39)">
            <Icon type="md-arrow-round-forward" />
          </Button>
        </Col>
      </Row>
    </div>
  </div>
</template>

<script lang="ts">
import Topic from "../types/Topic";
import { QuestionElement, Option } from "../types/QuestionElement";
import { arraysEqual } from "../utils/ArrayUtil";
import { prop, Vue } from "vue-class-component";
import { charCodeMap } from "../enum/charCodeMap";
import Settings from "@/types/Settings";
import { useCookies } from "vue3-cookies";
import ReviewQuestion from "@/types/ReviewQuestion";

export class Props {
  topicList = prop<Topic[]>({ required: true });
  settings = prop<Settings>({ required: true });
}

export default class ExamMode extends Vue.with(Props) {
  cookies = useCookies().cookies;
  topicIndex = 0;
  qIndex = 0;
  selectedItems: string[] = [];
  isChecked = false; // 是否檢查答案
  charCodeMap = charCodeMap;
  starValue = 1;

  get topic(): Topic {
    return this.topicList[this.topicIndex];
  }

  get qList(): QuestionElement[] {
    if (this.topic) {
      return this.topic.questionElementList;
    } else {
      return [];
    }
  }

  get questionElement(): QuestionElement {
    if (this.qList) {
      return this.qList[this.qIndex];
    } else {
      return new QuestionElement();
    }
  }

  // 目前答案是否正確
  get isCorrect(): boolean {
    if (this.questionElement.answerType === "non-choice") {
      return true;
    }
    return arraysEqual(this.questionElement.answersList, this.selectedItems);
  }

  showError(e: Option): string {
    if (
      this.isChecked &&
      this.questionElement.answersList.includes(e.optTitle)
    ) {
      if (this.isCorrect) {
        return "border-color-green";
      } else {
        return "border-color-red";
      }
    } else {
      return "";
    }
  }

  // mounted-------------------------------------
  mounted(): void {
    window.addEventListener("keydown", this.onkeydown);
    this.readReviewList();
  }

  onkeydown(e: KeyboardEvent): void {
    if (e.keyCode == 32 && e.target == document.body) {
      e.preventDefault();
    }
    this.keydownHandler(e.keyCode);
  }

  keydownHandler(keyCode: number): void {
    (document.activeElement as HTMLElement)?.blur(); // 清除focus

    if (keyCode == 37 /*左*/ || keyCode == 39 /*右*/) {
      this.selectedItems = [];
    }

    this.changeQ(keyCode); // 過題

    let charCode: string = String.fromCharCode(keyCode);

    this.pressAns(charCode); //輸入答案

    if (charCode == "\r" /*enter*/ || charCode == " " /*space*/) {
      this.changeIsChecked();
    }
  }

  /**
   * 更改顯示答案狀態
   */
  changeIsChecked(): void {
    // 檢查答案與否
    this.isChecked = !this.isChecked;
    if (this.isChecked) {
      if (this.questionElement.answerType == "choice") {
        let temp: string[] = [];
        this.questionElement.answersList.forEach((answer) => {
          temp.push(
            charCodeMap[
              this.questionElement.options.findIndex((option) => {
                return answer == option.optTitle;
              }) + 1
            ]
          );
        });
        this.$Message["success"]({
          background: true,
          content: temp,
        });
      } else if (this.questionElement.answerType == "non-choice") {
        this.$Message["success"]({
          background: true,
          content: this.questionElement.answersList,
        });
      }
    }
  }

  // 過題
  changeQ(keyCode: number): void {
    if (![37, 39].includes(keyCode)) {
      return;
    }

    if (!this.isDefaultChecked) {
      this.isChecked = false;
    }

    if (keyCode == 37 /*左*/) {
      if (this.qIndex == 0) {
        if (this.topicIndex == 0) {
          this.$Message.warning("最前面");
        } else {
          this.topicIndex = this.topicIndex - 1;
          this.qIndex = this.qList.length - 1;
        }
      } else {
        this.qIndex = this.qIndex - 1;
      }
    } else if (keyCode == 39 /*右*/) {
      if (this.qIndex + 1 == this.qList.length) {
        if (this.topicIndex + 1 == this.topicList.length) {
          this.$Message.warning("最末題");
        } else {
          this.topicIndex = this.topicIndex + 1;
          this.qIndex = 0;
        }
      } else {
        this.qIndex = this.qIndex + 1;
      }
    }

    this.readReviewList();
  }

  // 讀取複習題庫清單，得到該題starValue
  readReviewList(): void {
    let reviewQuestionList: ReviewQuestion[] = JSON.parse(
      this.cookies.get("reviewList")
    );

    let reviewQuestion: ReviewQuestion | undefined = reviewQuestionList.find(
      (e) => {
        return (
          e.topicName === this.topic.topicName &&
          e.title === this.questionElement.title
        );
      }
    );
    if (reviewQuestion) {
      this.starValue = reviewQuestion.starValue;
    } else {
      this.starValue = 1;
    }
  }

  // 讀取複習題庫清單，儲存該題starValue
  saveReviewList(): void {
    let reviewQuestionList: ReviewQuestion[] = JSON.parse(
      this.cookies.get("reviewList")
    );
    let reviewQuestion: ReviewQuestion | undefined = reviewQuestionList.find(
      (e) => {
        return (
          e.topicName === this.topic.topicName &&
          e.title === this.questionElement.title
        );
      }
    );
    if (reviewQuestion) {
      reviewQuestion.starValue = this.starValue;
    } else {
      reviewQuestionList.push({
        topicName: this.topic.topicName,
        title: this.questionElement.title,
        starValue: this.starValue,
      });
    }

    this.cookies.set("reviewList", JSON.stringify(reviewQuestionList), "3y"); // 3 year after, expire
  }

  /** 鍵盤輸入答案 填入 */
  pressAns(charCode: string): void {
    let ansKey = charCodeMap[charCode];
    if (!ansKey) {
      return;
    }
    if (!this.selectedItems.includes(ansKey)) {
      this.selectedItems.push(ansKey);
    } else {
      // remove
      this.selectedItems = this.selectedItems.filter((item) => item !== ansKey);
    }
  }

  // setting 相關-----------------------------
  // 是否切換題目時依舊顯示答案
  get isDefaultChecked(): boolean {
    return this.settings.isDefaultChecked;
  }
  // 考題區背景顏色
  get colorIn(): string {
    return this.settings.colorIn;
  }
  //字體顏色
  get textColor(): string {
    return this.settings.textColor;
  }

  // unmounted --------------------------
  unmounted(): void {
    window.removeEventListener("keydown", this.onkeydown);
  }
}
</script>

<style scoped>
.border-color-red {
  border-color: rgb(179, 36, 36);
  border-width: 2px;
  border-style: solid;
}
.border-color-green {
  border-color: rgb(52, 153, 43);
  border-width: 2px;
  border-style: solid;
}

.pic {
  max-width: 800px;
  max-height: 800px;
}

/* :deep(.ivu-footer-toolbar-right) {
  width: 100%;
  background-color: rgb(233, 222, 221);
} */

#qBlock {
  height: 90%;
}

#footer {
  width: 94%;
  height: 6%;
  position: fixed;
  bottom: 0px;
  z-index: 1;
  background-color: bisque;
}

.footer-row {
  height: 100%;
}
.footer-btn {
  width: 100%;
  height: 100%;
}
</style>
