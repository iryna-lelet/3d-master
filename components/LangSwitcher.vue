<template>
  <div class="lang-switcher">
    <i class="fas fa-globe"></i>
    <select
      id="lang-switcher"
      v-model="lang"
      @change="handleLangChange($event)"
    >
      <option value="en">
        EN
      </option>
      <option value="ua">
        UA
      </option>
      <option value="ru">
        RU
      </option>
    </select>
  </div>
</template>

<style scoped>
    
.fa-globe {
  font-size: 25px;
  margin-right: 5px;
}

.lang-switcher {
    display: flex;
    justify-content: space-between;
    position: fixed;
    left: 10px;
    top: 10px;
    z-index: 20;
}

</style>

<script>
export default {
    data() {
        const lang = localStorage.getItem('lang') || 'en';
        return {
            lang
        }
    },
    methods: {
        handleLangChange(event) {
            localStorage.setItem('lang', event.target.value);
            window.location.reload();
        }
    }
}
</script>