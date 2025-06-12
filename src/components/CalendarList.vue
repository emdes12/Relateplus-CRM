<script setup>
import SearchIcon from "@/assets/icons/SearchIcon.svg";
import apiMode from "../../apiMode";
import { ref, watchEffect } from "vue";

const props = defineProps({
  list: Array,
});

const resolvedList = ref([]);
const options = ref(false);

const api = apiMode;
const getSingleClient = async (id) => {
  let clientName;
  try {
    const client = await api.get(`/dashboard/customers/${id}`);
    clientName = client.data.client_name;
    console.log(clientName);
  } catch (err) {
    console.log(err);
  }
  return clientName;
};

const switchOptions = () => {
  options.value = !options.value;
};

const getTeam = async (ids) => {
  const token = localStorage.getItem("token");
  const names = await Promise.all(
    ids.map(async (id) => {
      try {
        const res = await api.get(`/dashboard/staffs/${id}`, {
          headers: { token },
        });
        return res.data.staff_name;
      } catch (err) {
        console.log(err);
        return "_";
      }
    })
  );
  return names.join(", ");
};

const dateD = (day) => {
  const showedD = new Date(day);
  const month = "0" + (showedD.getMonth() + 1);
  const dispDate =
    showedD.getDate() + "-" + month + "-" + showedD.getFullYear();
  return dispDate;
};

const downloadFile = async (url) => {
  const token = localStorage.getItem("token");
  const response = await fetch(url, { headers: { token: token } });
  const blob = await response.blob();
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "filename.ext"; // Set default name
  link.click();
};

const editCard =(id)=>{
    alert(id)
}

watchEffect(async () => {
  if (!props.list || props.list.length === 0) return;

  const temp = await Promise.all(
    props.list.map(async (item) => {
      const clientName = item._client
        ? await getSingleClient(item._client)
        : "_";
      const teamNames = item.assigned_to
        ? await getTeam(item.assigned_to)
        : "_";

      return {
        ...item,
        clientName,
        teamNames,
      };
    })
  );

  resolvedList.value = temp;
});
</script>
<template>
  <!-- <h1>Calendars</h1> -->
  <div class="calendar-container">
    <div class="calendar-header">
      <div class="calendar-filter">
        <span>All</span>
        <span>Appointments</span>
        <span>Tasks</span>
        <span>Events</span>
      </div>
      <div class="search">
        <img :src="SearchIcon" alt="icon" />
        <input type="search" name="search" id="search" />
      </div>
    </div>
    <div class="table-container">
      <div class="grid-header">
        <div>Title</div>
        <div>Type</div>
        <div>Client</div>
        <div>Venue</div>
        <div>Start Date</div>
        <div>Team Members</div>
        <div>File</div>
        <div>Status</div>
      </div>
      <div class="value-container">
        <div class="grid-body" v-for="cal in resolvedList">
          <div>{{ cal._title }}</div>
          <div>
            <span :class="cal._type">{{ cal.calendar_type }}</span>
          </div>
          <div>{{ cal._client ? cal.clientName : "_" }}</div>
          <div>{{ cal._venue ? cal._venue : "_" }}</div>
          <div>
            {{
              cal._start_date
                ? dateD(cal._start_date)
                : dateD(cal.task_due_date) || "_"
            }}
          </div>
          <div>{{ cal.teamNames }}</div>
          <!-- <div>{{ cal.has_file ? `<a href="${cal.file_path}" download>Download</a>` : "_" }}</div> -->
          <!-- <div>{{ cal.has_file ? `Download` : "_" }}</div> -->
          <!-- <div v-html="cal.has_file ? `<a href='${cal.file_path}' download>Download</a>` : '_'"></div> -->
          <div>
            <a v-if="cal.has_file" @click="downloadFile(cal.file_path)" download
              >Download</a
            >
            <span v-else>_</span>
          </div>
          <div>
            <span :class="cal._status">{{ cal._status }}</span>
          </div>
          <div class="action-option-btn " @click="switchOptions">
            ...
            <div v-show="options" class="action-options">
              <span @click="editCard(cal._title)">Edit</span>
              <span v-if="cal._status === 'created'">In-Progress</span>
              <span v-if="cal._status === 'in-progress'">Completed</span>
              <span>Delete</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- <code>{{ resolvedList }}</code> -->
</template>
<style scoped>
.calendar-container {
  width: 100%;
}

.calendar-header {
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;
}

.calendar-filter {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
}

.calendar-filter span {
  padding: 8px 12px;
  border: 1px solid #b4b4b4;
  border-radius: 10px;
}

.search {
  border: 1px solid #b4b4b4;
  border-radius: 10px;
  display: flex;
  align-items: center;
  padding: 0 0 0 5px;
  justify-content: center;
  gap: 3px;
  overflow: hidden;
}

.search input {
  border: 0px;
  padding: 8px 5px 8px 0;
  width: 250px;
}

.search input:focus,
.search input:focus-visible {
  border: none;
}

.table-container {
  width: 100%;
  overflow: auto;
  height: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  border: 1px solid #d4d4d4;
  margin-top: 20px;
}

.value-container {
  flex: 1;
  width: 100%;
  overflow-x: hidden;
  overflow-y: scroll;
  max-height: 75vh;
}

.grid-header,
.grid-body {
  display: flex;
  width: fit-content;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  position: relative;
}

.grid-header div,
.grid-body div {
  flex: 1;
  color: #000;
  padding: 10px 12px;
}

.grid-header div:nth-child(1),
.grid-body div:nth-child(1) {
  flex: 2;
}

.grid-body div span {
  padding: 8px 12px;
  color: #fff;
  border-radius: 12px;
  text-transform: capitalize;
}

.demo {
  background-color: rgb(0, 134, 11);
}

.others {
  background-color: rgb(134, 0, 78);
}

.meeting {
  background-color: rgb(134, 98, 0);
}

.follow-up {
  background-color: #ff3d3d;
}

.call {
  background-color: #4606ad;
}

.webinar {
  background-color: #006786;
}

.grid-header,
.grid-body:not(:last-child) {
  border-bottom: 1px solid #d4d4d4;
}

.created {
  background-color: #81ee0431;
  color: #3bca29 !important;
}

.expired {
  background-color: #ff0000;
  color: #fff;
}

.grid-body:hover .action-option-btn {
  display: inline;
}

.action-option-btn:hover {
  color: rgb(10, 10, 250);
  font-weight: 900;
}

.action-option-btn {
  position: absolute;
  right: 0;
  top: -50;
  padding: 20px;
  cursor: pointer;
  display: none;
  color: #00000049;
}

.action-options {
  position: absolute;
  top: 100%;
  right: 0;
  display: flex;
  flex-direction: column;
  z-index: 300000;
  background-color: #fff;
}

.action-options span {
  width: 100px;
  padding: 10px;
  color: #00000054 !important;
}

.action-options span:hover {
    color: #000 !important;
}
</style>
