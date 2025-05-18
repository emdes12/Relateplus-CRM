<script setup>
defineProps({
  responses: Object,
  form: Object
})
</script>

<template>
  <div class="table-container">
      <div class="grid-header">
        <div :style="`background-color: ${form.color};`" v-for="key in Object.keys(responses[0])">{{ key }}</div>
      </div>
      <div class="value-container">
        <div class="grid-body" v-for="resp in responses">
          <div :style="`border-color: ${form.color};`" v-for="key in Object.values(resp)">{{ key }}</div>
        </div>
      </div>
  </div>
</template>

<style>
  .table-container {
    width: 100%;
    overflow: auto;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .value-container {
    flex: 1;
    width: max-content;
    overflow-x: hidden;
    overflow-y: scroll;
    max-height: 60vh;
  }

  .grid-header, .grid-body {
    display: flex;
    width: fit-content;
  }

  .grid-header div,   .grid-body div {
    max-width: 240px;
    width: 239px;
    /* flex: content; */
    color: #fff;
    border: 1px solid #fff;
    padding: 10px 12px;
  }

  .grid-body div {
    color: #000;
  }
</style>
