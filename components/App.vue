<template>
  <div id="app">
    <transition name="fade" mode="out-in">
      <router-view />
    </transition>
  </div>
</template>
<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition-property: opacity;
  transition-duration: 0.45s;
}

.fade-enter-active {
  transition-delay: 0.45s;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}
</style>
