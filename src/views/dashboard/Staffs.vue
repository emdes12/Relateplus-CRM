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
const chats = ref([]);
let user = ref(null); // Use ref for reactive data
let isLoading = ref(true); // Add loading state
let isChatSection = ref(false);
let isMessage = ref(false);
let isAddForm = ref(false);
let alertMes = ref("Successfully logged in");
let alertType = ref("success");
let chatAttachMessage = ref("");
let alert_mess = ref("");
let chatInputMessage = ref("");
const selectedFile = ref(null); // for selected file to upload
const progress = ref(0);
const fileInput = ref(null);
const uploadStatus = ref("");
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
      showAlert("Team Member Added Successfully", "success");
      alert(
        "an account as been create for this member with password: Staff123"
      );
      staffForm.value = {
        name: "",
        number: "",
        email: "",
        role: "",
        employed: "",
        birthday: "",
        note: "",
      };
      getStaffList();
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

// send message
const handleInpuValue = (e) => {
  chatInputMessage.value = e.target.value;
  console.log({ ref: chatInputMessage.value, value: e.target.value });
};

const handleChatAlert = (mess) => {
  alert_mess.value = mess;
  setTimeout(() => {
    alert_mess.value = "";
  }, 5000);
};

// handle file upload
const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // Validate file type
  const validTypes = [
    "image/jpeg",
    "image/png",
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  if (!validTypes.includes(file.type)) {
    handleChatAlert(
      "Invalid file type. Only JPG, PNG, PDF, and DOCX are allowed."
    );
    fileInput.value = ""; // Reset input
    return;
  }

  // Validate file size (5MB max)
  if (file.size > 5 * 1024 * 1024) {
    handleChatAlert("File size must be less than 5MB");
    fileInput.value = ""; // Reset input
    return;
  }

  selectedFile.value = file;
  uploadFile();
};

// uploading file
const uploadFile = async () => {
  if (!selectedFile.value) return;

  const formData = new FormData();
  formData.append("file", selectedFile.value);

  try {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("duserdata"));

    formData.append("sender_name", user.user_name);
    formData.append("sender_permission", user.user_permission);
    formData.append("sender_id", user.user_id);
    formData.append("chat_message", chatInputMessage.value);
    formData.append("sender_color", user.user_color);

    const response = await api.post("/chats/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        token: `${token}`,
      },
      onUploadProgress: (progressEvent) => {
        progress.value = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
      },
    });

    handleChatAlert("File uploaded successfully!");
    console.log("File data:", response.data);

    // Reset after successful upload
    selectedFile.value = null;
    fileInput.value = "";
    setTimeout(() => {
      progress.value = 0;
    }, 3000);
  } catch (err) {
    console.error("Upload error:", err);
    handleChatAlert(err.response?.data || "Failed to upload file");
  }
};

// handle text message sending
const handleSendMessage = async () => {
  try {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("duserdata"));
    const body = reactive({
      sender_name: user.user_name,
      sender_permission: user.user_permission,
      sender_id: user.user_id,
      chat_message: chatInputMessage.value,
      sender_color: user.user_color,
    });

    const result = await api.post("/chats/message", body, {
      headers: { token: `${token}` },
    });

    chatInputMessage.value = "";
    handleChatAlert(result.data);
    getMessages();
  } catch (error) {
    console.log(error);
    handleChatAlert(error.response.data);
  }
};

// get all message
const getMessages = async () => {
  try {
    const token = localStorage.getItem("token");

    const result = await api.get("/chats/message", {
      headers: { token: `${token}` },
    });
    const rowMess = result.data;
    console.log("Row", rowMess);

    chats.value = rowMess.filter(Boolean).map((lst) => {
      return {
        sender_initial: lst.sender_name[0].toUpperCase(),
        ...lst,
      };
    });
    console.log(chats.value);
  } catch (error) {
    console.log(error);
  }
};

// file downloader
const downloadFile = async (fileId, fileName) => {
  try {
    const token = localStorage.getItem("token");
    const response = await api.get(`/chats/files/${fileId}`, {
      responseType: "blob",
      headers: { token: `${token}` },
    });

    // Create blob URL
    const url = window.URL.createObjectURL(new Blob([response.data]));

    // Create temporary link and trigger download
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName || "download");
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Download failed:", error);
    showAlert("Download failed", "error");
    // Handle error (show toast/message to user)
  }
};

