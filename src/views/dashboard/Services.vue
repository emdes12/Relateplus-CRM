<script setup>
import { ref, onMounted, computed, onBeforeUnmount, reactive } from "vue";
import axios from "axios";
import AlertMessage from "@/components/AlertMessage.vue";
import DashboardSkeleton from "@/components/DashboardSkeleton.vue";
import BtnDbPry from "@/components/BtnDbPry.vue";
import LeftDialogue from "@/components/LeftDialogue.vue";
import serviceNull from "@/assets/images/services-box.png";
import { customersList } from "../data";
import NullList from "@/components/NullList.vue";
import ServiceForm from "@/components/ServiceForm.vue";
import apiMode from "../../../apiMode";
import ServicesList from "@/components/ServicesList.vue";

const api = apiMode;

// declaration of value below
const list = ref([]);
let user = ref(null); // Use ref for reactive data
let isLoading = ref(true); // Add loading state
let isMessage = ref(false);
let isAddForm = ref(false);
let isUpdateForm = ref(false);
let alertMes = ref("Successfully logged in");
let alertType = ref("success");

let serviceForm = reactive({
  name: "",
  price: 0,
  currency: "USD",
  description: "",
  duration: "",
  isBookable: false,
});

let updateServiceForm = {};
let updateServiceValue = {};

const resetServiceForm = () => {
  serviceForm = ref({
    name: "",
    price: 0,
    currency: "USD",
    description: "",
    duration: "",
    isBookable: false,
  });
};

// submit Functions goes below
const submitServiceForm = async () => {
  const token = localStorage.getItem("token");
  try {
    await api.post("/dashboard/services", serviceForm, {
      headers: {
        token: token,
      },
    });
    getServices();
    toggleDialogue();
    showAlert("New Service Added", "success");
    resetServiceForm();
    console.log("cleared?", serviceForm);
  } catch (error) {
    console.log(error?.response?.data);
  }
};

const submitUpdatedService = async () => {
  if (
    JSON.stringify(updateServiceForm) === JSON.stringify(updateServiceValue)
  ) {
    showAlert("No editing was made", "error");
    toggleUpdateDialogue();
    return;
  }

  try {
    const token = localStorage.getItem("token");
    const { service_id } = updateServiceForm;
    console.log(service_id);

    await api.patch(`dashboard/services/${service_id}`, updateServiceForm, {
      headers: { token },
    });
    console.log("3rd checkpoint");

    getServices();
    toggleUpdateDialogue();
    showAlert(`${updateServiceForm.service_name} updated successfull`, "error");
  } catch (error) {
    console.error(error?.response?.data);
    showAlert(`${error?.response?.data}`, "error");
  }
};

// get all services from server
const getServices = async () => {
  const token = localStorage.getItem("token");
  try {
    const resp = await api.get("/dashboard/services", {
      headers: { token: token },
    });

    list.value = resp.data;
    console.log("servList", resp?.data);
  } catch (error) {
    console.error(error?.response?.data);
    // showAlert(error?.response?.data, "error")
  }
};

// get single services from server
const getService = async (id) => {
  const token = localStorage.getItem("token");
  try {
    const resp = await api.get("/dashboard/services/" + id, {
      headers: { token: token },
    });

    updateServiceForm = {
      service_id: resp.data.service_id,
      service_name: resp.data.service_name,
      service_price: resp.data.service_price,
      service_duration: resp.data.service_duration,
      service_description: resp.data.service_description,
      is_bookable: resp.data.is_bookable,
    };
    updateServiceValue = {
      service_id: resp.data.service_id,
      service_name: resp.data.service_name,
      service_price: resp.data.service_price,
      service_duration: resp.data.service_duration,
      service_description: resp.data.service_description,
      is_bookable: resp.data.is_bookable,
    };
    console.log(updateServiceForm === updateServiceValue);
    // isUpdateForm.value = true
    toggleUpdateDialogue();
  } catch (error) {
    console.error(error?.response?.data);
    showAlert(error?.response?.data, "error");
  }
};

// delete a single service
const deleteService = async (id) => {
  const token = localStorage.getItem("token");
  try {
    const resp = await api.delete("/dashboard/services/" + id, {
      headers: { token: token },
    });
    getServices();
    showAlert("service Deleted", "success");
  } catch (error) {
    console.error(error?.response?.data);
    showAlert(error?.response?.data, "error");
  }
};

const showAlert = (string1, string2) => {
  alertMes.value = string1;
  alertType.value = string2;
  isMessage.value = true;
  setTimeout(() => {
    isMessage.value = false;
  }, 5000);
};

const toggleDialogue = () => {
  isAddForm.value = !isAddForm.value;
};

const toggleUpdateDialogue = () => {
  isUpdateForm.value = !isUpdateForm.value;
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
    console.log("Our user", user.value.length);
    getServices();
  } catch (err) {
    // Redirect to login if unauthorized
    console.log(err);
    showAlert(err.response.data, "error");
    localStorage.removeItem("token"); // Clear invalid token
    localStorage.removeItem("duserdata");
    window.location.href = "/login";
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <!-- still loading user data from server -->
  <div v-show="isLoading">Loading dashboard...</div>

  <!-- Add service form Dialogue -->
  <LeftDialogue
    dialogHeader="Add Product/Service"
    :toggleDialogueBtn="toggleDialogue"
    :actionClickSubmit="submitServiceForm"
    v-show="isAddForm"
  >
    <ServiceForm
      v-model:serviceNameValue="serviceForm.name"
      v-model:servicePriceValue="serviceForm.price"
      v-model:servicePriceCurrency="serviceForm.currency"
      v-model:serviceDurationValue="serviceForm.duration"
      v-model:serviceDescriptionValue="serviceForm.description"
      v-model:serviceIsBookable="serviceForm.isBookable"
    />
  </LeftDialogue>

  <!-- update service form Dialogue -->
  <LeftDialogue
    :actionClickSubmit="submitUpdatedService"
    :toggleDialogueBtn="toggleUpdateDialogue"
    v-show="isUpdateForm"
  >
    <ServiceForm
      v-model:serviceNameValue="updateServiceForm.service_name"
      v-model:servicePriceValue="updateServiceForm.service_price"
      v-model:serviceDurationValue="updateServiceForm.service_duration"
      v-model:serviceDescriptionValue="updateServiceForm.service_description"
      v-model:serviceIsBookable="updateServiceForm.is_bookable"
    />
  </LeftDialogue>

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
    hBtnMsg="Add Services"
    :user="user"
    pageTitle="Products/Services List"
    v-if="!isLoading"
  >
    <!-- enter your content below (slots) -->
    <!-- no list found -->
    <NullList
      v-show="!list.length"
      :nullImg="serviceNull"
      :actionPermit="user.user_permission"
      null-text="Add your products or services. Seamlessly manage your offerings, pricing, and catalog in one place."
      tooltip-text="Create and organize your services or product list."
      null-btn-text="Add Services"
      :toggleDialogueBtn="toggleDialogue"
    />

    <!-- list available -->

    <ServicesList v-if="list" :list :deleteService :getService />

    <!-- enter of content (slot) -->
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
