<script setup>
import { ref } from "vue";
import { v4 as uuidv4 } from "uuid";
import BtnDbPry from "@/components/BtnDbPry.vue";
import draggable from "vuedraggable";
import apiMode from "../../../apiMode";

const api = apiMode;

// leftbar field template
const fieldTemplates = ref([
  { type: "text", identifier: "Text Input", title: "Single Line text input" },
  { type: "email", identifier: "Email", title: "Email input" },
  { type: "number", identifier: "Number Input", title: "Numerical Inputs" },
  { type: "date", identifier: "Date", title: "Date/Calendar Inputs" },
  { type: "textarea", identifier: "Textarea", title: "Wide text input field" },
  {
    type: "checkbox",
    identifier: "Multi-choice Selection",
    title: "Multiselect option",
  },
  {
    type: "radio",
    identifier: "Single-choice Selection",
    title: "Multiselect option",
  },
  { type: "select", identifier: "Dropdown Selection", title: "Option input" },
  {
    type: "password",
    identifier: "Security Input",
    title: "Used for inputing security key",
  },
  {
    type: "p-tag",
    identifier: "Text",
    title: "Add a plain text, use for explanation",
  },
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
    color: form.value.color,
    fields: form.value.fields.map((f) => ({
      label: f.identifier,
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

const switchOptions = (id) => {
  form.value.fields.forEach((f) => {
    if (f.id === id) {
      f.options = f.optionsText.split(",").map((opt) => opt.trim());
    }
  });
};

const fields = ref([]);

const addField = (obj) => {
  const id = uuidv4();
  const defaultOptions = ["Option 1", "Option 2"];
  form.value.fields.push({
    id,
    identifier: obj.identifier,
    label: "",
    field_type: obj.type,
    optionsText: "", // temp for UI
    options: [],
    // options1: ["select", "checkbox"].includes(type) ? [...defaultOptions] : [],
    is_required: false,
  });

  console.log(form.value);
};

const saveForm = () => {
  console.log("Form fields:", form.value);
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
        {{ field.identifier }}
      </div>
    </div>

    <!-- Form canvas -->
    <div class="form-canvas">
      <div class="form-canva">
        <div class="form-meta">
          <h3>Form: {{ form.title || "Untitled Form" }}</h3>
          <input
            v-model="form.title"
            placeholder="Form Title"
            class="form-title-input"
          />
          <textarea
            v-model="form.description"
            placeholder="Form Description"
            class="form-description-input"
          ></textarea>
          <label>Color Preference: </label
          ><input
            style="width: 80px; height: 40px"
            type="color"
            v-model="form.color"
          />
        </div>

        <hr />
        <h3>Form Fields</h3>

        <!-- Field Setting rendering -->
        <draggable :list="form.fields" group="fields" item-key="id">
          <template #item="{ element, index }">
            <div class="form-field" title="click and drag to sort">
              <div class="field-header">
                <strong
                  >{{ element.identifier || "Untitled Field" }} ({{
                    element.field_type
                  }})</strong
                >
                <label class="required-toggle">
                  <input type="checkbox" v-model="element.is_required" />
                  Required
                </label>
              </div>

              <!-- Render input fields params -->
              <div>
                <input v-model="element.label" placeholder="Label" />

                <div
                  v-if="
                    element.field_type === 'select' ||
                    element.field_type === 'checkbox' ||
                    element.field_type === 'radio'
                  "
                >
                  <input
                    v-model="element.optionsText"
                    v-on:change="switchOptions(element.id)"
                    placeholder="Comma-seperated options (e.g 'Male, Female, Transgender')"
                  />
                </div>
              </div>

              <!-- Remove button -->
              <button @click="removeField(index)">Remove</button>
            </div>
          </template>
        </draggable>


        <label for="submit-btn">
          <strong>Submit Button Name</strong>
          <input
            style="width: 200px; margin: 0 20px"
            v-model="form.submitText"
            :placeholder="form.submitText"
            class="form-title-input"
          />
        </label>
        <button class="btn-form" @click="saveForm">Save Form</button>
      </div>

      <div class="form-preview">
        <div class="preview-header" :style="`background-color: ${form.color}`">
          <h2>
            {{ form.title || "Form Title Here" }}
          </h2>
          <span>{{
            form.description || "Your form description goes here"
          }}</span>
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
            <select :required="`${field.is_required ? 'required' : 'no'}`">
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
              :for="field.label"
              :key="i"
            >
              <input
                :style="`width: 15px; height: 15px; accent-color: ${form.color}`"
                :type="field.field_type"
                :name="field.label"
              />
              {{ opt }}
            </label>
          </div>
        </div>
        <button class="btn-form" :style="`background-color: ${form.color}`">
          {{ form.submitText }}
        </button>
      </div>
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
  height: 85vh;
  box-sizing: border-box;
}

/* Sidebar Styles */
.sidebar {
  width: 250px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  display: flex;
  overflow: scroll;
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
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr;
  align-items: start;
  gap: 2rem;
  overflow: hidden;
}

.form-canva {
  width: 100%;
  height: 100%;
  overflow: auto;
}

.form-canvas h3 {
  font-size: 1.4rem;
  margin-bottom: 1rem;
  color: #111827;
}

.form-canvas input[type="text"],
.form-canvas input[type="email"],
.form-canvas select,
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

.form-preview-container label {
    font-size: 18px;
    width: 100% 
}
</style>
