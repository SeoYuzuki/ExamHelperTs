<template>
  <Modal
    :model-value="isShow"
    title="考題小助手 1.0b"
    @on-cancel="onCancel"
    @on-ok="onOk"
  >
    <Row :gutter="16"> 數字鍵對應ABC, 空白或ENTER 顯示答案 </Row>
    <br />
    <Row :gutter="16">
      <i-col span="6"> 過題顯示答案</i-col>
      <i-col span="8">
        <Space>
          <i-Switch v-model="isDefaultChecked"> </i-Switch>
        </Space>
      </i-col>
    </Row>
    <Row :gutter="16">
      <i-col span="6"> 考題區底色 </i-col>
      <i-col span="12">
        <Color-Picker
          v-model="colorIn"
          recommend
          @on-active-change="colorIn = $event"
        />
      </i-col>
    </Row>
    <Row :gutter="16">
      <i-col span="6"> 字體顏色 </i-col>
      <i-col span="12">
        <Color-Picker
          v-model="textColor"
          recommend
          @on-active-change="textColor = $event"
        />
      </i-col>
    </Row>
  </Modal>
</template>
<script lang="ts">
import { Vue, Options } from "vue-class-component";

@Options({
  props: ["isShowSetting"],
  emits: ["update:isShowSetting"],
})
export default class ChildComponent extends Vue {
  isShowSetting: boolean;

  isDefaultChecked = false;
  colorIn = " #ece7e7";
  textColor = "#000000";
  fontSize = "25px";

  get isShow(): boolean {
    return this.isShowSetting;
  }

  // Methods.
  onCancel(): void {
    console.log("onCancel");
    this.$emit("update:isShowSetting", false);
  }

  onOk(): void {
    console.log("onOk");
    this.$emit("update:isShowSetting", false);
    this.$emit("onChangeSetting", {
      colorIn: this.colorIn,
      textColor: this.textColor,
      fontSize: this.fontSize,
      isDefaultChecked: this.isDefaultChecked,
    });
  }
}
</script>