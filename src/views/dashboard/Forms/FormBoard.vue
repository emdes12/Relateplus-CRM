<script setup>
import { ref, onMounted, computed, onBeforeUnmount, reactive } from "vue";
import AlertMessage from "@/components/AlertMessage.vue";
import DashboardSkeleton from "@/components/DashboardSkeleton.vue";
import apiMode from "../../../../apiMode";
import { useRoute } from "vue-router";
import FormPreview from "@/components/Forms/FormPreview.vue";
import * as XLSX from "xlsx";
import ResponseTable from "@/components/Forms/ResponseTable.vue";

const api = apiMode;

// declaration of value below
const route = useRoute();
const storeForm = ref({});
const responses = ref([]);
const hostname = ref("");
const copyText = ref("Copy");
let user = ref(null); // Use ref for reactive data
let isLoading = ref(true); // Add loading state
let isMessage = ref(false);
let alertMes = ref("Successfully logged in");
let alertType = ref("success");
const formLink = ref("");
const formUrlId = route.params.id;
const isPreview = ref(false);
const prevBtn = ref("Show Form Preview");
const sanitizedResp = ref({});

const toggleFormPreveiw = () => {
  isPreview.value = !isPreview.value;
  if (isPreview) {
    prevBtn.value = "Show Response Table";
  } else {
    prevBtn.value = "Show Form Preview";
  }
};

const toggleDialogue = () => {
  const link = document.createElement("a");
  link.href = "/dashboard/forms/add-form";
  link.click();
};

const getForm = async () => {
  const id = route.params.id;
  const token = localStorage.getItem("token");
  try {
    console.log(token);

    const data = await api.get("/forms/" + id);
    console.log("data", data.data);
    storeForm.value = data.data;

    console.log("storeForm", storeForm.value);
  } catch (error) {
    console.error(error.response);
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

const getResponses = async () => {
  const id = formUrlId;
  const token = localStorage.getItem("token");
  try {
    console.log(token);

    const data = await api.get("/forms/" + id + "/responses", {
      headers: { token: `${token}` },
    });
    const data_resp = data.data;

    responses.value = data_resp.map((resp) => resp.response);
    console.log("responses list", responses.value);
  } catch (error) {
    console.error(error.response);
  }
};

const exportToJSON = (title) => {
  const dataStr = JSON.stringify(responses.value, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `${title}.json`;
  link.click();

  URL.revokeObjectURL(url);
};

const exportToCSV = (title) => {
  if (!responses.value.length) return;

  const sanitizedData = responses.value.map((entry) => {
    const sanitized = {};
    for (const key in entry) {
      const value = entry[key];
      sanitized[key] = Array.isArray(value) ? value.join(", ") : value;
    }
    return sanitized;
  });

  const headers = Object.keys(sanitizedData[0]).join(",");
  const rows = sanitizedData.map((res) =>
    Object.values(res)
      .map((val) => `"${String(val).replace(/"/g, '""')}"`)
      .join(",")
  );

  const csvContent = [headers, ...rows].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `${title}.csv`;
  link.click();

  URL.revokeObjectURL(url);
};

const exportToExcel = (title) => {
  const sanitizedData = responses.value.map((entry) => {
    const sanitized = {};
    for (const key in entry) {
      const value = entry[key];
      sanitized[key] = Array.isArray(value) ? value.join(", ") : value;
    }
    return sanitized;
  });

  const worksheet = XLSX.utils.json_to_sheet(sanitizedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Responses");

  XLSX.writeFile(workbook, `${title}.xlsx`);
};

const copyUrl = () => {
  navigator.clipboard.writeText(formLink.value);
  copyText.value = "copied";

  setInterval(() => {
    copyText.value = "copy";
  }, 2000);
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
    getForm();
    getResponses();
    hostname.value = window.location.host;
    formLink.value = hostname.value + "/forms/" + formUrlId;
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

  <AlertMessage
    v-show="isMessage"
    pageTitle="Customers"
    :msg="alertMes"
    :type="alertType"
  />

  <!-- Dashboard View -->
  <DashboardSkeleton
    :toggleDialogueBtn="toggleDialogue"
    :hBtnShow="1"
    hBtnMsg="Create Form"
    :user="user"
    pageTitle="Forms"
    v-if="!isLoading"
  >
    <!-- enter your content below (slots) -->

    <!-- list available -->
    <div>
      <div class="header">
        <div class="copy">
          <p>
            {{ formLink }}
          </p>

          <button @click="copyUrl">
            {{ copyText }}
          </button>
        </div>

        <button @click="toggleFormPreveiw">{{ prevBtn }}</button>

        <div class="export-buttons">
          <button @click="exportToJSON(storeForm.form.title)">
            Export JSON
          </button>
          <button @click="exportToCSV(storeForm.form.title)">Export CSV</button>
          <button @click="exportToExcel(storeForm.form.title)">
            Export Excel
          </button>
        </div>
      </div>
    </div>

    <div v-if="!isPreview && responses.length" class="response-container">
      <h3 style="width: 100%; text-align: center">
        {{ storeForm.form.title }}
      </h3>

      <ResponseTable :responses :form="storeForm.form" />
    </div>

    <div v-if="isPreview" class="former">
      <FormPreview :form="{ ...storeForm.form, fields: storeForm.fields }" />
    </div>

    <div v-if="!responses.length && !isPreview" class="response-container">
      <h3 style="width: 100%; text-align: center; color: red;">No response yet</h3>
    </div>

    <!-- enter of content (slot) -->
  </DashboardSkeleton>
</template>

<style scoped>
.response-container {
  width: 100%;
  padding: 20px;
}

.copy {
  padding: 10px;
  border: 2px solid slateblue;
  display: flex;
  gap: 10px;
  font-size: large;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
}

strong {
  font-weight: 600;
}

.header {
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
  background-color: rgb(245, 247, 245);
  padding: 15px 20px;
}

.export-buttons {
  display: flex;
  gap: 10px;
}

button {
  border: none;
  cursor: pointer;
  background-color: slateblue;
  color: #fff;
  padding: 10px 12px;
  border-radius: 5px;
}

button:nth-child(2) {
  background-color: darkcyan;
}

button:nth-child(3) {
  background-color: green;
}

.former {
  max-width: 800px;
  margin: 0 auto;
}

.copy p {
  width: 300px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.copy button {
  background-color: slateblue;
}
</style>
