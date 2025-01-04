<script setup>
import { RouterLink, RouterView } from "vue-router";
defineProps({
  msg: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <RouterLink class="btn-primary" :to="link">{{ msg }}</RouterLink>
</template>

<style scoped>
.btn-primary {
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
}

@media (max-width: 750px) {
  .btn-primary {
    font-size: 20px;
  }
}
</style>
