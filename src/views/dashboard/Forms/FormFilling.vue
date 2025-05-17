<script setup>
import { ref, onMounted, computed, onBeforeUnmount, reactive } from "vue";
import { useRoute } from "vue-router";
import apiMode from "../../../../apiMode";
import FormPreview from "@/components/Forms/FormPreview.vue";

// declaration of value below
const route = useRoute();
const storeForm = ref({});
const api = apiMode;

const getForm = async () => {
  const id = route.params.id;
  const token = localStorage.getItem("token");
  try {
    console.log(token);

    const data = await api.get("/forms/" + id);
    console.log("data", data.data);
    storeForm.value = data.data;
    console.log("Form list", storeForm.value);
  } catch (error) {
    console.error(error.response);
  }
};

getForm();
</script>

<template>
  <div
    class="contain-fill"
    :style="`background-color: ${storeForm.form.color}38`"
  >
    <div class="former">
      <FormPreview :form="{ ...storeForm.form, fields: storeForm.fields }" />
    </div>

    <router-link to="/">
      <div
        class="form-copyright"
        :style="`font-weight: 600; background-color: ${storeForm.form.color}`"
      >
        Powered by: Relate+
      </div>
    </router-link>
  </div>
</template>

<style scoped>
.contain-fill {
  padding: 80px 0;
  width: 100%;
  min-height: 100vh;
}

.header {
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
  background-color: rgb(245, 247, 245);
  padding: 15px 20px;
}

.export-buttons {
  display: flex;
  gap: 10px;
}

button {
  border: none;
  cursor: pointer;
  background-color: slateblue;
  color: #fff;
  padding: 10px 12px;
  border-radius: 5px;
}

.former {
  max-width: 800px;
  margin: 0 auto;
  background: #fff;
}

.form-copyright {
  font-size: 1rem;
  max-width: 800px;
  text-align: center;
  color: #fff;
  padding: 10px;
  margin: 3rem auto 0;
}
</style>
