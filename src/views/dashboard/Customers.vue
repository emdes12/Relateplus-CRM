<script setup>
import {
  ref,
  onMounted,
  computed,
  onBeforeUnmount,
  reactive,
  onBeforeMount,
} from "vue";
import AlertMessage from "@/components/AlertMessage.vue";
import DashboardSkeleton from "@/components/DashboardSkeleton.vue";
import LeftDialogue from "@/components/LeftDialogue.vue";
import MidDialogue from "@/components/MidDialogue.vue";
import customerNull from "@/assets/images/customersnull.png";
import emailIcon from "@/assets/icons/emailIcon.svg";
import editIcon from "@/assets/icons/editIcon.svg";
import phoneIcon from "@/assets/icons/phoneIcon.svg";
import deleteIcon from "@/assets/icons/deleteIcon.svg";
import NullList from "@/components/NullList.vue";
import ClientForm from "@/components/ClientForm.vue";
import apiMode from "../../../apiMode";

const api = apiMode;

// declaration of value below
let list = ref(null);
let user = ref(null); // Use ref for reactive data
let isLoading = ref(true); // Add loading state
let isMessage = ref(true);
let isAddForm = ref(false);
let isUpdateForm = ref(false);
let isDeleteDialog = ref(false);
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

let clientUpdateForm = reactive({
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
  isAddForm.value = !isAddForm.value;
};

const toggleUpdateDialogue = () => {
  isUpdateForm.value = !isUpdateForm.value;
};

const toggleDeleteDialogue = () => {
  isDeleteDialog.value = !isDeleteDialog.value;
};

const updateClientDialogue = (id) => {
  const clientList = list.value;
  localStorage.setItem("Client_id", id);
  clientList.filter((client) => {
    if (client.client_id === id) {
      clientUpdateForm.name = client.client_name;
      clientUpdateForm.number = client.client_number;
      clientUpdateForm.email = client.client_email;
      clientUpdateForm.label = client.client_label;
      clientUpdateForm.location = client.client_location;
      clientUpdateForm.birthday = client.client_birthday;
      clientUpdateForm.note = client.client_note;
    }
  });

  toggleUpdateDialogue();
  console.log(clientUpdateForm);
};

// client delete handler
const deleteClientDialogue = async (id) => {
  localStorage.setItem("client_id", id);
  toggleDeleteDialogue();
};

const deleteClient = async () => {
  try {
    const id = localStorage.getItem("client_id");
    const token = localStorage.getItem("token");
    const data = await api.delete(`/dashboard/customers/${id}`, {
      headers: { token: `${token}` },
    });
    const dl = data.data;
    list.value = dl.map((lst) => {
      return {
        client_initial: lst.client_name[0].toUpperCase(),
        ...lst,
      };
    });

    showAlert("Client deleted successffully");
    toggleDeleteDialogue();
  } catch (error) {
    console.log(error);
    toggleDeleteDialogue();
    showAlert(error.response.data, "error");
  }
};

// client update submit handler
const submitClientUpdate = async () => {
  try {
    console.log("updae form", clientUpdateForm);

    const id = localStorage.getItem("Client_id");
    const token = localStorage.getItem("token");
    await api.patch(`/dashboard/customers/${id}`, clientUpdateForm, {
      headers: { token: `${token}` },
    });
    getClientList();
    toggleUpdateDialogue();
    showAlert("Customer detail successfully updated", "success");
    clientUpdateForm.value = {
      name: "",
      number: "",
      email: "",
      label: "",
      location: "",
      birthday: "",
      note: "",
    };
    localStorage.removeItem("Client_id");
  } catch (error) {
    console.log(error);
    toggleUpdateDialogue();
    showAlert(error.response.data, "error");
  }
};

// add client add form
const submitClientForm = async () => {
  try {
    const token = localStorage.getItem("token");
    await api.post("/dashboard/customers", clientForm, {
      headers: { token: `${token}` },
    });
    toggleDialogue();
    showAlert("Customer Added", "success");
    clientForm.value = {
      name: "",
      number: "",
      email: "",
      label: "",
      location: "",
      birthday: "",
      note: "",
    };
    getClientList();
  } catch (error) {
    console.log(error);
    toggleDialogue();
    showAlert(error.response.data, "error");
  }
};

// alert handler
const showAlert = (string1, string2) => {
  alertMes.value = string1;
  alertType.value = string2;
  isMessage.value = true;
  setTimeout(() => {
    isMessage.value = false;
    console.log("alerted");
  }, 5000);
};

// function to get CLient List
const getClientList = async () => {
  const token = localStorage.getItem("token");
  try {
    console.log(token);

    const data = await api.get("/dashboard/customers", {
      headers: { token: `${token}` },
    });
    console.log("data", data.data);
    const dl = data.data;
    list.value = dl.map((lst) => {
      return {
        client_initial: lst.client_name[0].toUpperCase(),
        ...lst,
      };
    });
    console.log("List", list.value);
  } catch (error) {
    console.error(error.response);
    localStorage.removeItem("duserdata");
    localStorage.removeItem("token");
    window.location.href = "/login";
  }
};

// all unmount functions
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

      if(data.user_permission !== "admin"){
        return window.location.href = "/dashboard/calendar"
      }

      getClientList();
      user.value = data; // Assign to .value for refs
    } else {
      localStorage.removeItem("duserdata");
      window.location.href = "/login";
    }
    showAlert(`${user.value.user_name} Welcome`, "success");
  } catch (err) {
    // Redirect to login if unauthorized
    console.log(err);
    showAlert(err.response.data, "error");
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

  <MidDialogue
    dialog-header="Delete Client"
    :toggleDialogueBtn="toggleDeleteDialogue"
    :actionClickSubmit="deleteClient"
    v-show="isDeleteDialog"
    headerColor="red"
  >
    <div class="delete-dial">
      <h3 style="font-size: 20px">Are you sure you want to delete?</h3>
      <p>This action is not reverseable</p>
    </div>
  </MidDialogue>

  <!-- Update form Dialogue -->
  <LeftDialogue
    dialogHeader="Update Contact"
    :toggleDialogueBtn="toggleUpdateDialogue"
    :actionClickSubmit="submitClientUpdate"
    actionText="Update"
    v-show="isUpdateForm"
  >
    <ClientForm
      v-model:clientNameValue="clientUpdateForm.name"
      v-model:clientNumberValue="clientUpdateForm.number"
      v-model:clientEmailValue="clientUpdateForm.email"
      v-model:clientLabelValue="clientUpdateForm.label"
      v-model:clientLocationValue="clientUpdateForm.location"
      v-model:clientBdayValue="clientUpdateForm.birthday"
      v-model:clientNoteValue="clientUpdateForm.note"
    />
  </LeftDialogue>

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
      :actionPermit="user.user_permission"
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
            <div class="contact-action-btns">
              <span @click="updateClientDialogue(client.client_id)"
                ><img :src="editIcon" alt="edit icon"
              /></span>
              <span @click="deleteClientDialogue(client.client_id)"
                ><img :src="deleteIcon" alt="delete icon"
              /></span>
            </div>
            <div class="card-content">
              <div
                class="initials"
                :style="{ backgroundColor: client.client_color }"
              >
                {{ client.client_initial }}
              </div>
              <h3>{{ client.client_name }}</h3>
              <span
                ><img :src="phoneIcon" />
                <p class="phone">{{ client.client_number }}</p>
              </span>
              <span v-if="client.client_email"
                ><img :src="emailIcon" />
                <p class="email">{{ client.client_email }}</p>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- enter of content (slot) -->
  </DashboardSkeleton>
</template>

<style scoped>
.delete-dial {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 10px;
}

.delete-dial h3 {
  color: red;
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
  /* cursor: pointer; */
  padding: 40px;
  padding-top: 80px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
}

.contact-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
}

.contact-action-btns {
  position: absolute;
  top: 40px;
  right: 40px;
  gap: 10px;
  display: none;
}

.contact-card:hover .contact-action-btns {
  display: flex;
}

.contact-action-btns span {
  cursor: pointer;
  width: 30px;
  height: 30px;
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

.card-content span {
  display: flex;
  align-items: center;
  gap: 10px;
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
