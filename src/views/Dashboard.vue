<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import AlertMessage from "../components/AlertMessage.vue";

const api = axios.create({
  baseURL: 'http://localhost:4123',
  headers: {
    token: `${localStorage.getItem('token')}`
  }
});

let user = ref(null); // Use ref for reactive data
let isLoading = ref(true); // Add loading state
let isMessage = ref(false)
let alertMes = ref("Successfully logged in");
let alertType = ref('success');



const showAlert = (string1, string2) => {
  alertMes.value = string1;
  alertType.value = string2;
  isMessage.value = true;
  console.log(alertMes.value);
  console.log(isMessage.value);
  setInterval(() => {
    isMessage.value = false;
  }, 3000);
}

onMounted(async () => {
  try {
      console.log(1)
      // Verify token and get user data in one request
      const res = await api.get('/dashboard');
      console.log(2)
      user.value = res.data; // Assign to .value for refs
      console.log(user.value)
      showAlert(`${res.data.user_name} Welcome`, "success");
  } catch (err) {
    
    // Redirect to login if unauthorized
    showAlert(err.response.data, "error")
    localStorage.removeItem('token'); // Clear invalid token
    window.location.href = '/login';
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
    <AlertMessage v-show="isMessage" :msg="alertMes" :type="alertType"/>
  <div v-if="isLoading">Loading dashboard...</div>
  
  <div v-else>
    <h1>Hey {{ user.user_name || "Murtiala" }}!</h1>
    <h1>Welcome to Dashboard</h1>
    
    <!-- Display more user data if available -->
    <div v-if="user" class="user-info">
      <p>Email: {{ user.user_email || "test@gmail.com" }}</p>
      <!-- Add other user fields as needed -->
    </div>
  </div>
</template>

<style scoped>
.error {
  color: red;
  font-weight: bold;
}

.user-info {
  margin-top: 20px;
  padding: 15px;
  background: #f5f5f5;
  border-radius: 8px;
  font-size: 80px;
}
</style>