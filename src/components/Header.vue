<template>
  <header>
    <div class="container">
      <div class="header">
        <img alt="logo" class="logo" src="@/assets/logo.svg" />

        <span>+2349113462780   |  info@relateplus.com</span>
      </div>
    </div>
  </header>
</template>
<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

img {
  width: 200px;
  height: 80px;
}

@media (max-width: 750px) {
  .flx {
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  img {
    width: 150px;
  }

  span {
    font-size: 10px;
  }
}
</style>