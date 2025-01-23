<script setup>
import Logo from "../../assets/icons/r+.svg"
</script>

<template>
  <div class="container auth">
    <div class="logo"><img alt="logo" src="@/assets/logo2.svg" /></div>
  <main>
  <div class="content">
    <div class="form-container">
      <h2>We're excited you're here</h2>
      <h4>Start by creating a free account</h4>
      <form action="#">
        <input type="text"><br>
        <input type="text"><br>
        <button type="submit">Sign Up</button>
      </form>
    </div>
    <div class="img"></div>
  </div>
  </main>
  </div>
</template>

<style>
.auth {
  background-color: var(--auth-bg);
  width: 100%;
  height: 100vh;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 150px 1fr;
}

.logo {
  display: grid;
  place-items: center;
}

h2, h4 {
  text-align: center;
  width: 100%;
}

h4 {
  font-weight: 700;
}

main, .content {
  display: grid;
  place-items: center;
}

.content {
  grid-template-rows: 602px;
  grid-template-columns: 1fr 2000px 1fr;
}

.img {
  background-image: url("../../assets/images/auth-sign-up.png");
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  grid-column: 2 / 3;
  width: 482px;
  border-radius: 32px;
  left: -200px;
  position: sticky;
  height: 494px;
}

.form-container {
  background-color: white;
  width: 482px;
  gap: 20px;
  border-radius: 32px;
  height: 602px;
  display: flex;
  align-items: center;
  z-index: 12;
  justify-content: space-between;
  flex-direction: column;
  padding: 42px 50px;
  grid-column: 1 / 3;
}

@media (min-width: 1024px) {
  
}
</style>
