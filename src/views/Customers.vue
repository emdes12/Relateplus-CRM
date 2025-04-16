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
let alertMes = ref("Successfully logged in");
let alertType = ref("success");

const getGreeting = () => {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) {
    return "Good morning!";
  } else if (hour >= 12 && hour < 17) {
    return "Good afternoon!";
  } else if (hour >= 17 && hour < 21) {
    return "Good evening!";
  } else {
    return "Good night!";
  }
};
const showAlert = (string1, string2) => {
  alertMes.value = string1;
  alertType.value = string2;
  isMessage.value = true;
  console.log(alertMes.value);
  console.log(isMessage.value);
  setInterval(() => {
    isMessage.value = false;
  }, 5000);
};

onMounted(async () => {
  try {
    // Verify token and get user data in one request
    const res = await api.get("/dashboard");
    user.value = res.data; // Assign to .value for refs
    showAlert(`${res.data.user_name} Welcome`, "success");
  } catch (err) {
    // Redirect to login if unauthorized
    showAlert(err.response.data, "error");
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
  <DashboardSkeleton :user="user" pageTitle="Customers List" :isLoading="isLoading">
    <h3>Hey {{ user.user_name || "Murtiala" }}!</h3>
    <h3>Welcome to Dashboard</h3>
  </DashboardSkeleton>
</template>

<style scoped></style>
