<script setup>
import cameraIcon from "@/assets/icons/camera.svg";
import BtnDbPry from "../BtnDbPry.vue";
import BtnDbSec from "../BtnDbSec.vue";
import AlertMessage from "../AlertMessage.vue";
import { ref } from "vue";
import apiMode from "../../../apiMode";

defineProps({
  toggleDialogue: Function,
});

const api = apiMode;
const teamMembers = ref([]);
const clientList = ref([]);
const fileuploadMessage = ref("");
let appointmentForm = ref({
  appointment_title: "",
  appointment_type: "",
  appointment_description: "",
  appointment_type: "",
  appointment_venue: "",
  assigned_to: [],
  appointment_file: "",
  appointment_client: "",
  appointment_start_date: "",
  appointment_end_date: "",
});

const isMessage = ref(false);
const alertMes = ref("");
const alertType = ref("");

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

const createAppointment = async () => {
  const today = new Date();
  const startDay = new Date(appointmentForm.value.appointment_start_date);
  const endDay = new Date(appointmentForm.value.appointment_end_date);
  if (!appointmentForm.value.appointment_title) {
    return showAlert("Title is required", "error");
  }
  if (!appointmentForm.value.assigned_to.length) {
    return showAlert("You don't assign to any team member", "error");
  }
  if (!startDay || !endDay) {
    return showAlert("Dates can't be empty", "error");
  }
  if (today > startDay) {
    return showAlert("Starting date cant be in the past", "error");
  }
  if (startDay > endDay) {
    return showAlert("Ending date cant be in the past", "error");
  }

  try {
    const token = localStorage.getItem("token");

    let fileAttached = appointmentForm.value.appointment_file;

    let fileDetails;
    let newField = { ...appointmentForm.value };
    console.log({ fileAttached, newField });
    if (fileAttached.name) {
      const formData = new FormData();
      formData.append("file", fileAttached);
      const upload = await api.post("calendar/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          token: `${token}`,
        },
      });
      fileDetails = upload.data;
      console.log(upload);
      newField = {
        ...newField,
        ...fileDetails,
      };
    }
    await api.post("/calendar/appointment", newField, {
      headers: { token },
    });

    showAlert("New Appointment Created", "success");
    appointmentForm = ref({
      appointment_title: "",
      appointment_type: "",
      appointment_description: "",
      appointment_type: "",
      appointment_venue: "",
      assigned_to: [],
      appointment_file: "",
      appointment_client: "",
      appointment_start_date: "",
      appointment_end_date: "",
    });
    window.location.href = "/dashboard/calendar";
  } catch (error) {
    console.log(error);
    showAlert(`${error?.response?.data}`, "error");
  }
};

const getTeams = async () => {
  const token = localStorage.getItem("token");
  try {
    const teams = await api.get("/dashboard/staffs", { headers: { token } });
    teamMembers.value = teams.data;
    console.log("teams from addEvent", teamMembers.value);
  } catch (error) {
    console.error(error?.response?.data);
  }
};

const getClient = async () => {
  const token = localStorage.getItem("token");
  try {
    const teams = await api.get("/dashboard/customers", { headers: { token } });
    clientList.value = teams.data;
    console.log("form from addEvent", clientList.value);
  } catch (error) {
    console.error(error?.response?.data);
  }
};

