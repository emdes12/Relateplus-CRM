<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { RouterLink, RouterView } from "vue-router";
import BtnDbPry from "./BtnDbPry.vue";
import CustomersIcon from "../assets/icons/CustomersIcon.svg";
import ServicesIcon from "../assets/icons/ServicesIcon.svg";
import FormsIcon from "../assets/icons/FormsIcon.svg";
import CalendarIcon from "../assets/icons/CalendarIcon.svg";
import StaffsIcon from "../assets/icons/StaffsIcon.svg";
import SearchIcon from "../assets/icons/SearchIcon.svg";
import NotificationIcon from "../assets/icons/NotificationIcon.svg";
defineProps({
  pageTitle: {
    type: String,
    required: true,
    default: "Dashboard",
  },
  user: {
    type: Object,
    required: false,
  },
  hBtnShow: {
    type: Number,
    required: true,
  },
  hBtnMsg: {
    type: String,
    required: true,
  },
  toggleDialogueBtn: {
    type: Function,
  },
});

let isProfileOption = ref(false)

const getGreeting = () => {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) {
    return "Good morning! 🌄";
  } else if (hour >= 12 && hour < 17) {
    return "Good afternoon! 🌞";
  } else if (hour >= 17 && hour < 21) {
    return "Good evening! 🌆";
  } else {
    return "Good night! 🛌🏼";
  }
};

const logOutHandler = () => {
  localStorage.removeItem("duserdata");
  localStorage.removeItem("token");
  window.location.href = "/login";
};

const isSidebarCollapsed = ref(false);
const windowWidth = ref(window.innerWidth);

const navItems = [
  {
    permission: "admin",
    path: "/dashboard",
    name: "Customer",
    icon: CustomersIcon,
  },
  {
    permission: "admin",
    path: "/dashboard/services",
    name: "Services",
    icon: ServicesIcon,
  },
  {
    permission: "admin staff",
    path: "/dashboard/calendar",
    name: "Task/Calendar",
    icon: CalendarIcon,
  },
  {
    permission: "admin",
    path: "/dashboard/forms",
    name: "Forms",
    icon: FormsIcon,
  },
  {
    permission: "admin staff",
    path: "/dashboard/teams",
    name: "Team members",
    icon: StaffsIcon,
  },
];

const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value;
};

const checkScreenSize = () => {
  windowWidth.value = window.innerWidth;
  if (windowWidth.value <= 768) {
    isSidebarCollapsed.value = true;
  } else {
    isSidebarCollapsed.value = false;
  }
};

const logout = () => {
  // Implement logout logic
  localStorage.removeItem("token");
  router.push("/login");
};

onMounted(() => {
  window.addEventListener("resize", checkScreenSize);
  checkScreenSize();
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", checkScreenSize);
});
</script>

