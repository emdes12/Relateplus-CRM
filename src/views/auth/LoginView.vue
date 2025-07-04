<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import Logo from "../../assets/icons/r+.svg";
import BtnPry from "../../components/BtnPry.vue";
import AlertMessage from "../../components/AlertMessage.vue";
import FormInput from "../../components/FormInput.vue";
import AuthImg from "../../assets/images/auth-sign-in.png";
import MailIcon from "../../assets/icons/envelop.svg";
import HidePassIcon from "../../assets/icons/hide.svg";
import ShowPassIcon from "../../assets/icons/lock.svg";
import PassIcon from "../../assets/icons/lock.svg";
import apiMode from "../../../apiMode";

// check if token is available
onMounted(() => {
  const token = localStorage.getItem("token");

  if (token) {
    return (window.location.href = "/dashboard");
  }
});

let emailValue = ref("");
let passValue = ref("");
let IconPassValue = ref(HidePassIcon);
let passwordText = ref("password");
let isShowPassword = ref(false);
let isMessage = ref(false);
let alertMes = ref("Successfully logged in");
let alertType = ref("success");

// Add base URL (adjust according to your backend)
// const api = axios.create({
//   baseURL: "http://localhost:4123", // Change this for production
//   // withCredentials: true // Optional: for cookies/sessions
// });

const api = apiMode;
const showAlert = (string1, string2) => {
  alertMes.value = string1;
  alertType.value = string2;
  isMessage.value = true;
  setInterval(() => {
    isMessage.value = false;
  }, 5000);
};

const submitLogin = async () => {
  try {
    const response = await api.post("/auth/login", {
      email: emailValue.value,
      password: passValue.value,
    });

    // Handle successful login
    // console.log("Login successful:", response.data);
    showAlert("Login successful", "success");

    // Store token (if using JWT)
    localStorage.setItem("token", response.data);

    const config = {
      headers: { token: response.data },
    };

    const result = await api.get("/auth/is-verify", config);
    if (!result) {
      return console.log(result);
    }
    // console.log(result.data);

    // Redirect to dashboard
    window.location.href = "/dashboard";
  } catch (error) {
    console.error("Login failed:", error.response.data);
    // Add error message display to user
    showAlert(error.response.data, "error");
  }
};

const socialLogin = () => {
  showAlert("Server Error Login Using your email and password", "error");
};

const showPassword = () => {
  if (!isShowPassword.value) {
    IconPassValue.value = ShowPassIcon;
    passwordText.value = "text";
    isShowPassword.value = true;
  } else {
    IconPassValue.value = HidePassIcon;
    passwordText.value = "password";
    isShowPassword.value = false;
  }
};
</script>

<template>
  <AlertMessage v-show="isMessage" :msg="alertMes" :type="alertType" />
  <div class="auth">
    <div class="container">
      <div class="logo"><img alt="logo" src="@/assets/logo2.svg" /></div>
      <main class="content">
        <div class="img">
          <img class="imag" :src="AuthImg" />
        </div>
        <div class="form-container">
          <div class="auth-methods">
            <h3>Welcome back</h3>
            <h4>Sign in now!</h4>
          </div>
          <form @submit.prevent="submitLogin">
            <FormInput
              inpType="email"
              v-model="emailValue"
              inpPlaceholder="Email:"
              :inpIcon="MailIcon"
            />
            <FormInput
              :inpType="passwordText"
              v-model="passValue"
              inpPlaceholder="Password:"
              :passChangeAction="showPassword"
              :passShowIcon="IconPassValue"
              :inpIcon="PassIcon"
            />
            <div class="rdlf">
              <!-- <span><FormInput inpType="checkbox" v-model="agreedlValue" /></span> <p>agreed to the <RouterLink to="#">Terms and Conditions</RouterLink></p> -->
            </div>
            <BtnPry msg="Login" :onSubmitToCreate="submitLogin" wdt="100%" />
            <!-- <BtnPry type="submit" msg="Login"  wdt="100%"/> -->
          </form>
          <div class="auth-methods">
            <span>Continue with:</span>
            <div class="other-auth">
              <span @click="socialLogin"
                ><img src="../../assets/images/Google-auth.png"
              /></span>
              <span @click="socialLogin"
                ><img src="../../assets/images/Facebook-auth.png"
              /></span>
              <span @click="socialLogin"
                ><img src="../../assets/images/Apple-auth.png"
              /></span>
            </div>
          </div>
          <p>
            Don't have an account? <RouterLink to="/signup">Signup</RouterLink>
          </p>
        </div>
      </main>
    </div>
  </div>
</template>

<style>
.auth {
  background-color: var(--auth-bg);
  width: 100%;
  height: 100vh;
}

.rdlf {
  display: flex;
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.rdlf span {
  width: 30px;
}

.rdlf p {
  flex: 1;
}

.auth-methods {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  gap: 10px;
  flex-direction: column;
}

.other-auth {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  width: 100%;
}

.other-auth span {
  display: grid;
  place-items: center;
  padding: 10px;
  border: 2px solid black;
  border-radius: 10px;
  flex: 1 1 auto;
}

.other-auth span img {
  width: 20px;
  height: 20px;
}

.logo {
  padding: 20px;
  display: grid;
  place-items: center;
}

.container {
  display: grid;
  grid-template-rows: 100px 1fr;
}

h3,
h4 {
  text-align: center;
  width: 100%;
}

main.content {
  display: flex;
  align-items: center;
  justify-content: center;
}

.img {
  max-width: 400px;
  border-top-left-radius: 32px;
  border-bottom-left-radius: 32px;
  height: 494px;
  overflow: hidden;
}

img.imag {
  width: 100%;
  height: 100%;
  object-position: center;
  object-fit: cover;
}

.form-container {
  background-color: white;
  width: 527px;
  gap: 20px;
  border-radius: 32px;
  height: 602px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  padding: 40px;
}

form {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  flex-direction: column;
}

@media (max-width: 800px) {
  .img {
    display: none;
  }

  .form-container {
    width: 100%;
    padding: 40px 20px;
  }
}
</style>
