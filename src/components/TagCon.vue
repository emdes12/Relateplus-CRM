<script setup>
import { RouterLink, RouterView } from "vue-router";
defineProps({
  hd: {
    type: String,
    required: true,
  },
  tag: {
    type: String,
    required: true,
  },
  cont: {
    type: String,
    required: true,
  },
});
</script>

<template>
    <div class="tag-container">
      <div class="square"></div>
      <div class="mintxt">
        <div class="mintxthd">
          <span>{{ hd }}</span> <p>{{ tag }}</p>
        </div>
        <p>{{ cont }}</p>
      </div>
    </div>
</template>

<style scoped>
.tag-container {
  border: 1px solid #000;
  width: 575px;
  padding: 25px;
  flex: 1 1 auto;
  display: flex;
  gap: 15px;
  border-radius: 5px;
  align-items: center;
}

.tag-container:hover {
  background-color: #000;
}

.square {
  content: "";
  background-color: #aaa;
  width: 65px;
  height: 65px;
}

.mintxt {
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
}

.mintxthd {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mintxt > p {
  color: #aaa;
}

.tag-container:hover > .mintxt > .mintxthd > span {
  color: #fff;
}

.mintxthd > span {
  color: #000;
}

.mintxthd > p {
  color: #FFC107;
}
</style>