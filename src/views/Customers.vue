<script setup>
import { ref, onMounted, computed, onBeforeUnmount } from "vue";
import axios from "axios";
import AlertMessage from "../components/AlertMessage.vue";
import DashboardSkeleton from "../components/DashboardSkeleton.vue";
import BtnDbPry from "../components/BtnDbPry.vue";
import LeftDialogue from "../components/LeftDialogue.vue";
import customernull from "../assets/images/customersnull.png";

// const api = axios.create({
//   baseURL: "http://localhost:4123",
//   headers: {
//     token: `${localStorage.getItem("token")}`,
//   },
// });

const api = axios.create({
  baseURL: "https://relate-server-production.up.railway.app/",
  withCredentials: true, // If using cookies
  headers: {
    token: `${localStorage.getItem("token")}`,
  },
})

const list = ref([
  {
    client_name: "Bello Oye",
    client_initial: "B",
    client_phone: "09012345678",
    client_email: "oyebellow@mail.com",
    client_color: "navy",
  },
  {
    client_name: "Seun Ojo",
    client_initial: "S",
    client_phone: "09012345678",
    client_email: "@mail.com",
    client_color: "maroon",
  },
  {
    client_name: "Seyi TIMFAT",
    client_initial: "S",
    client_phone: "09012345678",
    client_email: "seyi@timfat.com.ng",
    client_color: "orange",
  },
  {
    client_name: "Alabi",
    client_initial: "A",
    client_phone: "09012345678",
    client_email: "labi2@mail.com",
    client_color: "black",
  },
  {
    client_name: "Sharafa",
    client_initial: "S",
    client_phone: "09012345678",
    client_email: "saraf@mail.com",
    client_color: "olive",
  },
  {
    client_name: "Toheeb",
    client_initial: "T",
    client_phone: "09012345678",
    client_email: "olu.t@gmail.com",
    client_color: "olive",
  },
]);

let user = ref(null); // Use ref for reactive data
let isLoading = ref(true); // Add loading state
let isMessage = ref(false);
let isAddForm = ref(true);
let alertMes = ref("Successfully logged in");
let alertType = ref("success");

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

const showAddForm = () => {
  console.log("show form");
  isAddForm.value = !isAddForm.value;
  console.log(isAddForm.value);
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
  <!-- Add form Dialogue -->
  <LeftDialogue :onClickToShow="showAddForm" v-show="isAddForm">
    <h1>add you client details</h1>
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
    :onClickToShow="showAddForm"
    :hBtnShow="list.length"
    hBtnMsg="Add Client"
    :user="user"
    pageTitle="Customers List"
    :isLoading="isLoading"
  >
    <!-- enter your content below (slots) -->
    <!-- no list found -->
    <div v-show="!list.length" class="nulll">
      <img :src="customernull" alt="no client yet" />
      <span
        >Manage your client base. Structure your Customers list using labels and
        group</span
      >
      <BtnDbPry :onClickToShow="showAddForm" msg="Add Client" />
    </div>

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
.nulll {
  display: flex;
  margin: 0 auto;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  padding-top: 100px;
  width: 4s00px;
  text-align: center;
}

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
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
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
