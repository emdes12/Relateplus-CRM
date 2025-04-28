<script setup>
import { ref, onMounted } from "vue";
import FormInput from "./FormInput.vue";
import axios from "axios";
import BtnPry from "./BtnPry.vue";
import apiMode from "../../apiMode";

defineProps({
    staffNameValue: String,
    staffNumberValue: String,
    staffEmailValue: String,
    staffRoleValue: String,
    staffEmpDateValue: String,
    staffBdayValue: String,
    staffNoteValue: String,
})

const emit = defineEmits([
  "update:staffNameValue",
  "update:staffNumberValue",
  "update:staffEmailValue",
  "update:staffRoleValue",
  "update:staffEmpDateValue",
  "update:staffBdayValue",
  "update:staffNoteValue",
]);
</script>
<template>
  <div>
    <input
      type="text"
      placeholder="Staff Name:"
      :value="staffNameValue"
      @input="emit('update:staffNameValue', $event.target.value)"
    />
    <input
      type="number"
      placeholder="+234:"
      min="1"
      :value="staffNumberValue"
      @input="emit('update:staffNumberValue', $event.target.value)"
    />
    <input
      type="email"
      placeholder="Staff Email:"
      :value="staffEmailValue"
      @input="emit('update:staffEmailValue', $event.target.value)"
    />
    <input
      type="text"
      placeholder="Staff Role"
      :value="staffRoleValue"
      @input="emit('update:staffRoleValue', $event.target.value)"
    />
    <p style="width: 100%; padding-left: 10px; line-height: 0; padding-top: 10px;">Employement Date</p>
    <input
    type="date"
    placeholder="Date Employed:"
    :value="staffEmpDateValue"
    @input="emit('update:staffEmpDateValue', $event.target.value)"
    />
    <p style="width: 100%; padding-left: 10px; line-height: 0; padding-top: 10px;">Birthday Date</p>
    <input
      type="date"
      placeholder="Staff Name:"
      :value="staffBdayValue"
      @input="emit('update:staffBdayValue', $event.target.value)"
    />
    <textarea
      name="staffNote"
      :value="staffNoteValue"
      @input="emit('update:staffNoteValue', $event.target.value)"
      placeholder="Staff Note:"
    ></textarea>
  </div>
</template>
<style scoped>
div {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  flex-direction: column;
  width: 100%;
}
label {
  position: relative;
  width: 100%;
}

input,
textarea {
  border: 1px solid black;
  width: 100%;
  padding: 11px 26px;
  color: #777676;
  text-align: left;
  border-radius: 10px;
  font-family: "League Spartan";
  font-size: 17px;
  font-style: normal;
  font-weight: 200;
  line-height: normal;
}

textarea {
  height: 150px;
}
</style>
