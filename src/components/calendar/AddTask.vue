<script setup>
import cameraIcon from "@/assets/icons/camera.svg";
import BtnDbPry from "../BtnDbPry.vue";
import BtnDbSec from "../BtnDbSec.vue";
import { onMounted, ref } from "vue";
import AlertMessage from "../AlertMessage.vue";
import apiMode from "../../../apiMode";

defineProps({
  toggleDialogue: Function,
});

const api = apiMode;

const clientsList = ref([]);
const teamMembers = ref([]);
const fileuploadMessage = ref("");
let taskForm = ref({
  task_title: "",
  task_description: "",
  task_expires: "",
  task_client: "",
  assigned_to: [],
  task_file: {},
  task_priority: "",
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

const getClients = async () => {
  const token = localStorage.getItem("token");
  try {
    const teams = await api.get("/dashboard/customers", { headers: { token } });
    clientsList.value = teams.data;
    console.log("clients from addTask", clientsList.value);
  } catch (error) {
    console.error(error?.response?.data);
  }
};

const getTeams = async () => {
  const token = localStorage.getItem("token");
  try {
    const teams = await api.get("/dashboard/staffs", { headers: { token } });
    teamMembers.value = teams.data;
    console.log("teams from addTask", teamMembers.value);
  } catch (error) {
    console.error(error?.response?.data);
  }
};

const createTask = async () => {
  const today = new Date()
  const selectedDay = new Date(taskForm.value.task_expires)
  if(!taskForm.value.task_title){
    return showAlert("Title is required", "error");
  }
  if(!taskForm.value.assigned_to.length){
    return showAlert("You don't assign to any team member", "error");
  }
  if(!selectedDay){
    return showAlert("Due Date can't be empty", "error");
  }
  if(today > selectedDay){
    return showAlert("Due date cant be in the past", "error");
  }
  try {
    const token = localStorage.getItem("token");

    let fileAttached = taskForm.value.task_file;

    let fileDetails;
    let newField = { ...taskForm.value };
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

    console.log("error1", newField);
    console.log(taskForm);
    await api.post("/calendar/task", newField, {
      headers: { token },
    });

    showAlert("New Task Assigned", "success");
    window.location.href = "/dashboard/calendar";
    taskForm = ref({
      task_title: "",
      task_description: "",
      task_expires: "",
      task_client: "",
      assigned_to: [],
      task_file: {},
      task_priority: "",
    });
  } catch (error) {
    console.log(error);
    showAlert(`${error?.response?.data}`, "error");
  }
};

getClients();
getTeams();

const checkFileUpload = (e) => {
  const file = e.target.files[0];
  taskForm.value.task_file = {};
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
    fileInput.value = ""; // Reset input
    return;
  }

  // Validate file size (5MB max)
  if (file.size > 5 * 1024 * 1024) {
    fileuploadMessage.value = "File size must be less than 5MB";
    fileInput.value = ""; // Reset input
    return;
  }

  taskForm.value.task_file = file;
};
</script>

<template>
  <AlertMessage
    v-show="isMessage"
    pageTitle="Customers"
    :msg="alertMes"
    :type="alertType"
  />
  <h3>Create and Assign Task</h3>

  <div class="form-inputs-container">
    <!-- Side 1 of Form  -->
    <div>
      <div class="label-input">
        <label for="task-title">Task Title</label>
        <input
          type="text"
          name="task-title"
          v-model="taskForm.task_title"
          placeholder="Task Title"
          id="task-title"
        />
      </div>

      <div class="label-input">
        <label for="task-client">Task Client</label>
        <select
          v-model="taskForm.task_client"
          name="task-client"
          id="task-client"
        >
          <option value="" disabled selected>Select Job Owner</option>
          <option v-for="client in clientsList" :value="client.client_id">
            {{ client.client_name }}
          </option>
        </select>
      </div>

      <div class="label-input">
        <label for="task-description">Task Description</label>
        <textarea
          name="task-description"
          id="task-description"
          v-model="taskForm.task_description"
          placeholder="Description"
        ></textarea>
      </div>

      <div class="label-input">
        <label>Assign</label>
        <div class="mutli-select" v-for="member in teamMembers">
          <input
            type="checkbox"
            v-model="taskForm.assigned_to"
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
            v-if="!taskForm.task_file.name"
            :src="cameraIcon"
            alt="camera device icon"
          />
          <p v-if="!taskForm.task_file.name">Attach a File</p>
          <p
            style="color: red"
            v-if="fileuploadMessage && !taskForm.task_file.name"
          >
            {{ fileuploadMessage }}
          </p>
          <p
            style="color: green; font-size: 1.2rem; font-family: inherit"
            v-if="taskForm.task_file.name"
          >
            {{ taskForm.task_file.name }}
          </p>
          <p v-if="taskForm.task_file.name">Attached</p>
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
        <label for="task-due-date">Task Due Date</label>
        <input
          type="date"
          v-model="taskForm.task_expires"
          name="task-due-date"
          id="task-due-date"
        />
      </div>

      <div class="label-input">
        <label for="task-priority">Task Priority Level</label>
        <select
          v-model="taskForm.task_priority"
          name="task-priority"
          id="task-priroty"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
      </div>
    </div>
  </div>

  <!-- action buttons -->
  <div class="actions-btn">
    <BtnDbSec :onClickToCancel="toggleDialogue" msg="Cancel" />
    <BtnDbPry :onClickToAct="createTask" msg="Add Task" />
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
}

.form-inputs-container > div {
  flex: 1;
  min-width: 300px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.label-input > label {
  font-size: 16px;
}

.label-input > input,
.label-input > select,
.label-input > textarea {
  border: 1px solid #8d8d8d;
  width: 100%;
  padding: 11px 26px;
  color: #000;
  text-align: left;
  border-radius: 10px;
  font-family: "League Spartan";
  font-size: 17px;
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
