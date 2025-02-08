<script setup>
import { ref } from "vue"
import Logo from "../../assets/icons/r+.svg"
import BtnPry from "../../components/BtnPry.vue"
import FormInput from "../../components/FormInput.vue"
import AuthImg from "../../assets/images/auth-sign-in.png"
import MailIcon from "../../assets/icons/envelop.svg"
import HidePassIcon from "../../assets/icons/hide.svg"
import ShowPassIcon from "../../assets/icons/lock.svg"
import PassIcon from "../../assets/icons/lock.svg"

let emailValue = ref("")
let passValue = ref("")
let IconPassValue = ref(HidePassIcon)
let passwordText = ref("password")
let isShowPassword = ref(false)
let agreedlValue = ref(true)

const submitLogin = () => {
  console.log(emailValue.value)
  console.log(passValue.value)
  console.log(agreedlValue.value)
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
      <div class="img">
        <img class="imag" :src="AuthImg" />
      </div>
      <div class="form-container">
        <h3>Welcome back</h3>
        <h4>Sign in now!</h4>
        <form action="#">
          <FormInput inpType="email" v-model="emailValue" inpPlaceholder="Email:" :inpIcon="MailIcon" />
          <FormInput :inpType="passwordText" v-model="passValue" inpPlaceholder="Password:" :passChangeAction="showPassword" :passShowIcon="IconPassValue" :inpIcon="PassIcon" />
          <div class="rdlf">
            <span><FormInput inpType="checkbox" v-model="agreedlValue" /></span> <p>agreed to the <RouterLink to="#">Terms and Conditions</RouterLink></p>
          </div>
          <BtnPry msg="Login" :onSubmitToCreate="submitLogin" wdt="100%"/>
        </form>
        <div class="auth-methods">
          <span>Continue with:</span>
          <div class="other-auth">
            <span><img src="../../assets/images/Google-auth.png" /></span>
            <span><img src="../../assets/images/Facebook-auth.png" /></span>
            <span><img src="../../assets/images/Apple-auth.png" /></span>
          </div>
        </div>
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
  padding: 15px;
  border: 2px solid black;
  border-radius: 10px;
  flex: 1 1 auto;
}

.other-auth span img {
  width: 30px;
  height: 30px;
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

h3, h4 {
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
  padding: 42px 50px;
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