// function to get Team List
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
        const dl = res.data;
        data = {
          user_initial: dl.user_name[0].toUpperCase(),
          ...dl,
        };
        localStorage.setItem("duserdata", JSON.stringify(data));
      }

      user.value = data; // Assign to .value for refs
      getStaffList();
      getMessages();
      setInterval(() => {
        getMessages();
      }, 1000 * 60);
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
    dialog-header="Add Team member"
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
    pageTitle="Teams"
    :msg="alertMes"
    :type="alertType"
  />

  <!-- Dashboard View -->
  <DashboardSkeleton
    :toggleDialogueBtn="toggleDialogue"
    :hBtnShow="list.length"
    hBtnMsg="Add Team Member"
    :user="user"
    pageTitle="Team Members"
    v-if="!isLoading"
  >
    <!-- enter your content below (slots) -->
    <!-- no list found -->
    <NullList
      v-show="!list.length"
      :nullImg="staffNull"
      :actionPermit="user.user_permission"
      null-text="Create a add a new team member, Management Team members and Communicate with your team effectively"
      null-btn-text="Add Team Member"
      :toggleDialogueBtn="toggleDialogue"
    />

    <!-- list available -->

    <div class="staffs-body" v-if="list.length">
      <div class="staffs-container">
        <div class="staff-card" v-for="staff in list">
          <div
            class="staff-initial"
            :style="{ backgroundColor: staff.staff_color }"
          >
            <div class="circle">
              <h3>{{ staff.staff_initial || "M" }}</h3>
            </div>
          </div>
          <div class="staff-details" :style="{ color: staff.staff_color }">
            <h3>{{ staff.staff_name || "Murtadoh" }}</h3>
            <h4>{{ staff.staff_role || "Manager" }}</h4>
          </div>
        </div>
      </div>
      <div class="staffs-chat">
        <div class="chat-head" v-on:click="isChatSection = !isChatSection">
          <img
            :style="`${
              isChatSection
                ? 'transform: rotate(-90deg);'
                : 'transform: rotate(0);'
            }`"
            src="../../assets/icons/arrow.svg"
            alt="arrow"
          />
          <p>Chat</p>
        </div>
        <div class="chat-body" v-show="isChatSection">
          <div class="chat-container">
            <div class="chats" v-for="cht in chats">
              <div
                class="initial"
                :style="`background-color : ${cht.sender_color}`"
              >
                {{ cht.sender_initial }}
              </div>
              <div class="message">
                <h6>{{ cht.sender_name }}</h6>
                <p>{{ cht.chat_message }}</p>
                <p v-if="cht.chat_type === 'file'">
                  An attached file found, to click 👉🏼
                  <button @click="downloadFile(cht.chat_id, cht.storage_name)">
                    Download File
                  </button>
                </p>
              </div>
            </div>
          </div>
          <div class="chat-footer">
            <div class="message-input">
              <div class="input">
                <input
                  type="text"
                  :value="chatInputMessage"
                  @change="handleInpuValue"
                  placeholder="Type you message"
                />
                <input
                  type="file"
                  name="upload"
                  id="upload"
                  :value="chatAttachMessage"
                  @change="handleFileChange"
                  accept=".jpg, .jpeg, .png, .pdf, .svg, .docx"
                  style="display: none"
                />
                <div class="btn-message" @click="handleSendMessage">
                  <img src="../../assets/icons/sendIcon.svg" alt="send" />
                </div>
              </div>
              <label for="upload" class="btn-message">
                <img src="../../assets/icons/attachIcon.svg" alt="send" />
              </label>
            </div>
            <span v-show="alert_mess.length > 0" class="delivering-status">{{
              alert_mess
            }}</span>
            <span v-show="progress > 0" class="delivering-status">{{
              "Uploading: " + progress
            }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- enter of content (slot) -->
  </DashboardSkeleton>
</template>

<style scoped>
p button {
  border: none;
  background-color: #ffc107;
  padding: 8px 12px;
  cursor: pointer;
  font-family: inherit;
}

.staff-details {
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

h3,
h4 {
  font-size: 20px;
}

.staff-card {
  width: 200px;
  background-color: #fff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease;
}

.staff-card:hover {
  transform: translateY(-5px);
}

.staff-initial {
  width: 100%;
  padding: 25px;
  display: grid;
  place-items: center;
}

.staff-initial .circle {
  width: 100px;
  height: 100px;
  display: grid;
  place-items: center;
  color: #fff;
  border-radius: 50%;
  background-color: #ffffff79;
}

.staffs-body {
  width: 100%;
  position: relative;
}

.staffs-container {
  width: 100%;
  display: flex;
  gap: 10px;
}

.staffs-chat {
  width: 300px;
  background-color: palegreen;
  width: 300px;
  position: fixed;
  bottom: 0;
  right: 40px;
  z-index: 200;
  border-radius: 10px 10px 0 0;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.062);
  overflow: hidden;
}

.chat-head {
  background-color: #ffc107;
  display: flex;
  align-items: center;
  gap: 30px;
  justify-content: start;
  padding: 10px 20px;
  cursor: pointer;
}

.chat-head p {
  font-weight: 600;
}

.chat-body {
  height: 75vh;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.chat-container {
  flex: 1;
  background-color: #0000000a;
  display: flex;
  overflow-y: auto;
  gap: 10px;
  flex-direction: column-reverse;
  height: 0;
  max-width: 100%;
  padding: 20px;

  /* WebKit scrollbar styling */
  &::-webkit-scrollbar {
    background: transparent;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb,
  &::-webkit-scrollbar-button {
    background-color: rgba(0, 0, 0, 0.39);
    border-radius: 30px;
    border: 2px solid transparent;
    background-clip: content-box;
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: #ffc1075d;
  }
}

.chats {
  display: flex;
  gap: 10px;
  width: 100%;
}

.message {
  padding: 10px 20px;
  border-radius: 0 10px 10px 10px;
  background-color: #fff;
  position: relative;
  max-width: 200px;
}

.message::before {
  width: 20px;
  height: 20px;
  border: 10px solid transparent;
  border-top: 10px solid #fff;
  position: absolute;
  top: 0;
  right: calc(100% - 10px);
  content: "";
}

.chat-footer {
  background-color: #d9d9d9;
  padding: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.message-input {
  width: 100%;
  display: flex;
  gap: 5px;
}

.input {
  flex: 1;
  position: relative;
}

.input input {
  background-color: #fff;
  height: 40px;
  border-radius: 10px;
  padding: 10px;
  width: 100%;
  border: none;
}

input:focus,
input:focus-visible,
input:focus-within {
  border: none;
}

.input .btn-message {
  position: absolute;
  background-color: #ffc107;
  top: 0;
  right: 0;
}

.btn-message {
  cursor: pointer;
  width: 40px;
  height: 40px;
  background-color: #fff;
  border-radius: 10px;
  padding: 10px;
  display: grid;
  place-items: center;
}

.btn-message img {
  width: 20px;
}

.initials {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: grid;
  color: #ffffff;
  place-items: center;
}

.initial {
  width: 30px;
  height: 30px;
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
