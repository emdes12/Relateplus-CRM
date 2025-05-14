<script setup>
import { ref } from "vue";
import { v4 as uuidv4 } from "uuid";
import BtnDbPry from "@/components/BtnDbPry.vue";
import draggable from "vuedraggable";
import apiMode from "../../../../apiMode";

const api = apiMode;

// leftbar field template
let fieldTemplates = ref([
  { type: "text", label: "Text Input", title: "Single Line text input" },
  { type: "email", label: "Email", title: "Email input" },
  { type: "number", label: "Number Input", title: "Numerical Inputs" },
  { type: "date", label: "Date", title: "Date/Calendar Inputs" },
  { type: "textarea", label: "Textarea", title: "Wide text input field" },
  { type: "checkbox", label: "Checkboxes", title: "Multiselect option" },
  { type: "select", label: "Dropdown", title: "Option input" },
  { type: "button", label: "Button", title: "Action button" },
]);

// Reactive form structure
const form = ref({
  title: "",
  description: "",
  fields: [],
});

// When a field is dragged in, clone it and add cstome properties
const clone = (original) => {
  console.log(typeof fieldTemplates.value)
  console.log(fieldTemplates.value)
  const value = {
    id: uuidv4(),
    type: original.type,
    label: original.label,
    required: false,
    optionsText: "", // temp for UI
    options: [],
  };
  return value;
};

//  Remove a field
const removeField = (index) => {
  form.value.fields.splice(index, 1);
};

// Submit form to backend
const submitForm = async () => {
  const token = localStorage.getItem("token");
  // Parse options from string (for select/checkbox types)
  form.value.fields.forEach((f) => {
    if (f.type === "select" || f.type === "checkbox") {
      f.options = f.optionsText.split(",").map((opt) => opt.trim());
    }
  });

  // send to backend
  const payload = {
    title: form.value.title,
    description: form.value.description,
    fields: form.value.fields.map((f) => ({
      label: f.label,
      field_type: f.type,
      is_required: f.required,
      options: f.options,
    })),
  };

  const res = await api("/api/forms", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      token: `${token}`,
    },
    body: JSON.stringify(payload),
  });
};
</script>
<template>
  <div class="builder-container">
    <div class="leftbar">
      <h3>Field Types</h3>
      <draggable
        v-model="fieldTemplates"
        group="fields"
        :clone="clone"
        item-key="type"
      >
        <template #item="{ element }">
          <div class="field-template">
            {{ element?.label || "No Label" }}
          </div>
        </template>
      </draggable>
    </div>

    <div class="form-canvas">
      <h3>Form: {{ form.title }}</h3>
      <input v-model="form.title" placeholder="Form Title" />
      <textarea
        placeholder="Form Description"
        v-model="form.description"
      ></textarea>

      <draggable v-model="form.fields" group="fields" item-key="id">
        <template #item="{ element, index }">
          <div class="form-field">
            <strong>{{ element.label | "Unnamed Field" }}</strong>
            <input v-model="element.label" placeholder="Label" />

            <div
              v-if="element.type === 'select' || element.type === 'checkbox'"
            >
              <input
                v-model="element.optionsText"
                placeholder="Comma-seperated options"
              />
            </div>

            <label>
              <input type="checkbox" v-model="element.required" /> Required
              <input type="datetime"  /> Required
              <input type="date"  /> Required
              <input type="datetime-local"  /> Required
            </label>

            <button @click="removeField(index)">🗑</button>
          </div>
        </template>
      </draggable>

      <BtnDbPry
        :onClickToAct="submitForm"
        v-show="true"
        msg="Save Form"
        wdt="max-content"
      />
    </div>
  </div>
</template>

<style scoped>
/* Container Layout */
.builder-container {
  display: flex;
  gap: 2rem;
  padding: 2rem;
  background-color: #f9fafb;
  min-height: 100vh;
  box-sizing: border-box;
}

/* Sidebar Styles */
.leftbar {
  width: 250px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.leftbar h3 {
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: #111827;
}

/* Draggable Field Templates */
.field-template {
  padding: 0.75rem 1rem;
  margin-bottom: 0.5rem;
  background-color: #f3f4f6;
  border: 1px dashed #cbd5e1;
  border-radius: 8px;
  cursor: grab;
  font-weight: 500;
  color: #1f2937;
  transition: background 0.2s ease;
}

.field-template:hover {
  background-color: #e5e7eb;
}

/* Form Canvas Styles */
.form-canvas {
  flex: 1;
  background: #ffffff;
  padding: 2rem;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.04);
}

.form-canvas h3 {
  font-size: 1.4rem;
  margin-bottom: 1rem;
  color: #111827;
}

.form-canvas input[type="text"],
.form-canvas input[type="email"],
.form-canvas input,
.form-canvas textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  margin-bottom: 1rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background-color: #f9fafb;
  font-size: 1rem;
  transition: border 0.2s ease;
}

.form-canvas input:focus,
.form-canvas textarea:focus {
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
.form-canvas > button {
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

.form-canvas > button:hover {
  background-color: #059669;
}
</style>
