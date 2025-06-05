<script setup>
import cameraIcon from "@/assets/icons/camera.svg";
import BtnDbPry from "../BtnDbPry.vue";
import BtnDbSec from "../BtnDbSec.vue";
import { ref } from "vue";
import apiMode from "../../../apiMode";

defineProps({
  toggleDialogue: Function,
});

const api = apiMode;
const teamMembers = ref([]);
const formList = ref([]);
const fileuploadMessage = ref("");
const eventForm = ref({
  event_title: "",
  event_type: "",
  event_description: "",
  event_type: "",
  event_venue: "",
  assigned_to: [],
  event_file: "",
  event_rsvp_form: "",
  event_date: "",
});


const createEvent = () => {
  console.log(eventForm.value);
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

const getForms = async () => {
  const token = localStorage.getItem("token");
  try {
    const teams = await api.get("/forms", { headers: { token } });
    formList.value = teams.data;
    console.log("form from addEvent", formList.value);
  } catch (error) {
    console.error(error?.response?.data);
  }
};

const checkFileUpload = (e) => {
  const file = e.target.files[0];
  eventForm.value.event_file = {};
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

  eventForm.value.event_file = file;
  console.table(eventForm.value.event_file);
  console.log(fileuploadMessage.value);
};

getTeams();
getForms();
</script>

<template>
  <h3>Create an Event</h3>

  <div class="form-inputs-container">
    <!-- Side 1 of Form  -->
    <div>
      <div class="label-input">
        <label for="event-title">Event Title</label>
        <input
          type="text"
          name="event-title"
          v-model="eventForm.event_title"
          placeholder="Event Title"
          id="event-title"
        />
      </div>

      <div class="label-input">
        <label for="event-type">Event Type</label>
        <select
          v-model="eventForm.event_type"
          name="event-type"
          id="event-type"
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
        <label for="event-description">Event Description</label>
        <textarea
          name="event-description"
          id="event-description"
          v-model="eventForm.event_description"
          placeholder="Description"
        ></textarea>
      </div>

      <div class="label-input">
        <label>Team Member involved</label>
        <div class="mutli-select" v-for="member in teamMembers">
          <input
            type="checkbox"
            v-model="eventForm.assigned_to"
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
            v-if="!eventForm.event_file.name"
            :src="cameraIcon"
            alt="camera device icon"
          />
          <p v-if="!eventForm.event_file.name">Attach a File</p>
          <p
            style="color: red"
            v-if="fileuploadMessage && !eventForm.event_file.name"
          >
            {{ fileuploadMessage }}
          </p>
          <p
            style="color: green; font-size: 1.2rem; font-family: inherit"
            v-if="eventForm.event_file.name"
          >
            {{ eventForm.event_file.name }}
          </p>
          <p v-if="eventForm.event_file.name">Attached</p>
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
        <label for="event-date">Event Date</label>
        <input
          type="date"
          v-model="eventForm.event_date"
          name="event-date"
          id="event-date"
        />
      </div>

      <div class="label-input">
        <label for="task-priority">Event RSVP Form</label>
        <span>
          <select
            v-model="eventForm.event_rsvp_form"
            name="task-priority"
            id="task-priroty"
          >
            <option value="" selected disabled>Select a form to link</option>
            <option v-if="formList" v-for="form in formList" :value="form.form_id">
              {{ form.title }}
            </option>
            <option v-if="!formList" disabled>Create a form and come back</option>
          </select>
          <BtnDbPry bgcolor="#2c3e50" link="/dashboard/forms/add-form" msg="Create Form" />
        </span>
      </div>

      <div class="label-input">
        <label for="event-venue">Event Venue/Meeting Link</label>
        <input
          type="text"
          v-model="eventForm.event_venue"
          name="event-venue"
          id="event-venue"
        />
      </div>
    </div>
  </div>

  <!-- action buttons -->
  <div class="actions-btn">
    <BtnDbSec :onClickToCancel="toggleDialogue" msg="Cancel" />
    <BtnDbPry :onClickToAct="createEvent" msg="Create Event" />
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
  color: #8d8d8d;
  text-align: left;
  border-radius: 10px;
  font-family: "League Spartan";
  font-size: 17px;
  flex:1;
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