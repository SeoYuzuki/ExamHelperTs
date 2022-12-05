<template>
  <div class="text-block">
    <!-- <Slider v-model="value" range /> -->
    <Grid :col="1" hover padding="0px">
      <GridItem>
        <Row :gutter="16">
          <Col span="4" offset="18">
            <Button
              v-if="mode === Mode.ExamPage"
              type="primary"
              @click="onBackToMain"
            >
              <Icon type="ios-close" />
            </Button>
          </Col>
          <Col span="2">
            <Button type="primary" @click="isShowSetting = !isShowSetting">
              <Icon type="md-settings" />
            </Button>
          </Col>
        </Row>
      </GridItem>
    </Grid>
    <Grid :col="1" padding="0px">
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

  position: relative;

  left: 10%;
  right: 10%;
  width: 80%;
  height: 100%;
  text-align: left;
}
</style>
