<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import axios from "axios";
import AlertMessage from "../components/AlertMessage.vue";
import DashboardSkeleton from "../components/DashboardSkeleton.vue";

const api = axios.create({
  baseURL: "http://localhost:4123",
  headers: {
    token: `${localStorage.getItem("token")}`,
  },
});

let user = ref(null); // Use ref for reactive data
let isLoading = ref(true); // Add loading state
let isMessage = ref(false);

onMounted(async () => {
  try {
    // Verify token and get user data in one request
    const res = await api.get("/dashboard");
    user.value = res.data; // Assign to .value for refs
  } catch (err) {
    // Redirect to login if unauthorized
    localStorage.removeItem("token"); // Clear invalid token
    window.location.href = "/login";
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <AlertMessage
    v-show="isMessage"
    pageTitle="Customers"
    :msg="alertMes"
    :type="alertType"
  />
  <DashboardSkeleton :user="user" pageTitle="Calendar" :isLoading="isLoading">
    <h3>Hey {{ user.user_name || "Murtiala" }}! <br> You can assign Task, add Event, Appointment to your Calendar</h3>
  </DashboardSkeleton>
</template>

<style scoped></style>
