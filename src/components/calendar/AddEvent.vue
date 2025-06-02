<script setup>
import cameraIcon from "@/assets/icons/camera.svg";
import BtnDbPry from "../BtnDbPry.vue";
import BtnDbSec from "../BtnDbSec.vue";

defineProps({
  toggleDialogue: Function,
});

</script>

<template>
  <h3>Create an Event</h3>

  <div class="form-inputs-container">
    <!-- Side 1 of Form  -->
    <div>
      <div class="label-input">
        <label for="task-title">Task Title</label>
        <input
          type="text"
          name="task-title"
          placeholder="Task Title"
          id="task-title"
        />
      </div>

      <div class="label-input">
        <label for="task-client">Task Client</label>
        <select name="task-client" id="task-client">
          <option disabled selected>Select Option</option>
          <option value="AdeTech">AdeTech</option>
          <option value="Farm-Titan">Farm-Titan</option>
          <option value="Mobim Fits">Mobim Fits</option>
        </select>
      </div>

      <div class="label-input">
        <label for="task-description">Task Description</label>
        <textarea
          name="task-description"
          id="task-description"
          placeholder="Description"
        ></textarea>
      </div>

      <div class="label-input">
        <label>Assign</label>
        <div class="mutli-select">
          <input type="checkbox" name="Wale" id="Wale" />
          <label for="Wale">Wale</label>
        </div>
        <div class="mutli-select">
          <input type="checkbox" name="Azeez" id="Azeez" />
          <label for="Azeez">Azeez</label>
        </div>
        <div class="mutli-select">
          <input type="checkbox" name="Olakunle" id="Olakunle" />
          <label for="Olakunle">Olakunle</label>
        </div>
      </div>
    </div>

    <!-- side 2 -->
    <div>
      <div class="label-input">
        <label for="task-attachment">
          <img :src="cameraIcon" alt="camera device icon" />
          Attach a File
        </label>
        <input
          style="display: none"
          type="file"
          accept=".jpg, .jpeg, .png, .pdf, .docx"
          name="task-attachment"
          id="task-attachment"
        />
      </div>

      <div class="label-input">
        <label for="task-due-date">Task Due Date</label>
        <input type="date" name="task-due-date" id="task-due-date" />
      </div>

      <div class="label-input">
        <label for="task-priority">Task Priority Level</label>
        <select name="task-priority" id="task-priroty">
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
      </div>
    </div>
  </div>

  <!-- action buttons -->
  <div class="actions-btn">
    <BtnDbSec :onClickToCancel="toggleDialogueBtn" msg="Cancel" />
    <BtnDbPry :onClickToAct="actionClickSubmit" msg="Add Event" />
  </div>
</template>

<style scoped>
h3 {
  width: 100%;
  text-align: center;
  padding: 20px 0;
}

.form-inputs-container {
  display: flex;
  flex-wrap: wrap;
  align-items: start;
  gap: 20px;
  width: 100%;
  height: calc(100% - 150px);
  position: relative;
  overflow: auto;
}

.form-inputs-container > div {
  flex: 1;
  min-width: 300px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.label-input > label {
  font-size: 16px;
}

.label-input > input,
.label-input > select,
.label-input > textarea {
  border: 1px solid black;
  width: 100%;
  padding: 11px 26px;
  color: #777676;
  text-align: left;
  border-radius: 10px;
  font-family: "League Spartan";
  font-size: 17px;
  font-style: normal;
  font-weight: 200;
  line-height: normal;
}

label[for="task-attachment"] {
  border-radius: 10px;
  border: 1px solid black;
  width: 100%;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 5px;
  cursor: pointer;
}

textarea {
  height: 150px;
}

.mutli-select {
  display: flex;
  gap: 9px;
}

.actions-btn {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  gap: 20px;
  width: 100%;
  height: 100px;
  padding: 20px;
  border-top: 1px solid #c1c1c1;
  align-items: center;
  justify-content: center;
}
</style>
