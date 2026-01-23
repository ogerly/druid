<template>
  <nav class="navbar">
    <button class="icon-button hamburger-button" @click="emit('toggleSidebar')">
      <span></span>
      <span></span>
      <span></span>
    </button>
    <div class="logo">DRUID</div>
    <div class="action-icons">
        <button class="icon-button" @click="emit('center')" title="Center on Me">&#10148;</button>
        <button class="icon-button" @click="emit('toggleRec')" :class="{ 'is-recording': isRecording }" title="Start/Stop Recording">
            <span class="rec-dot"></span>
        </button>
        <button class="icon-button" @click="emit('clear')" title="Clear Path">&#128465;</button>
    </div>
  </nav>
</template>

<script setup>
const props = defineProps({
  isRecording: Boolean
});
const emit = defineEmits(['toggleSidebar', 'center', 'toggleRec', 'clear']);
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
  background-color: rgba(25, 25, 25, 0.9);
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1rem;
  z-index: 1100;
  box-shadow: 0 2px 5px rgba(0,0,0,0.3);
  box-sizing: border-box; /* This is the fix */
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  letter-spacing: 2px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.icon-button {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 1.6rem;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hamburger-button {
  flex-direction: column;
  justify-content: space-around;
  width: 30px;
  height: 25px;
  padding: 0;
}

.hamburger-button span {
  display: block;
  width: 100%;
  height: 3px;
  background-color: #fff;
  border-radius: 3px;
}

.action-icons {
    display: flex;
    align-items: center;
    gap: 15px;
}

.rec-dot {
    width: 18px;
    height: 18px;
    background-color: white;
    border-radius: 50%;
    transition: all 0.3s ease;
}

.icon-button.is-recording .rec-dot {
    background-color: #ff4757;
    box-shadow: 0 0 8px #ff4757;
}

</style>
