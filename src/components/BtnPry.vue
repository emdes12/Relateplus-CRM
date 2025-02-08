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
  onSubmitToCreate: Function,
});
</script>

<template>
  <RouterLink v-show="link" class="btn-primary" :style="'width: ' + wdt" :to="link">{{ msg }}</RouterLink>
  <button v-show="!link" class="btn-primary" type="button" @click="onSubmitToCreate" :style="'width: ' + wdt">{{ msg }}</button>
</template>

<style scoped>
.btn-primary {
  border: none;
  display: flex;
  padding: 17px 33px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 10px;
  background: var(--Primary-color, #f60);
  color: var(--white, #fff);
  font-family: "League Spartan";
  font-size: 36.936px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  text-decoration: none;
  cursor: pointer;
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
