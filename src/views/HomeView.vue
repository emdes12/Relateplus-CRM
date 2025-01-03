<script setup>
import BtnPry from "../components/BtnPry.vue";
import Header from "../components/Header.vue";
import IconPlay from "../components/icons/IconPlay.vue";
</script>

<template>
  <main>
    <Header />

    <div class="hero">
      <div id="container">
        <div class="bn-text">
          <h1>
            Connect Deeper. <br />
            Grow Faster.
          </h1>
          <span
            >Your all-in-one CRM for building meaningful relationships and
            driving sales.</span
          >
          <div class="p-20">
            <BtnPry msg="Get started for free" link="/signup" />
          </div>
        </div>
      </div>
    </div>

    <div
      id="container"
      style="
        display: flex;
        align-items: center;
        justify-content: center;
        padding-top: 50px;
        padding-bottom: 50px;
      "
    >
      <div
        style="
          width: 1013px;
          height: 608px;
          flex-shrink: 0;
          background: #d9d9d9;
          display: flex;
          align-items: center;
          justify-content: center;
        "
      >
        <div
          style="
            display: flex;
            width: 72px;
            height: 72px;
            padding: 13px;
            align-items: center;
            justify-content: center;
            gap: 10px;
            flex-shrink: 0;
            border-radius: 36px;
            background: #8f8f8f;
          "
        >
          <img :src="IconPlay" alt="" />
        </div>
      </div>
    </div>
  </main>
</template>
<style scoped>
.hero {
  width: 100%;
  background-image: url(../assets/images/80pxmanagement.png);
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  color: #ffffff;
}

.bn-text {
  padding-top: 208px;
  padding-bottom: 100px;
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 20px;
}

.p-20 {
  padding-top: 20px;
}

h1 {
  text-align: center;
}

span {
  color: #fff;
  font-family: "League Spartan";
  font-size: 28px;
  font-style: normal;
  font-weight: 200;
  line-height: normal;
}
</style>
