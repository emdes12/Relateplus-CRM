<script setup>
import { ref, onMounted, computed, onBeforeUnmount, reactive } from "vue";
import axios from "axios";
import AlertMessage from "@/components/AlertMessage.vue";
import DashboardSkeleton from "@/components/DashboardSkeleton.vue";
import BtnDbPry from "@/components/BtnDbPry.vue";
import LeftDialogue from "@/components/LeftDialogue.vue";
import calendarNull from "@/assets/images/calendarNull.png";
import { customersList } from "../data";
import NullList from "@/components/NullList.vue";
import CalendarList from "@/components/CalendarList.vue";
import apiMode from "../../../apiMode";
import CalendarForms from "@/components/CalendarForms.vue";

const api = apiMode;

// declaration of value below
const list = ref([]);
let user = ref(null); // Use ref for reactive data
let isLoading = ref(true); // Add loading state
let isMessage = ref(false);
let isAddForm = ref(false);
let alertMes = ref("Successfully logged in");
let alertType = ref("success");

let serviceForm = reactive({
  // client Form values
  name: "",
  number: "",
  email: "",
  label: "",
  location: "",
  birthday: "",
  note: "",
});

// Functions goes below
const getCalendars = async () => {
  const token = localStorage.getItem("token")
  try {
    const calendar = await api.get("/calendar", {headers: {token}});
    list.value = calendar.data
    console.log("calendar list",list.value)
  } catch (error) {
    console.error(error?.response?.data)
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
  isAddForm.value = !isAddForm.value;
};

onMounted(async () => {
  try {
    // Verify token and get user data in one request
    const token = localStorage.getItem("token");
    let data = JSON.parse(localStorage.getItem("duserdata"));
    if (token) {
      // console.log("Welcome to Dashboard");
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

      user.value = data; // Assign to .value for refs
    } else {
      localStorage.removeItem("duserdata");
      window.location.href = "/login";
    }
    getCalendars();
    // console.log("Our user", user.value.length);
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

  <!-- Alert message for notifications -->
  <AlertMessage
    v-show="isMessage"
    pageTitle="Customers"
    :msg="alertMes"
    :type="alertType"
  />

  <!-- Dashboard View -->
  <DashboardSkeleton
    :toggleDialogueBtn="toggleDialogue"
    :hBtnShow="list.length"
    hBtnMsg="Add to calendar"
    :user="user"
    pageTitle="Calendars"
    v-if="!isLoading"
  >
    <!-- enter your content below (slots) -->
    <!-- no list found -->
    <NullList
      v-show="!list.length && !isAddForm"
      :nullImg="calendarNull"
      :actionPermit="user.user_permission"
      null-text="Plan and assign tasks to team members. Keep track of deadlines, appointments, event, and meetings easily."
      tooltip-text="Create tasks and appointments. Stay on top of your schedule."
      null-btn-text="Add to calendar"
      :toggleDialogueBtn="toggleDialogue"
    />

    <!-- add events to calendar -->
    <!-- <AddEvent :toggleDialogue v-show="isAddForm"/> -->
    <CalendarForms :toggleDialogue v-show="isAddForm" />

    <CalendarList v-show="list.length && !isAddForm" :list />

    <!-- list available -->

    <!-- enter of content (slot) -->
  </DashboardSkeleton>
</template>

<style scoped>


.card-content p {
  margin: 5px 0;
  font-size: 1rem;
}

.card-content .phone {
  font-weight: 500;
}

.card-content .email {
  color: inherit;
  opacity: 0.9;
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .contacts-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
  }
}

@media (max-width: 768px) {
  .contacts-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 15px;
  }

  .contact-card {
    padding: 15px;
  }
}

@media (max-width: 480px) {
  .contacts-grid {
    grid-template-columns: 1fr;
  }

  .section-header {
    font-size: 1.5rem;
  }
}
</style>
