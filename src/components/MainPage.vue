<template>
  <div class="text-block">
    <!-- <Slider v-model="value" range /> -->
    <Grid :col="1">
      <GridItem>
        <Row :gutter="20">
          <Col span="2" offset="20">
            <Button type="primary" @click="isShowSetting = !isShowSetting">
              設定
            </Button>
          </Col>
        </Row>
      </GridItem>
    </Grid>
    <Grid :col="1">
      <GridItem>
        <PreExamMode
          v-if="mode === Mode.MainPage"
          :settings="settings"
          @onTopicsSelected="onTopicsSelected"
        />
        <ExamMode
          v-if="mode === Mode.ExamPage"
          :topicList="topicList"
          :settings="settings"
          @onBackToMain="onBackToMain"
        />
      </GridItem>
    </Grid>

    <SettingMadel
      v-model:isShowSetting="isShowSetting"
      @onChangeSetting="onChangeSetting"
    />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Topic from "../types/Topic";
import Settings from "../types/Settings";
import ExamMode from "./ExamMode.vue";
import PreExamMode from "./PreExamMode.vue";
import SettingMadel from "./SettingMadel.vue";
import { Source, Mode } from "../enum/enum";

@Options({
  components: {
    PreExamMode,
    ExamMode,
    SettingMadel,
  },
  props: {
    msg: String,
  },
})
export default class MainPage extends Vue {
  // enum ----------------------------------------
  Mode = Mode;
  Source = Source;

  topicList: Topic[] = [];

  settings = new Settings();

  topicFromWhere: Source = Source.SELECT; //先寫死

  msg!: string;
  isShowSetting = false;
  mode: Mode = Mode.MainPage;

  onTopicsSelected(topicList: Topic[]): void {
    console.log("onTopicsSelected", topicList);
    this.topicList = topicList;
    this.mode = Mode.ExamPage;
  }

  onBackToMain(): void {
    this.mode = Mode.MainPage;
  }

  onChangeSetting(settings: Settings): void {
    console.log("onChangeSetting", settings);
    this.settings = settings;
  }

  // mounted ----------------------------------------
  mounted(): void {
    this.settings = new Settings();
    console.log("settings", this.settings, this.msg);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.text-block {
  white-space: pre-wrap;
  /* font-size: 55px; */
  /* display: inline-block;
        /* max-width: 200px; */
  width: 100%;
  /* left: 10%; */
  height: 100%;
  text-align: left;
  /* position: absolute; */
  /* top: 50%; */

  /* display: flex; */
  /* justify-content: center; */
  /* align-items: center; */
}
</style>
