<script setup>
import { watch, ref } from 'vue';
import apiMode from '../../../apiMode';
import { useRoute } from "vue-router";

const props = defineProps({
  form: Object,
  formAction: Function,
});


const route = useRoute();
const api = apiMode
const response = ref({})
const isSubmit = ref(false)

const submitResp = async () => {
  const id = route.params.id;
  // console.log(response.value);
  
  const res = await api.post(`/forms/${id}/submit`, {response: response.value} )

  console.log(res)
  if (res.status === 200) {
    isSubmit.value = true;
    response.value = {}
  } else {
    alert('Error submitting form')
  }
};

// Watch when props.data changes and initialize
watch(
  () => props.form,
  (newData) => {
    if (newData && newData.fields) {
      newData.fields.forEach(field => {
        response.value[field.label] = field.field_type === 'checkbox' ? [] : ''
      })
    }
  },
  { immediate: true }
)
</script>
<template>
    <div class="header" v-show="isSubmit">
        {{ form.completion_message }}
    </div>
  <div class="form-preview" v-show="!isSubmit">
    <div class="preview-header" :style="`background-color: ${form.color}`">
      <h2>
        {{ form.title || "Form Title Here" }}
      </h2>
      <span>{{ form.description || "Your form description goes here" }}</span>
    </div>

    <!-- form preview start -->
    <div class="form-preview-container" v-for="field in form.fields">
      <!-- Render fields dynamically -->
      <div v-if="field.field_type === 'text'">
        <label
          >{{ field.label }}
          <sup style="color: red">{{
            (field.is_required && "*") || ""
          }}</sup></label
        >
        <input
          type="text"
          v-model="response[field.label]"
          :required="`${field.is_required ? 'required' : 'no'}`"
          :placeholder="field.label"
        />
      </div>

      <div v-else-if="field.field_type === 'email'">
        <label
          >{{ field.label }}
          <sup style="color: red">{{
            (field.is_required && "*") || ""
          }}</sup></label
        >
        <input
          type="email"
          v-model="response[field.label]"
          :required="`${field.is_required ? 'required' : 'no'}`"
          :placeholder="field.label"
        />
      </div>

      <div v-if="field.field_type === 'p-tag'">
        <p>{{ field.label }}</p>
      </div>

      <!-- If number -->
      <div v-else-if="field.field_type === 'number'">
        <label
          >{{ field.label }}
          <sup style="color: red">{{
            (field.is_required && "*") || ""
          }}</sup></label
        >
        <input
          type="number"
          v-model="response[field.label]"
          :required="`${field.is_required ? 'required' : 'no'}`"
          :placeholder="field.label"
        />
      </div>

      <!-- If number -->
      <div v-else-if="field.field_type === 'date'">
        <label
          >{{ field.label }}
          <sup style="color: red">{{
            (field.is_required && "*") || ""
          }}</sup></label
        >
        <input
          type="date"
          v-model="response[field.label]"
          :required="`${field.is_required ? 'required' : 'no'}`"
          :placeholder="field.label"
        />
      </div>

      <!-- If text Area -->
      <div v-else-if="field.field_type === 'textarea'">
        <label
          >{{ field.label }}
          <sup style="color: red" required="">{{
            (field.is_required && "*") || ""
          }}</sup></label
        >
        <textarea
          :placeholder="field.label"
          v-model="response[field.label]"
          :required="`${field.is_required ? 'required' : 'no'}`"
        ></textarea>
      </div>

      <!-- for select/dropdown -->
      <div v-else-if="field.field_type === 'select'">
        <label
          >{{ field.label }}
          <sup style="color: red">{{
            (field.is_required && "*") || ""
          }}</sup></label
        >
        <select
          :required="`${field.is_required ? 'required' : 'no'}`"
          v-model="response[field.label]"
        >
          <option disabled selected>Select an option</option>
          <option v-for="(opt, i) in field.options" :key="i">
            {{ opt }}
          </option>
        </select>
      </div>

      <!-- for Radio and Checkbox -->
      <div
        v-else-if="
          field.field_type === 'checkbox' || field.field_type === 'radio'
        "
      >
        <label
          >{{ field.label }}
          <sup style="color: red">{{
            (field.is_required && "*") || ""
          }}</sup></label
        >
        <label
          style="
            display: flex;
            gap: 10px;
            width: 100%;
            align-items: start;
            justify-content: start;
          "
          v-for="(opt, i) in field.options"
          :for="opt"
          :key="i"
        >
          <input
            :style="`width: 15px; height: 15px; accent-color: ${form.color}`"
            :type="field.field_type"
            v-model="response[field.label]"
            :name="opt"
            :id="opt"
            :value="opt"
          />
          {{ opt }}
        </label>
      </div>
    </div>
    <div class="btn-container">
      <button
        @click="
          () => {
            formAction ? formAction() : submitResp();
          }
        "
        class="btn-form"
        :style="`background-color: ${form.color}`"
      >
        {{ form.submitText || form.submit_text }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.form-preview input[type="text"],
.form-preview input[type="email"],
.form-preview select,
.form-preview input,
.form-preview textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  margin-bottom: 1rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background-color: #f9fafb;
  font-size: 1rem;
  transition: border 0.2s ease;
}

h3 {
  padding-top: 10px;
}

.form-preview input:focus,
.form-preview textarea:focus {
  border-color: #3b82f6;
  outline: none;
  background-color: #ffffff;
}

/* Each Form Field Block */
.form-field {
  border: 1px solid #e5e7eb;
  background: #f9fafb;
  padding: 1rem;
  margin-bottom: 1.5rem;
  border-radius: 10px;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.02);
  cursor: grabbing;
}

.form-field strong {
  display: block;
  font-size: 1rem;
  color: #111827;
  margin-bottom: 0.5rem;
}

.form-field label {
  display: flex;
  align-items: center;
  width: max-content;
  gap: 0.5rem;
  font-size: 0.95rem;
  color: #374151;
  margin-top: 0.5rem;
}

/* Remove Button */
.form-field button {
  margin-top: 0.5rem;
  background: #ef4444;
  border: none;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.2s ease;
}

.form-field button:hover {
  background: #dc2626;
}

/* Save Button */
.btn-form {
  margin-top: 1rem;
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  background-color: #10b981;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.btn-form:hover {
  background-color: #059669;
}

label[for="submit-btn"] {
  font-size: large;
  display: block;
}
.form-preview {
  height: 100%;
  overflow: auto;
}

input[type="checkbox"] {
  width: 100%;
}

.preview-header {
  width: 100%;
  padding: 90px 30px 30px;
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 30px;
  background: #000;
  color: #ffffffea;
  text-align: center;
  margin-bottom: 30px;
}

.form-preview-container {
  padding: 0 2rem;
}

.btn-container {
  padding: 0 2rem 2rem;
  display: grid;
  place-items: center;
}

.btn-container button {
  width: 100%;
}

.form-preview-container label {
  font-size: 18px;
  width: 100%;
}

.hide-form-builder {
  width: 30px;
  height: 30px;
  display: grid;
  place-items: center;
  cursor: pointer;
  background-color: #f00;
  color: #fff;
  font-size: large;
  position: absolute;
  top: 3px;
  right: 3px;
}

.header {
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
  background-color: rgb(245, 247, 245);
  padding: 15px 20px;
}
</style>
