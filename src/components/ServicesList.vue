<script setup>
import editIcon from "@/assets/icons/editIcon.svg";
import deleteIcon from "@/assets/icons/deleteIcon.svg";
import AlertMessage from "./AlertMessage.vue";
import { ref } from "vue";
defineProps({
  list: Array,
  getService: Function,
  deleteService: Function,
});

const alertMsg = ref("");
const alertType = ref("");
const isShowMessage = ref(false);

const showAlert = (arg1, arg2) => {
  alertMsg.value = arg1;
  alertType.value = arg2;
  isShowMessage.value = true;
  setTimeout(()=>{isShowMessage.value = false}, 2000);
};

function formatCurrency(dig) {
  if (isNaN(dig)) return console.log("invalid number");

  // seperate decimals from integer
  const [integer, decimal] = dig.toString().split(".");

  let result = "";
  for (let j = 0; j < integer.length; j++) {
    if (j > 0 && j % 3 === 0) {
      result = "," + result;
    }
    result = integer[integer.length - 1 - j] + result;
  }
  return decimal ? `${result}.${decimal}` : result;
}
</script>

<template>
  <AlertMessage :msg="alertMsg" :type="alertType" v-show="isShowMessage" />

  <div class="services-container">
    <div
      class="service-list"
      v-for="service in list"
      :style="`border-color: ${service.service_color}`"
      :key="service.service_id"
    >
      <div class="serv-details">
        <h5>{{ service.service_name }}</h5>

        <span v-if="service.service_price">
          |
          {{ service.service_currency }}
          {{ formatCurrency(service.service_price) }}
        </span>
        <span v-if="service.service_duration">
          | {{ service.service_duration }}
        </span>
        <span v-if="service.is_bookable"> | Online </span>
      </div>
      <div class="service-action-btns">
        <span @click="getService(service.service_id)"
          ><img :src="editIcon" alt="edit icon"
        /></span>
        <span @click="deleteService(service.service_id)"
          ><img :src="deleteIcon" alt="delete icon"
        /></span>
      </div>
    </div>
  </div>
</template>

<style scope>
.services-container {
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 20px;
  width: 100%;
}

.serv-details {
  display: flex;
  gap: 10px;
}

.service-list {
  display: flex;
  gap: 10px;
  align-items: center;
  border: 1px solid black;
  justify-content: space-between;
  border-left-width: 5px;
  width: 100%;
  padding: 10px 20px;
  border-radius: 10px;
  cursor: pointer;
}

.service-list:hover .service-action-btns {
  visibility: visible;
}

.service-list * {
  font-size: large;
}

.service-list h5 {
  font-weight: 600;
}

.service-action-btns {
  visibility: hidden;
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: center;
}

.service-action-btns span {
  padding: 5px;
}

.service-action-btns span:hover {
  background-color: rgba(95, 158, 160, 0.219);
}
</style>
