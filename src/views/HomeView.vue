<script setup>
import BtnPry from "../components/BtnPry.vue";
import BtnSec from "../components/BtnSec.vue";
import Header from "../components/Header.vue";
import TagCon from "../components/TagCon.vue"
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
          <span style="text-align: center"
            >Your all-in-one CRM for building meaningful relationships and
            driving sales.</span
          >
          <div class="p-20">
            <BtnPry msg="Get started for free" link="/signup" />
          </div>
        </div>
      </div>
    </div>

    <div class="container" style="
        display: flex;
        align-items: center;
        justify-content: center;
        padding-top: 50px;
        padding-bottom: 50px;">
      <!-- content to be changed to YT video -->
      <div
        style="ytvid"
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

      <img src="@/assets/images/relate+ mockup1.png" style=""/>
    </div>

    <div class="container" style="padding: 50px 0;">
      <div class="capman">
        <div class="multi-lvltxt-wrapper capm" style="margin: 0 0 60px 50px;">
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
      <h2 style="text-align: center; margin-bottom: 20px; ">Empowering your Team</h2>
      <div class="flxwrap">
        <TagCon cont="Cultivate lasting customer relationships with Relate+'s powerful CRM tools" hd="Strengthen Connections" tag="Elevate performance"/>
        <TagCon cont="Empower your team with Relate+'s intuitive CRM tools" hd="Unlock Insights" tag="Elevate performance"/>
        <TagCon cont="Streamline your workflows and unlock new growth opportunities with Relate+" hd="Foster Collaboration" tag="Driver results"/>
        <TagCon cont="Relate+ is the comprehensive CRM solution you need to thrive in today's competitive market" hd="Enhance Visibility" tag="Boost productivity"/>
        <TagCon cont="Experience the transformative power of Relate+, the all-in-one CRM solution that elevates your business" hd="Optimize Efficiency" tag="Accelerate success"/>
        <TagCon cont="Unlock the full potential of your customer data with Relate+" hd="Foster Collaboration" tag="Drive Growth"/>
      </div>
    </div>

    <!-- review -->
    <div class="container"><div class="revw">
      <img src="../assets/images/Male-User.png" alt="user image"/>

      <span style="color: #aaa; text-align: center; line-height: 1.8rem">Relate+ has transformed our sales team. We're closing more deals and providing better customer service than ever before.</span>

      <div class="stars">
        <img src="../assets/icons/star.svg"/>
        <img src="../assets/icons/star.svg"/>
        <img src="../assets/icons/star.svg"/>
        <img src="../assets/icons/star.svg"/>
        <img src="../assets/icons/star.svg"/>
      </div>
    </div></div>

    
    <div class="container flx">
      <div class="multi-lvltxt-wrapper">
        <h2 style="color: #1E1D20;">Relate+ is more than Just a CRM software</h2>
        <span style="color: #939393;">
          It's a powerful tool that helps you build stronger relationships, drive sales, and achieve your business goals
        </span>

        <BtnSec link="./sign-up" msg="Join for Free" />
      </div>

      <img src="../assets/images/relate-plus-business-set.png" style="max-width: 600px"/>
    </div>

    <div class="container flx" style="padding: 50px 0 30px 0;">
      <span style="color: #aaa; width: 169px; font-size: 1rem;">© 2024 Relato, Inc.
        All rights reserved.</span>

        <div class="stars">
          <img src="../assets/icons/Facebook.png" alt="facebook">
          <img src="../assets/icons/Instagram.png" alt="instagram">
          <img src="../assets/icons/TwitterX.png" alt="twitterX">
        </div>
    </div>
  </main>
</template>
<style scoped>
.revw {
  display: flex;
  flex-direction: column;
  gap: 50px;
  justify-content: center;
  align-items: center;
  border: 1px solid #000;
  border-radius: 5px;
  padding: 20px;
  margin: 50px 0;
}

.revw img {
  width: 90px;
}

.stars {
  display: flex;
  gap: 5px;
}

.stars img {
  width: 50px;
}

.flxwrap {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 20px;
  justify-content: space-between;
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

.flx img {
  width: 100%;
  max-width: 600px;
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

.ytvid {
  width: 1013px;
  height: 608px;
  flex-shrink: 0;
  background: #d9d9d9;
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (max-width: 850px) {
  .flx {
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  span {
    font-size: 16px;
  }

  .ytvid {
    width: 100%;
    height: 400px;
  }

  .multi-lvltxt-wrapper {
    width: 100%;
  }

  .multi-lvltxt-wrapper.capm {
    width: 60%;
  }

  .capman {
    padding-top: 80px;
  }
}

@media (max-width: 500px) {
  .capman {
    padding-top: 50px;
  }
}
</style>
