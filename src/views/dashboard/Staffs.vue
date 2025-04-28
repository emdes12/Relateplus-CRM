<script setup>
import { ref, onMounted, computed, onBeforeUnmount, reactive } from "vue";
import AlertMessage from "@/components/AlertMessage.vue";
import DashboardSkeleton from "@/components/DashboardSkeleton.vue";
import MidDialogue from "@/components/MidDialogue.vue";
import staffNull from "@/assets/images/staffNull.png";
import NullList from "@/components/NullList.vue";
import StaffForm from "@/components/StaffForm.vue";
import apiMode from "../../../apiMode";

const api = apiMode;

// declaration of value below
const list = ref([]);
let user = ref(null); // Use ref for reactive data
let isLoading = ref(true); // Add loading state
let isMessage = ref(false);
let isAddForm = ref(false);
let alertMes = ref("Successfully logged in");
let alertType = ref("success");

let staffForm = reactive({
  // staff Form values
  name: "",
  number: "",
  email: "",
  role: "",
  employed: "",
  birthday: "",
  note: "",
});

// Functions goes below
const submitStaffForm = async () => {

  console.log(staffForm.name);

  const { name, email, role } = staffForm;
  try {
    const response = await api.post("/auth/register", {
      name: name,
      email: email,
      password: "Staff123",
      permision: "staff",
    });

    // Handle successful login
    console.log("Registration successful:", response.data);

    // Staff detail storing
    try {
    const token = localStorage.getItem("token");
    await api.post("/dashboard/staffs", staffForm, {
      headers: { token: `${token}` },
    });
    toggleDialogue();
    showAlert("Staff Added Successfully", "success");
    staffForm.value = {
      name: "",
      number: "",
      email: "",
      role: "",
      employed: "",
      birthday: "",
      note: "",
    };
    // getStaffList();
  } catch (error) {
    console.log(error);
    toggleDialogue();
    showAlert(error.response.data, "error");
  }
  } catch (error) {
    console.error("failed:", error.response.data);

    // Add error message display to user
    showAlert(error.response.data, "error");
  }
};

// function to get Staff List
const getStaffList = async () => {
  const token = localStorage.getItem("token");
  try {
    console.log(token);

    const data = await api.get("/dashboard/staffs", {
      headers: { token: `${token}` },
    });
    console.log("data", data.data);
    const dl = data.data;
    list.value = dl.map((lst) => {
      return {
        staff_initial: lst.staff_name[0].toUpperCase(),
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
        data = res.data;
        localStorage.setItem("duserdata", JSON.stringify(data));
      }

      user.value = data; // Assign to .value for refs
      getStaffList()
    } else {
      localStorage.removeItem("duserdata");
      window.location.href = "/login";
    }
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

  <!-- Add form Dialogue -->
  <MidDialogue
    :toggleDialogueBtn="toggleDialogue"
    :actionClickSubmit="submitStaffForm"
    v-show="isAddForm"
    dialog-header="Add Staff"
    headerColor="palegreen"
  >
    <StaffForm
      v-model:staffNameValue="staffForm.name"
      v-model:staffNumberValue="staffForm.number"
      v-model:staffEmailValue="staffForm.email"
      v-model:staffRoleValue="staffForm.role"
      v-model:staffEmpDateValue="staffForm.employed"
      v-model:staffBdayValue="staffForm.birthday"
      v-model:staffNoteValue="staffForm.note"
    />
  </MidDialogue>

  <!-- Alert message for notifications -->
  <AlertMessage
    v-show="isMessage"
    pageTitle="Staffs"
    :msg="alertMes"
    :type="alertType"
  />

  <!-- Dashboard View -->
  <DashboardSkeleton
    :toggleDialogueBtn="toggleDialogue"
    :hBtnShow="list.length"
    hBtnMsg="Add Employee"
    :user="user"
    pageTitle="Employee List"
    v-if="!isLoading"
  >
    <!-- enter your content below (slots) -->
    <!-- no list found -->
    <NullList
      v-show="!list.length"
      :nullImg="staffNull"
      null-text="Create a new Employee, Management Staffs List and Communicate wit your staff effectively"
      null-btn-text="Add Employee"
      :toggleDialogueBtn="toggleDialogue"
    />

    <!-- list available -->

    <div class="staffs-body" v-if="list.length">
      <div class="staffs-caontainer">
        <div class="staff-card">
          <div class="staff-initial" :style="{ backgroundColor: staff_color}">
            <div class="circle"><h3>{{ staff_initial || "M" }}</h3></div>
          </div>
          <div class="staff-details">
            <h3>{{ staff_name || "Murtadoh" }}</h3>
            <h4>{{ staff_role || "Manager" }}</h4>
          </div>
        </div>
      </div>
      <div class="staffs-chat">
        member chat arena
      </div>
    </div>

    <!-- enter of content (slot) -->
  </DashboardSkeleton>
</template>

<style scoped>
.staffs-body {
  width: 100%;
  position: relative;
}

.staffs-chat {
  width: 300px;
  background-color: palegreen;
  width: calc(100vh - 200px);
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
