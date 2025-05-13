<script setup>
import { ref } from "vue";
import { v4 as uuidv4 } from "uuid";
import BtnDbPry from "@/components/BtnDbPry.vue";
import draggable from "vuedraggable";
import apiMode from "../../../apiMode";

const api = apiMode;

// leftbar field template
const fieldTemplates = ref([
  { type: "text", label: "Text Input", title: "Single Line text input" },
  { type: "email", label: "Email", title: "Email input" },
  { type: "number", label: "Number Input", title: "Numerical Inputs" },
  { type: "date", label: "Date", title: "Date/Calendar Inputs" },
  { type: "textarea", label: "Textarea", title: "Wide text input field" },
  { type: "checkbox", label: "Multi-choice Selection", title: "Multiselect option" },
  { type: "radio", label: "Single-choice Selection", title: "Multiselect option" },
  { type: "select", label: "Dropdown Selection", title: "Option input" },
  { type: "button", label: "Button", title: "Action button" },
  { type: "p-tag", label: "Text", title: "Add a plain text, use for explanation" },
]);

// Reactive form structure
const form = ref({
  title: "",
  description: "",
  color: "",
  submitText: "Submit",
  fields: [],
});

// When a field is dragged in, clone it and add cstome properties
const clone = (original) => {
  return {
    id: uuidv4(),
    type: original.type,
    label: "",
    required: false,
    optionsText: "", // temp for UI
    options: [],
  };
};

// //  Remove a field
// const removeField = (index) => {
//   form.value.fields.splice(index, 1);
// };

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

const fields = ref([]);

const addField = (obj) => {
  const id = uuidv4();
  const defaultOptions = ["Option 1", "Option 2"];
  form.value.fields.push({
    id,
    label: obj.label,
    field_type: obj.type,
    optionsText: "", // temp for UI
    options: [],
    // options1: ["select", "checkbox"].includes(type) ? [...defaultOptions] : [],
    is_required: false,
  });

  console.log(form.value)
};

const removeField = (index) => {
  fields.value.splice(index, 1);
};

const saveForm = () => {
  console.log("Form fields:", fields.value);
  alert("Form saved (check console)");
};
</script>

<template>
  <div class="builder-container">
    <!-- Sidebar with clickable field types -->
    <div class="sidebar">
      <h3>Add Field</h3>
      <span class="element-head">Basic Form Element</span>
      <div
        class="field-template"
        v-for="field in fieldTemplates"
        :key="field.type"
        :title="field.title"
        @click="addField(field)"
      >
        {{ field.label }}
      </div>
    </div>

    <!-- Form canvas -->
    <div class="form-canvas">
      <div class="form-meta">
        <h3>Form: {{ form.title || 'Untitled Form' }}</h3>
        <input v-model="form.title" placeholder="Form Title" class="form-title-input" />
        <textarea v-model="form.description" placeholder="Form Description" class="form-description-input"></textarea>
      </div>

      <hr>
      <h3>Form Fields</h3>

      <div v-for="(field, index) in form.fields" :key="field.id" class="form-field">
        <div class="field-header">
          <strong
            >{{ field.label || "Untitled Field" }} ({{
              field.field_type
            }})</strong
          >
          <label class="required-toggle">
            <input type="checkbox" v-model="field.is_required" />
            Required
          </label>
        </div>

        <!-- Render fields dynamically -->
        <div v-if="field.field_type === 'text'">
          <input type="text" placeholder="Text input" />
        </div>
        <div v-else-if="field.field_type === 'email'">
          <input type="email" placeholder="Email input" />
        </div>
        <div v-else-if="field.field_type === 'textarea'">
          <textarea placeholder="Textarea field"></textarea>
        </div>
        <div v-else-if="field.field_type === 'select'">
          <select>
            <option disabled selected>Select an option</option>
            <option v-for="(opt, i) in field.options" :key="i">
              {{ opt }}
            </option>
          </select>
        </div>
        <div v-else-if="field.field_type === 'checkbox'">
          <label v-for="(opt, i) in field.options" :key="i">
            <input type="checkbox" /> {{ opt }}
          </label>
        </div>

        <!-- Remove button -->
        <button @click="removeField(index)">Remove</button>
      </div>

      <label for="submit-btn">
        <strong>Submit Button Name</strong
        <input v-model="form.submitText" :placeholder="form.submitText" class="form-title-input" />
      </label>
      <button @click="saveForm">Save Form</button>
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
.sidebar {
  width: 250px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.sidebar h3 {
  font-size: 1.2rem;
  padding-top: 1.5rem;
  color: rgb(17, 24, 39);
  margin: 0 1.5rem;
  margin-bottom: 1rem;
}

.element-head {
    width: 100%;
    padding: 0.75rem;
    background-color: #11182788;
    color: #cbd5e1;
    text-align: center;
    text-transform: uppercase;
  margin-bottom: 1rem;
}

/* Draggable Field Templates */
.field-template {
  padding: 0.75rem 1rem;
  margin: 0 1.5rem;
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

h3 {
  padding-top: 10px;
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
