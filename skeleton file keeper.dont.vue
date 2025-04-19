<template>
  <!-- Dashboard View -->
  <DashboardSkeleton
    :onClickToShow="toggleDialogue"
    :hBtnShow="list.length"
    hBtnMsg="Add Client"
    :user="user"
    pageTitle="Customers List"
    v-show="!isLoading"
  >
    <!-- enter your content below (slots) -->
    <!-- no list found -->
    <NullList
      v-show="!list.length"
      :nullImg="serviceNull"
      null-text="Add your product, services, cartalogue. seemless management, manage product and pricing."
      null-btn-text="Add Services"
      :null-btn-action="toggleDialogue"
    />

    <!-- list available -->

    <!-- enter of content (slot) -->
  </DashboardSkeleton>
</template>