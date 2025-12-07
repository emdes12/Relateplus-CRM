<script setup>
import { ref } from "vue";
import AddAppointment from "./calendar/AddAppointment.vue";
import AddEvent from "./calendar/AddEvent.vue";
import AddTask from "./calendar/AddTask.vue";

defineProps({
  toggleDialogue: Function,
});

const isEventForm = ref(false);
const isAppointmentForm = ref(false);

const switchToTask = () => {
  isEventForm.value = false;
  isAppointmentForm.value = false;
};

const switchToEvent = () => {
  isEventForm.value = true;
  isAppointmentForm.value = false;
};

const switchToAppointment = () => {
  isEventForm.value = false;
  isAppointmentForm.value = true;
};
</script>

<template>
  <div class="add-form-container">
    <div class="hide-form-container" @click="toggleDialogue">x</div>

    <div class="form-holders">
      <div class="calendar-types">
        <span
          @click="switchToTask"
          :class="`${!isEventForm && !isAppointmentForm ? 'active' : ''}`"
          >Add tasks</span
        >
        <span
          @click="switchToEvent"
          :class="`${isEventForm && !isAppointmentForm ? 'active' : ''}`"
          >Create Event</span
        >
        <span
          @click="switchToAppointment"
          :class="`${!isEventForm && isAppointmentForm ? 'active' : ''}`"
          >Add Appointment</span
        >
      </div>
      <div class="form-body">
        <AddTask :toggleDialogue v-if="!isEventForm && !isAppointmentForm" />
        <AddEvent :toggleDialogue v-if="isEventForm && !isAppointmentForm" />
        <AddAppointment :toggleDialogue v-if="!isEventForm && isAppointmentForm" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.add-form-container {
  position: relative;
  display: flex;
  gap: 2rem;
  padding: 2rem;
  background-color: #f9fafb;
  height: 85vh;
  box-sizing: border-box;
}

.hide-form-container {
  width: 30px;
  height: 30px;
  display: grid;
  place-items: center;
  cursor: pointer;
  color: #f00;
  font-size: large;
  position: absolute;
  top: 3px;
  right: 3px;
  transition: all ease 0.5s;
}

.hide-form-container:hover {
  background-color: #f00;
  color: #fff;
}

.form-holders {
  flex: 1;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.04);
  /* padding: 2rem; */
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 0.2rem;
  overflow: auto;
}

.calendar-types {
  width: 100%;
  background-color: #f9fafb;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 2px;
}

.calendar-types span {
  width: 100%;
  display: grid;
  place-items: center;
  background-color: #e5e7eb;
  padding: 0.8rem;
}

.calendar-types span.active {
  background-color: #ffffff;
}

.calendar-types span:not(.active) {
  cursor: pointer;
}

.form-body {
    padding: 2rem;
    position: relative;
    flex: 1;
    width: 100%;
    min-height: 450px;
}
</style>
