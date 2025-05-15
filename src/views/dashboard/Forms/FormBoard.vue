<script setup>
import { ref, onMounted, computed, onBeforeUnmount, reactive } from "vue";
import AlertMessage from "@/components/AlertMessage.vue";
import DashboardSkeleton from "@/components/DashboardSkeleton.vue";
import BtnDbPry from "@/components/BtnDbPry.vue";
import LeftDialogue from "@/components/LeftDialogue.vue";
import formNull from "@/assets/images/formNull.png";
import NullList from "@/components/NullList.vue";
import apiMode from "../../../../apiMode";
import { useRoute } from 'vue-router'

const api = apiMode;

// declaration of value below
const route = useRoute()
const storeForm = ref({});
let user = ref(null); // Use ref for reactive data
let isLoading = ref(true); // Add loading state
let isMessage = ref(false);
let isAddForm = ref(false);
let alertMes = ref("Successfully logged in");
let alertType = ref("success");

const getForm = async () => {
  const id = route.params.id;
  const token = localStorage.getItem("token");
  try {
    console.log(token);

    const data = await api.get("/forms/"+id);
    console.log("data", data.data);
    storeForm.value = data.data
    console.log("Form list", storeForm.value);
  } catch (error) {
    console.error(error.response);
  }
};



const showAlert = (string1, string2) => {
  console.log("aleert");
  alertMes.value = string1;
  alertType.value = string2;
  isMessage.value = true;
  console.log(alertMes.value);
  console.log(isMessage.value);
  setTimeout(() => {
    isMessage.value = false;
    console.log("alerted");
  }, 5000);
};

const toggleDialogue = () => {
  const link = document.createElement("a");
  link.href = '/dashboard/forms/add-form';
  link.click();
};

onMounted(async () => {
  try {
    // Verify token and get user data in one request
    const token = localStorage.getItem("token");
    let data = JSON.parse(localStorage.getItem("duserdata"));
    if (token) {
      console.log("Welcome to Dashboard");
      if (!data) {
        const res = await api.get("/dashboard", {
          headers: { token: `${token}` },
        });
        const dl = res.data;
        data = {
          user_initial: dl.user_name[0].toUpperCase(),
          ...dl,
        };
        localStorage.setItem("duserdata", JSON.stringify(data));
      }

      if (data.user_permission !== "admin") {
        return (window.location.href = "/dashboard/calendar");
      }

      user.value = data; // Assign to .value for refs
    } else {
      localStorage.removeItem("duserdata");
      window.location.href = "/login";
    }
    getForm()
    console.log("Our user", user.value.length);
  } catch (err) {
    // Redirect to login if unauthorized
    console.log(err);
    showAlert(err.response.data, "error");
    localStorage.removeItem("token"); // Clear invalid token
    localStorage.removeItem("duserdata"); // Clear invalid token
    window.location.href = "/login";
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <!-- still loading user data from server -->
  <div v-show="isLoading">Loading dashboard...</div>

  <AlertMessage
    v-show="isMessage"
    pageTitle="Customers"
    :msg="alertMes"
    :type="alertType"
  />

  <!-- Dashboard View -->
  <DashboardSkeleton
    :toggleDialogueBtn="toggleDialogue"
    :hBtnShow="1"
    hBtnMsg="Create Form"
    :user="user"
    pageTitle="Forms"
    v-if="!isLoading"
  >
    <!-- enter your content below (slots) -->
    <!-- no list found -->
    <NullList
      v-if="!storeForm && !isAddForm"
      :nullImg="formNull"
      :actionPermit="user.user_permission"
      null-text="Create RSVP form for event, create a new intake form, create a feedback form and manage data formation."
      null-btn-text="Create Form"
      :toggleDialogueBtn="toggleDialogue"
    />

    <!-- list available -->
   
    <!-- enter of content (slot) -->
  </DashboardSkeleton>
</template>

<style scoped>
</style>
