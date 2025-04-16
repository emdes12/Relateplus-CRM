<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4123',
  headers: {
    token: `${localStorage.getItem('token')}`
  }
});

let user = ref(null); // Use ref for reactive data
let isLoading = ref(true); // Add loading state
let error = ref(null); // Add error state

onMounted(async () => {
  try {
      console.log(1)
      // Verify token and get user data in one request
      const res = await api.get('/dashboard');
      console.log(2)
      user.value = res.data; // Assign to .value for refs
      console.log(user.value)
  } catch (err) {
    error.value = err.response?.data?.message || err.message;
    
    // Redirect to login if unauthorized
      localStorage.removeItem('token'); // Clear invalid token
    window.location.href = '/login';
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div v-if="isLoading">Loading dashboard...</div>
  
  <div v-else-if="error" class="error">
    Error loading dashboard: {{ error }}
  </div>
  
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