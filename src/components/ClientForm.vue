<script setup>
import { ref, onMounted } from "vue";
import FormInput from "./FormInput.vue";
import axios from "axios";
import BtnPry from "./BtnPry.vue";
import apiMode from "../../apiMode";

defineProps({
    clientNameValue: String,
    clientNumberValue: String,
    clientEmailValue: String,
    clientLabelValue: String,
    clientLocationValue: String,
    clientBdayValue: String,
    clientNoteValue: String,
})

const emit = defineEmits([
  "update:clientNameValue",
  "update:clientNumberValue",
  "update:clientEmailValue",
  "update:clientLabelValue",
  "update:clientLocationValue",
  "update:clientBdayValue",
  "update:clientNoteValue",
]);
</script>
<template>
  <div>
    <input
      type="text"
      placeholder="Client Name:"
      :value="clientNameValue"
      @input="emit('update:clientNameValue', $event.target.value)"
    />
    <input
      type="number"
      placeholder="+234:"
      min="1"
      :value="clientNumberValue"
      @input="emit('update:clientNumberValue', $event.target.value)"
    />
    <input
      type="email"
      placeholder="Client Email:"
      :value="clientEmailValue"
      @input="emit('update:clientEmailValue', $event.target.value)"
    />
    <input
      type="text"
      placeholder="Label/Group:"
      :value="clientLabelValue"
      @input="emit('update:clientLabelValue', $event.target.value)"
    />
    <input
      type="text"
      placeholder="Location:"
      :value="clientLocationValue"
      @input="emit('update:clientLocationValue', $event.target.value)"
    />
    <p style="width: 100%; padding-left: 10px; line-height: 0; padding-top: 10px;">Birthday Date</p>
    <input
      type="date"
      placeholder="Client Name:"
      :value="clientBdayValue"
      @input="emit('update:clientBdayValue', $event.target.value)"
    />
    <p>We will send you reminder on their birthday</p>
    <textarea
      name="clientNote"
      :value="clientNoteValue"
      @input="emit('update:clientNoteValue', $event.target.value)"
      placeholder="Client Note:"
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
