<script setup>

defineProps({
  serviceNameValue: String,
  serviceDescriptionValue: String,
  serviceDurationValue: String,
  serviceIsBookable: Boolean,
  servicePriceValue: Number,
});

const emit = defineEmits([
  "update:serviceNameValue",
  "update:servicePriceValue",
  "update:serviceIsBookable",
  "update:serviceDurationValue",
  "update:serviceDescriptionValue",
]);

const checkTarget = (e) => {
  console.log("targeting",e.target.checked);
  console.log ("checking",serviceIsBookable.checked)
};
</script>
<template>
  <div>
    <input
      type="text"
      placeholder="Enter services/product Name:"
      :value="serviceNameValue"
      @input="emit('update:serviceNameValue', $event.target.value)"
      @click="emit('update:serviceNameValue', $event.target.value)"
    />
    <input
      type="number"
      placeholder="0.00"
      min="1"
      :value="servicePriceValue"
      @input="emit('update:servicePriceValue', $event.target.value)"
      @click="emit('update:servicePriceValue', $event.target.value)"
    />
    <input
      type="email"
      placeholder="Duration:"
      :value="serviceDurationValue"
      @input="emit('update:serviceDurationValue', $event.target.value)"
      @click="emit('update:serviceDurationValue', $event.target.value)"
    />
    <label for="serviceIsBookable">
      <input
        type="checkbox"
        name="serviceIsBookable"
        id="serviceIsBookable"
        :checked="serviceIsBookable"
        @click="checkTarget"
        @change="emit('update:serviceIsBookable', $event.target.checked)"
      />
      Bookable Online
    </label>
    <textarea
      name="serviceDescriptionValue"
      :value="serviceDescriptionValue"
      @input="emit('update:serviceDescriptionValue', $event.target.value)"
      @click="emit('update:serviceDescriptionValue', $event.target.value)"
      placeholder="Service Description:"
    ></textarea>
  </div>
</template>
<style scoped>
label {
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: start;
}

label input {
  width: 15px;
  height: 15px;
  accent-color: #f60;
}

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