const checkFileUpload = (e) => {
  const file = e.target.files[0];
  appointmentForm.value.appointment_file = "";
  if (!file) return;

  // Validate file type
  const validTypes = [
    "image/jpeg",
    "image/png",
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  if (!validTypes.includes(file.type)) {
    fileuploadMessage.value =
      "Invalid file type. Only JPG, PNG, PDF, and DOCX are allowed.";

    return;
  }

  // Validate file size (5MB max)
  if (file.size > 5 * 1024 * 1024) {
    fileuploadMessage.value = "File size must be less than 5MB";
    return;
  }

  appointmentForm.value.appointment_file = file;
};

const createZoomMeeting = () => {
  alert("please create one manually from Zoom");
};

const createGoogleMeet = () => {
  alert("please create one manually from Google Calendar");
};

getTeams();
getClient();
</script>

<template>
  <AlertMessage
    v-show="isMessage"
    pageTitle="Customers"
    :msg="alertMes"
    :type="alertType"
  />

  <h3>Create an Appointment</h3>

  <div class="form-inputs-container">
    <!-- Side 1 of Form  -->
    <div>
      <div class="label-input">
        <label for="appointment-title">Appointment Title</label>
        <input
          type="text"
          name="appointment-title"
          v-model="appointmentForm.appointment_title"
          placeholder="Appointment Title"
          id="appointment-title"
        />
      </div>

      <div class="label-input">
        <label for="appointment-type">Appointment Type</label>
        <select
          v-model="appointmentForm.appointment_type"
          name="appointment-type"
          id="appointment-type"
        >
          <option value="" disabled selected>Select a type</option>
          <option value="meeting">Meeting</option>
          <option value="call">Call</option>
          <option value="follow-up">Follow-up</option>
          <option value="demo">Demo</option>
          <option value="webinar">Webinar</option>
          <option value="others">Others</option>
        </select>
      </div>

      <div class="label-input">
        <label for="appointment-description">Appointment Description</label>
        <textarea
          name="appointment-description"
          id="appointment-description"
          v-model="appointmentForm.appointment_description"
          placeholder="Description"
        ></textarea>
      </div>

      <div class="label-input">
        <label for="appointment-client">Client/Contact</label>
        <select
          v-model="appointmentForm.appointment_client"
          name="appointment-client"
          id="appointment-client"
        >
          <option value="" selected disabled>Appointment with who?</option>
          <option
            v-if="clientList"
            v-for="client in clientList"
            :value="client.client_id"
          >
            {{ client.client_name }}
          </option>
          <option v-if="!clientList" disabled>
            No Client on your contact list
          </option>
        </select>
      </div>

      <div class="label-input">
        <label>Team Members involved</label>
        <div class="mutli-select" v-for="member in teamMembers">
          <input
            type="checkbox"
            v-model="appointmentForm.assigned_to"
            :value="member.staff_id"
            :name="member.staff_id"
            :id="member.staff_id"
          />
          <label :for="member.staff_id">{{ member.staff_name }}</label>
        </div>
      </div>
    </div>

    <!-- side 2 -->
    <div>
      <div class="label-input">
        <label for="task-attachment">
          <img
            v-if="!appointmentForm.appointment_file.name"
            :src="cameraIcon"
            alt="camera device icon"
          />
          <p v-if="!appointmentForm.appointment_file.name">Attach a File</p>
          <p
            style="color: red"
            v-if="fileuploadMessage && !appointmentForm.appointment_file.name"
          >
            {{ fileuploadMessage }}
          </p>
          <p
            style="color: green; font-size: 1.2rem; font-family: inherit"
            v-if="appointmentForm.appointment_file.name"
          >
            {{ appointmentForm.appointment_file.name }}
          </p>
          <p v-if="appointmentForm.appointment_file.name">Attached</p>
        </label>
        <input
          style="display: none"
          type="file"
          @change="checkFileUpload"
          accept=".jpg, .jpeg, .png, .pdf, .docx"
          name="task-attachment"
          id="task-attachment"
        />
      </div>

      <div class="label-input">
        <label for="appointment-sdate">Appointment Start Date</label>
        <input
          type="datetime-local"
          v-model="appointmentForm.appointment_start_date"
          name="appointment-sdate"
          id="appointment-sdate"
        />
      </div>

      <div class="label-input">
        <label for="appointment-edate">Appointment End Date</label>
        <input
          type="datetime-local"
          v-model="appointmentForm.appointment_end_date"
          name="appointment-edate"
          id="appointment-edate"
        />
      </div>

      <div class="label-input">
        <label for="appointment-venue">Event Venue/Meeting Link</label>
        <span>
          <input
            type="text"
            v-model="appointmentForm.appointment_venue"
            name="appointment-venue"
            id="appointment-venue"
          />
          <!-- <p>Create a meeting on Zoom or Google meet then add the link if you are using </p>
          <BtnDbPry
            bgcolor="#0b5cff"
            :onClickToAct="createZoomMeeting"
            msg="Use Zoom Meeting"
          />
          <BtnDbPry
            bgcolor="#2a9b00"
            :onClickToAct="createGoogleMeet"
            msg="Use Google Calendar Link"
          /> -->
        </span>
      </div>
    </div>
  </div>

  <!-- action buttons -->
  <div class="actions-btn">
    <BtnDbSec :onClickToCancel="toggleDialogue" msg="Cancel" />
    <BtnDbPry :onClickToAct="createAppointment" msg="Create Appointment" />
  </div>
</template>

<style scoped>
h3 {
  width: 100%;
  text-align: center;
  padding: 20px 0;
}

.form-inputs-container {
  display: flex;
  flex-wrap: wrap;
  align-items: start;
  gap: 20px;
  width: 100%;
  height: calc(100% - 150px);
  position: relative;
  overflow: auto;
  padding-bottom: 30px;
}

.form-inputs-container > div {
  flex: 1;
  min-width: 300px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.label-input {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.label-input span {
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 5px;
}

.label-input > label {
  font-size: 16px;
}

.label-input > input,
.label-input span > input,
.label-input > select,
.label-input span > select,
.label-input > textarea {
  border: 1px solid #8d8d8d;
  width: 100%;
  padding: 11px 26px;
  color: #000000;
  text-align: left;
  border-radius: 10px;
  font-family: "League Spartan";
  font-size: 17px;
  flex: 1;
  font-style: normal;
  font-weight: 200;
  line-height: normal;
}

label[for="task-attachment"] {
  border-radius: 10px;
  border: 1px solid #8d8d8d;
  width: 100%;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 5px;
  cursor: pointer;
}

textarea {
  height: 150px;
}

.mutli-select {
  display: flex;
  gap: 9px;
}

.actions-btn {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  gap: 20px;
  width: 100%;
  height: 100px;
  padding: 20px;
  border-top: 1px solid #c1c1c1;
  align-items: center;
  justify-content: center;
}
</style>
