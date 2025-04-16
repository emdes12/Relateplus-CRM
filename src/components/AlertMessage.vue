<script setup>
import { RouterLink, RouterView } from "vue-router";
defineProps({
  msg: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: false,
  },
});
</script>

<template>
  <div :class="type">{{ msg }}</div>
</template>

<style scoped>
.error,
.success {
  padding: 12px 20px;
  color: #fff;
  width: fit-content;
  position: absolute;
  top: 80px;
  right: 50px;
}

.error {
  background-color: #f00;
}

.success {
  background-color: #00e500;
}
</style>
