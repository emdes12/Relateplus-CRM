<script setup>
defineProps({
    user: Object,
})
</script>
<template>
  <h3>Settings Page</h3>

  <div class="settings-body">
    <div class="settings-options">
      <RouterLink class="link-opt" to="#business-management">Business settings</RouterLink>
      <RouterLink class="link-opt" to="#third-parties"> Third parties Integration </RouterLink>
    </div>
    <div class="settings-page">
      <div id="business-management">
        <h4>Hello business</h4>
        <p>Business setting, business name, about and management here.</p>
    </div>
      <div class="level-1" id="third-parties">
        <h4>All Third Parties Integration</h4>
        <p>Add or Remove a Third Party token from this account.</p>
        <div class="level-2">
            <h5>Calendar Integrations</h5>
            <p>To create meeting link n your behalf</p>
            <div class="level-3">
                <b>Google Calendar Token:</b> 
                <p>{{ user.google_access_token || "Not yet authorized" }}</p>

            </div>
            <div class="level-3">
                <b>Zoom Meetingg Token:</b>
                <p>{{ user.zoom_access_token || "Not yet authorized" }}</p>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.settings-body {
    padding: 1rem;
    display: grid;
    grid-template-columns: 200px 1fr;
    grid-template-rows: 1fr;
    height: calc(100% - 30px);
}

.settings-options {
    display: flex;
    flex-direction: column;
    border-right: 1px solid #b9b9b9;
}

.link-opt {
    padding: 8px 12px;
}

.link-opt:hover {
    background-color: #ecf0f3;
}

.settings-page {
    display: flex;
    flex-direction: column;
    gap: 30px;
    padding: 0 3rem;
}

div.level-2 {
    padding: 10px 20px;
    display: flex;
    flex-direction: column;
}

.level-2 h5 {
    font-weight: 400;
    font-size: 20px;
}

.level-3 {
    padding: 3px 10px;
    display: flex;
    gap: 10px;
    align-items: center;
}

.level-3 p {
  width: 130px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  padding: 5px;
  border: 1px solid rgb(217, 221, 235);
}
</style>
