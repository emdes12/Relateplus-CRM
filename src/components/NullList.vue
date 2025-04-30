<script setup>
import { RouterLink, RouterView } from "vue-router";
import BtnDbPry from "../components/BtnDbPry.vue";
defineProps({
  nullImg: {
    type: String,
    required: false,
  },
  nullText: {
    type: String,
    required: false,
  },
  nullBtnText: {
    type: String,
    required: false,
  },
  toggleDialogueBtn: {
    type: Function,
    required: false,
  },
  actionPermit: {
    type: String,
    required: false,
  }
});
// console.log(actionPermit)
</script>

<template>
  <div class="nulll">
    <img :src="nullImg" alt="no client yet" />
    <span>{{ nullText }}</span>
    <BtnDbPry :style="(actionPermit === 'admin') ? 'display: flex;' : 'display: none;'" :onClickToAct="toggleDialogueBtn" :msg="nullBtnText" />
  </div>
</template>

<style scoped>
.nulll {
  display: flex;
  margin: 0 auto;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  padding-top: 100px;
  width: 400px;
  text-align: center;
}
</style>
