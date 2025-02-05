<script setup>
import { defineProps, defineEmits } from "vue";
defineProps({
    inpType: {
        type: String,
        required: true,
    },
    modelValue: {
        type: String,
        required: true,
    },
    inpPlaceholder: {
        type: String,
        required: true,
    },
    inpIcon: {
        type: String,
        required: false,
    },
    passChangeAction: {
        type: Function,
        required: false,
    },
    passShowIcon: {
        type: String,
        required: false,
    },
});

const emit = defineEmits(["update:modelValue"])
</script>

<template>
    <label>
        <img :src="inpIcon" class="inp-icon"/>
        <input :type="inpType" :value="modelValue" @input="emit('update:modelValue', $event.target.value)" :placeholder="inpPlaceholder" />
        <img v-show="passShowIcon" :src="passShowIcon" @click="passChangeAction" class="show-icon"/>
    </label>
</template>

<style scoped>
label {
    position: relative;
    width: 100%;
}

.inp-icon {
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    left: 30px;
    width: 30px;
}

.show-icon {
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    right: 30px;
    width: 30px;
    cursor: pointer;
}

input {
    border: 1px solid black;
    width: 100%;
    padding: 18px 50px;
    color: #777676;
    text-align: left;
    border-radius: 10px;
    font-family: "League Spartan";
    font-size: 28px;
    font-style: normal;
    font-weight: 200;
    line-height: normal;
}
</style>