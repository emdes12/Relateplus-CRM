<script setup>
import BtnPry from "../components/BtnPry.vue";
import BtnSec from "../components/BtnSec.vue";
import Header from "../components/Header.vue";
import IconPlay from "../components/icons/IconPlay.vue";
</script>

<template>
  <main>
    <Header />

    <div class="hero">
      <div class="container">
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
      class="container"
      style="
        display: flex;
        align-items: center;
        justify-content: center;
        padding-top: 50px;
        padding-bottom: 50px;
      "
    >
      <!-- content to be changed to YT video -->
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

    <div class="container flx">
      <div class="multi-lvltxt-wrapper">
        <h2 style="color: #1E1D20;">Empower your team with Relate+</h2>
        <span style="color: #939393;">
          The CRM that simplifies customer interactions, streamlines sales processes, and delivers actionable insights.
        </span>

        <BtnSec link="./sign-up" msg="Get started for free" />
      </div>

      <img src="@/assets/images/relate+ mockup1.png" style="max-width: 600px"/>
    </div>

    <div class="container" style="padding: 50px 0;">
      <div class="capman">
        <div class="multi-lvltxt-wrapper" style="margin: 0 0 60px 50px;">
          <h2 style="color: #fff;">Seamless Interaction with Customers</h2>
          <span style="color: #939393;">
            Building strong and lasting relationships with customers
          </span>

          <BtnPry link="./sign-up" msg="Start Now!" />
        </div>
        <div class="flx">
          <img src="@/assets/images/relate+ mockup2.png"/>
          <div class="multi-lvltxt-wrapper" style="max-width: 600px; align-items: center; justify-content: center;">

            <h2 style="color: #FFC107; text-align: center;">Interacting and close more deals!</h2>

            <BtnPry link="./sign-up" msg="Start Building" />
          </div>
        </div>
      </div>
    </div>

    <!-- empowering team -->
    <div class="container">
      <h2 style="text-align: center;">Empowering your Team</h2>
      <div class="flxwrap">
        <div class="tag-container">
          <div class="square"></div>
          <div class="mintxt">
            <div class="mintxthd">
              <span>Strengthen Connections</span> <p>Elevate performance</p>
            </div>
            <p>Cultivate lasting customer relationships with Relate+'s powerful CRM tools</p>
          </div>
        </div>
        
        <div class="tag-container">
          <div class="square"></div>
          <div class="mintxt">
            <div class="mintxthd">
              <span>Strengthen Connections</span> <p>Elevate performance</p>
            </div>
            <p>Cultivate lasting customer relationships with Relate+'s powerful CRM tools</p>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
<style scoped>
.flxwrap {
  display: flex;
  flex-wrap: wrap;
  flex: 1 1 auto;
  align-items: center;
  justify-content: space-between;
}

.tag-container {
  border: 1px solid #000;
  width: 525px;
  padding: 25px;
  display: flex;
  gap: 15px;
  border-radius: 5px;
  align-items: center;
}

.tag-container:hover {
  background-color: #000;
}

.square {
  content: "";
  background-color: #aaa;
  width: 65px;
  height: 65px;
}

.mintxt {
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
}

.mintxthd {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mintxt > p {
  color: #aaa;
}

.tag-container:hover > .mintxt > .mintxthd > span {
  color: #fff;
}

.mintxthd > span {
  color: #000;
}

.mintxthd > p {
  color: #FFC107;
}

.hero {
  width: 100%;
  background-image: url(../assets/images/80pxmanagement.png);
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  color: #ffffff;
}

.flx {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 30px;
}

.multi-lvltxt-wrapper {
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 20px;
  width: 560px;
  min-width: 360px;
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

.capman {
  width: 100%;
  background-image: url(../assets/images/relatecaption1.png);
  background-repeat: no-repeat;
  background-size: contain;
  background-position: top center;
  padding-top: 280px;
}
</style>
