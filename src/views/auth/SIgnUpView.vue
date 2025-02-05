<script setup>
import { ref } from "vue"
import Logo from "../../assets/icons/r+.svg"
import BtnPry from "../../components/BtnPry.vue"
import FormInput from "../../components/FormInput.vue"
import AuthImg from "../../assets/images/auth-sign-up.png"
import MailIcon from "../../assets/icons/envelop.svg"
import HidePassIcon from "../../assets/icons/hide.svg"
import ShowPassIcon from "../../assets/icons/lock.svg"
import PassIcon from "../../assets/icons/lock.svg"

let emailValue = ref("")
let passValue = ref("")
let IconPassValue = ref(HidePassIcon)
let passwordText = ref("password")
let isShowPassword = ref(false)

const createAccount = () => {
  console.log(emailValue.value)
  console.log(passValue.value)
}

const showPassword = () => {
  if(!isShowPassword.value){
    IconPassValue.value = ShowPassIcon
    passwordText.value = "text"
    isShowPassword.value = true
  } else {
    IconPassValue.value = HidePassIcon
    passwordText.value = "password"
    isShowPassword.value = false
  }
}
</script>

<template>
  <div class="auth">
    <div class="container">
      <div class="logo"><img alt="logo" src="@/assets/logo2.svg" /></div>
    <main class="content">
      <div class="form-container">
        <h2>We're excited you're here</h2>
        <h4>Start by creating a free account</h4>
        <form action="#">
          <FormInput inpType="email" v-model="emailValue" inpPlaceholder="Email:" :inpIcon="MailIcon" />
          <FormInput :inpType="passwordText" v-model="passValue" inpPlaceholder="Password:" :passChangeAction="showPassword" :passShowIcon="IconPassValue" :inpIcon="PassIcon" />
          <BtnPry msg="Create account" :onSubmitToCreate="createAccount" wdt="100%"/>
        </form>
      </div>
      <div class="img">
        <img class="imag" :src="AuthImg" />
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

.logo {
  padding: 20px;
  display: grid;
  place-items: center;
}

.container {
  display: grid;
  grid-template-rows: 100px 1fr;
}

h2, h4 {
  text-align: center;
  width: 100%;
}

h4 {
  font-weight: 700;
}

main.content {
  display: flex;
  align-items: center;
  justify-content: center;
}

.img {
  max-width: 452px;
  border-top-right-radius: 32px;
  border-bottom-right-radius: 32px;
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
  padding: 42px 50px;
}

form {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 30px;
  flex-direction: column;
}

@media (max-width: 700px) {
  .img {
    display: none;
  }

  .form-container {
    width: 100%;
  }
}
</style>
