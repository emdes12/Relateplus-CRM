<script setup>
import { onMounted, ref } from "vue";
import formTemp from "@/assets/icons/Frame 83.svg";
import apiMode from "../../../apiMode";

defineProps({
  list: Array,
});

const api = apiMode;
const responseCounts = ref({});



</script>
<template>
  <div class="form-container">
    <div class="form-wrapper" v-for="form in list">
      <router-link :to="`/forms/${form.form_id}/settings`">
        <div :style="`background-color: ${form.color}`">
          <img :src="formTemp" alt="" />
        </div>
        <div class="form-info" :style="`color: ${form.color};`">
          <h5>
            {{ form.title }}
          </h5>
          <p>
            Response: <strong>{{ form.numResp || 0 }}</strong>
          </p>
        </div>
      </router-link>
    </div>
  </div>
</template>
<style scoped>
.form-container {
  display: flex;
  align-items: center;
  gap: 20px;
  width: 100%;
}

.form-wrapper {
  width: 240px;
  height: 240px;
  border-radius: 10px;
  overflow: hidden;
  font-size: large;
  cursor: pointer;
}

.form-wrapper:hover {
  transform: translateY(-5px);
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
}

.form-wrapper h5 {
  font-weight: 600;
  width: 100%;
  font-size: inherit;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

strong {
  font-weight: 500;
}

.form-wrapper img {
  width: 100%;
}

.form-wrapper div {
  padding: 20px;
}
</style>