<template>
  <div>
    <div class="dashboard-container">
      <!-- Header -->
      <header class="header">
        <div class="header-left">
          <button class="menu-toggle" @click="toggleSidebar">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
            </svg>
          </button>
          <div class="logo">
            <img src="@/assets/logo.svg" alt="Company Logo" />
          </div>
          <h3>{{ pageTitle }}</h3>
        </div>

        <div class="header-right">
          <!-- add the notification/search icon and btn later -->
          <span>{{ getGreeting() }}</span>
          <BtnDbPry
            :onClickToAct="toggleDialogueBtn"
            v-show="hBtnShow && user.user_permission !== 'staff'"
            :msg="hBtnMsg"
            wdt="max-content"
          />
          <img :src="SearchIcon" alt="search" />
          <img :src="NotificationIcon" alt="notification" />
        </div>
      </header>

      <!-- Sidebar -->
      <aside class="sidebar" :class="{ collapsed: isSidebarCollapsed }">
        <nav class="sidebar-nav">
          <router-link
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="nav-item"
            active-class="active"
            :style="`${
              item.permission
                .toLowerCase()
                .includes(user.user_permission.toLowerCase())
                ? 'display: flex;'
                : 'display: none;'
            }`"
          >
            <!-- :style="'" -->
            <img :src="item.icon" class="nav-icon" />
            <span class="nav-text">{{ item.name }}</span>
          </router-link>
        </nav>

        <div class="sidebar-footer">
            <ul class="profile-options" v-show="isProfileOption">
              <router-link to="/">
                <li>Account</li>
              </router-link>
              <router-link to="/">
                <li>Settings</li>
              </router-link>
              <span @click="logOutHandler">
                <li>Log Out</li>
              </span>
            </ul>
          <div class="user-profile" @click="isProfileOption = !isProfileOption">
            <div
              class="avatar nav-icon"
              :style="`background-color: ${user.user_color};`"
            >
              {{ user.user_initial }}
            </div>
            <div class="user-profile-details nav-text">
              <b class="username">{{ user.user_name }}</b>
              <span class="email">{{ user.user_email }}</span>
            </div>
          </div>
          <!-- <button @click="logout" class="logout-btn">
            <LogoutIcon class="nav-icon" />
            <span class="nav-text">Logout</span>
          </button> -->
        </div>
      </aside>

      <!-- Main Content -->
      <main class="main-content" :class="{ expanded: isSidebarCollapsed }">
        <div class="content-container">
          <slot></slot>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.dashboard-container {
  display: grid;
  grid-template-areas:
    "header header"
    "sidebar main";
  grid-template-columns: auto 1fr;
  grid-template-rows: auto 1fr;
  min-height: 100vh;
}

.header {
  grid-area: header;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 100;
  position: sticky;
  top: 0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-right {
  display: flex;
  align-items: center;
  padding-right: 2rem;
  gap: 1rem;
}
.header-right img {
  width: 1.5rem;
  cursor: pointer;
}

.menu-toggle {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo img {
  height: 2.5rem;
}

.sidebar {
  grid-area: sidebar;
  width: 250px;
  height: calc(100vh - 64px);
  background-color: #2c3e50;
  color: white;
  transition: all 0.3s ease;
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
}

.sidebar.collapsed {
  width: 60px;
}

.sidebar-nav {
  flex: 1;
  padding: 1rem 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.nav-item {
  width: 80%;
  min-width: 60px;
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  color: #ecf0f1;
  text-decoration: none;
  transition: all 0.2s;
  white-space: nowrap;
  border-radius: 10px;
}

.nav-item:hover {
  background-color: #34495e;
}

.nav-item.active {
  background-color: #ff6600;
}

.nav-icon {
  margin-right: 1rem;
  width: 1rem;
  flex-shrink: 0;
}

.sidebar.collapsed .nav-text {
  display: none;
}

.sidebar.collapsed .nav-icon {
  margin-right: 0;
}

.username {
  font-weight: 600;
  font-size: 1rem;
}

.sidebar-footer {
  padding: 1rem;
  position: relative;
  cursor: pointer;
  border-top: 1px solid #34495e;
}

.profile-options {
  position: absolute;
  bottom: 100%;
  right: 30px;
  padding: 10px;
  border-radius: 10px;
  background-color: #fff;
  list-style-type: none;
}

li {
  color: #2c3e50;
  padding: 6px 12px;
  width: 100px;
}

li:not(:nth-last-child()) {
  margin-bottom: 100px;
}

router-link, a {
  text-decoration: none;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 10px;
}

.sidebar.collapsed .sidebar-footer {
  padding: 1rem 0;
}

.avatar {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  display: grid;
  place-items: center;
}

.user-profile-details {
  display: flex;
  flex-direction: column;
}

.user-profile:hover {
  background-color: #ffffff2a;
}

.main-content {
  grid-area: main;
  padding: 1rem;
  background-color: #f5f7fa;
  height: calc(100vh - 64px);
  transition: margin-left 0.3s ease;
  overflow: hidden;
}

.content-container {
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  height: 100%;
  overflow: auto;
}

/* Responsive styles */
@media (max-width: 768px) {
  .dashboard-container {
    grid-template-areas:
      "header"
      "main";
    grid-template-columns: 1fr;
  }

  .sidebar {
    position: fixed;
    left: 0;
    top: 60px;
    height: calc(100vh - 64px);
    z-index: 90;
    transform: translateX(-100%);
  }

  .sidebar.collapsed {
    transform: translateX(0);
    width: 250px;
  }

  .main-content {
    margin-left: 0 !important;
  }
}
</style>
