<script setup>
import { ref, onMounted, computed, onBeforeUnmount, reactive } from "vue";
import AlertMessage from "@/components/AlertMessage.vue";
import DashboardSkeleton from "@/components/DashboardSkeleton.vue";
import LeftDialogue from "@/components/LeftDialogue.vue";
import customerNull from "@/assets/images/customersnull.png";
import { customersList } from "../data";
import NullList from "@/components/NullList.vue";
import ClientForm from "@/components/ClientForm.vue";
import apiMode from "../../../apiMode";


const api = apiMode;

// declaration of value below
const list = customersList;
let user = ref(null); // Use ref for reactive data
let isLoading = ref(true); // Add loading state
let isMessage = ref(false);
let isAddForm = ref(false);
let alertMes = ref("Successfully logged in");
let alertType = ref("success");

let clientForm = reactive({
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
const toggleDialogue = () => {
  console.log("toggle");
  isAddForm.value = !isAddForm.value;
  console.log("toggled");
};

const submitClientForm = () => {
  alert(clientForm)
  toggleDialogue()
  showAlert("Form Added", "success")
}

const showAlert = (string1, string2) => {
  alertMes.value = string1;
  alertType.value = string2;
  isMessage.value = true;
  setTimeout(() => {
    isMessage.value = false;
    console.log("alerted")
  }, 5000);
};



onMounted(async () => {
  try {
    // Verify token and get user data in one request
  const token = localStorage.getItem("token");
  let data = JSON.parse(localStorage.getItem("duserdata"))
  if(token){
    console.log("Welcome to Dashboard")
    if(!data){
      const res = await api.get("/dashboard",{headers: { token: `${token}` }});
      data = res.data
      localStorage.setItem("duserdata", JSON.stringify(data))
    }

    user.value = data; // Assign to .value for refs
  } else {
    localStorage.removeItem("duserdata");
    window.location.href = "/login";
  }
    showAlert(`${user.value.user_name} Welcome`, "success");
  } catch (err) {
    // Redirect to login if unauthorized
    showAlert(err.response.data, "error");
    console.log(err);
    localStorage.removeItem("token"); // Clear invalid token
    // window.location.href = "/login";
  } finally {
    isLoading.value = false;
  }
});

// Group clients by initial and sort
const groupedClients = computed(() => {
  const groups = {};
  list.value.forEach((client) => {
    if (!groups[client.client_initial]) {
      groups[client.client_initial] = [];
    }
    groups[client.client_initial].push(client);
  });

  // Sort each group alphabetically
  Object.keys(groups).forEach((initial) => {
    groups[initial].sort((a, b) => a.client_name.localeCompare(b.client_name));
  });

  // Sort the initials alphabetically
  return Object.keys(groups)
    .sort()
    .reduce((acc, key) => {
      acc[key] = groups[key];
      return acc;
    }, {});
});

// Format phone number with country code
const formatPhoneNumber = (phone) => {
  if (phone.startsWith("0")) {
    return `+234 ${phone.substring(1)}`;
  }
  return phone;
};
</script>

<template>
  <!-- still loading user data from server -->
  <div v-show="isLoading">Loading dashboard...</div>

  <!-- Add form Dialogue -->
  <LeftDialogue
    :toggleDialogueBtn="toggleDialogue"
    :actionClickSubmit="submitClientForm"
    v-show="isAddForm"
  >
    <ClientForm
      v-model:clientNameValue="clientForm.name"
      v-model:clientNumberValue="clientForm.number"
      v-model:clientEmailValue="clientForm.email"
      v-model:clientLabelValue="clientForm.label"
      v-model:clientLocationValue="clientForm.location"
      v-model:clientBdayValue="clientForm.birthday"
      v-model:clientNoteValue="clientForm.note"
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
    hBtnMsg="Add Client"
    :user="user"
    pageTitle="Customers List"
    v-if="!isLoading"
  >
    <!-- enter your content below (slots) -->
    <!-- no list found -->
    <NullList
      v-show="!list.length"
      :nullImg="customerNull"
      null-text="Add your product, services, cartalogue. seemless management, manage product and pricing."
      null-btn-text="Add Customer"
      :toggleDialogueBtn="toggleDialogue"
    />

    <!-- list available -->
    <!-- list available -->
    <div v-show="list" class="contacts-container">
      <!-- Group clients by initial and sort alphabetically -->
      <div
        v-for="(group, initial) in groupedClients"
        :key="initial"
        class="alphabet-section"
      >
        <h2 class="section-header">{{ initial }}</h2>
        <div class="contacts-grid">
          <div
            v-for="client in group"
            :key="client.client_name"
            class="contact-card"
          >
            <div class="card-content">
              <div
                class="initials"
                :style="{ backgroundColor: client.client_color }"
              >
                {{ client.client_initial }}
              </div>
              <h3>{{ client.client_name }}</h3>
              <p class="phone">{{ formatPhoneNumber(client.client_phone) }}</p>
              <p class="email">{{ client.client_email }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

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

