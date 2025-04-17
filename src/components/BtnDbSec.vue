<script setup>
import { RouterLink, RouterView } from "vue-router";
defineProps({
  msg: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: false,
  },
  wdt: {
    type: String,
    required: false,
  },
  onClickToShow: Function,
});
</script>

<template>
  <div class="btn-primary"  v-on:click="onClickToShow" :style="'width: ' + wdt">{{ msg }}</div>
</template>

<style scoped>
.btn-primary {
  border: none;
  display: flex;
  padding: 0.75rem 1rem;
  justify-content: center;
  width: max-content;
  align-items: center;
  color: #ecf0f1;
  gap: 10px;
  border-radius: 10px;
  border: 1px solid black;
  color: var(--white, #000);
  font-family: "League Spartan";
  font-size: 1rem;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s;
}

button.btn-primary {
  padding: 13px 33px;
  font-size: 28px;
}

@media (max-width: 750px) {
  .btn-primary {
    font-size: 28px;
  }

  button.btn-primary {
    font-size: 20px;
  }
}
</style>
