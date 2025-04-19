<script setup>
import BtnDbPry from "./BtnDbPry.vue";
import BtnDbSec from "./BtnDbSec.vue";
defineProps({
  dialogHeader: {
    type: String,
    required: false,
  },
  toggleDialogueBtn: {
    type: Function,
  },
  actionClickSubmit: {
    type: Function,
  },
  closeDialogue: {
    type: Function,
  },
});
</script>

<template>
  <div class="dialogue-bg">
    <div class="dialogue-container">
      <div class="dialogue-header">
        <h4>{{ dialogHeader || "Middle Dialogue" }}</h4>
        <span @click="toggleDialogueBtn" class="close">+</span>
      </div>
      <div class="dialogue-content"><slot></slot></div>
      <div class="dialogun-actions">
        <BtnDbSec :onClickToCancel="closeDialogue" msg="Cancel" />
        <BtnDbPry :onClickToAct="actionClickSubmit" msg="Save" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.dialogue-bg {
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 100vh;
  z-index: 100000;
  display: flex;
  justify-content: flex-end;
  background-color: rgba(0, 0, 0, 0.468);
}

.dialogue-container {
  background: #fff;
  border-radius: 10px 0 0 10px;
  width: 350px;
  height: 100vh;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
}

.dialogue-content {
  width: 100%;
  padding: 20px;
  flex: 0.9;
  overflow-y: scroll;
}

.dialogue-header {
  background-color: #ffc107;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30px 20px;
}

h4 {
  font-size: 22px;
  font-style: normal;
  line-height: 0;
  font-weight: 600;
}

span.close {
  transform: rotate(45deg);
  color: white;
  padding: 10px;
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
  font-size: 18px;
  font-weight: 500;
  cursor: pointer;
}

.dialogun-actions {
  display: flex;
  gap: 20px;
  width: 100%;
  height: 100px;
  padding: 20px;
  border-top: 1px solid #c1c1c1;
  align-items: center;
  justify-content: flex-end;
}

</style>
