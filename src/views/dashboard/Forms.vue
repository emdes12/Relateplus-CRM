<script setup>
import { ref, onMounted, computed, onBeforeUnmount, reactive } from "vue";
import AlertMessage from "@/components/AlertMessage.vue";
import DashboardSkeleton from "@/components/DashboardSkeleton.vue";
import BtnDbPry from "@/components/BtnDbPry.vue";
import LeftDialogue from "@/components/LeftDialogue.vue";
import formNull from "@/assets/images/formNull.png";
import { customersList } from "../data";
import NullList from "@/components/NullList.vue";
import ServiceForm from "@/components/ServiceForm.vue";
import apiMode from "../../../apiMode";
import FormBuilder from "@/components/Forms/FormBuilder.vue";
import FormLists from "@/components/Forms/FormLists.vue";
import { useRoute } from "vue-router";

const api = apiMode;

// declaration of value below
const route = useRoute()
const list = ref([]);
let user = ref(null); // Use ref for reactive data
let isLoading = ref(true); // Add loading state
let isMessage = ref(false);
let isAddForm = ref(false);
let alertMes = ref("Successfully logged in");
let alertType = ref("success");

const checkRoute = ()=>{
  if(route.fullPath === "/dashboard/forms/add-form"){
    isAddForm.value = true
  } else {
    isAddForm.value = false
  }
}

const getAllForms = async () => {
  const token = localStorage.getItem("token");
  try {
    console.log(token);

    const data = await api.get("/forms", {
      headers: { token: `${token}` },
    });
    console.log("data", data.data);
    list.value = data.data

    list.value.forEach(async one => {
      const ids = one.form_id
      const data = await api.get("/forms/" + ids + "/responses", { headers: { token: `${token}` },});
      const data_resp = data.data;

      const numResp = data_resp.map((resp) => resp.response.length);
      console.log('num', numResp.length)
      one.numResp = numResp.length
    })
    console.log("Form list", list.value);
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
  isAddForm.value = !isAddForm.value;
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
    getAllForms()
    checkRoute()
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
    :hBtnShow="list.length"
    hBtnMsg="Create Form"
    :user="user"
    pageTitle="Forms"
    v-if="!isLoading"
  >
    <!-- enter your content below (slots) -->
    <!-- no list found -->
    <NullList
      v-if="!list.length && !isAddForm"
      :nullImg="formNull"
      :actionPermit="user.user_permission"
      null-text="Create RSVP form for event, create a new intake form, create a feedback form and manage data formation."
      null-btn-text="Create Form"
      :toggleDialogueBtn="toggleDialogue"
    />

    <!-- list available -->
    <FormLists v-if="list && !isAddForm" :list />
    <!-- enter of content (slot) -->
    <FormBuilder v-if="isAddForm" :getAllForms="getAllForms" :toggleDialogue />
  </DashboardSkeleton>
</template>

<style scoped>
.initials {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: grid;
  color: #ffffff;
  place-items: center;
}

.contacts-container {
  padding: 20px;
  width: 100%;
  margin: 0 auto;
  font-family: Arial, sans-serif;
}

.section-header {
  margin: 20px 20px 20px;
  font-size: 1.8rem;
  color: #333;
  padding-bottom: 20px;
  border-bottom: 2px solid #eee;
}

.contacts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(450px, 1fr));
  gap: 25px;
  margin-bottom: 40px;
}

.contact-card {
  border-radius: 34px;
  border: 1px solid #e8e8e8;
  padding: 40px;
  padding-top: 80px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.contact-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
}

.card-content {
  color: #333;
  display: flex;
  gap: 15px;
  flex-direction: column;
}

.card-content h3 {
  margin: 0 0 10px 0;
  font-size: 1.5rem;
  font-weight: 600;
}

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
