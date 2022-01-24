<template>
  <div id="help">
    <router-link to="/"><i class="fas fa-arrow-left"></i> {{ $t('BackButton') }} </router-link>
    <LangSwitcher />
    <div class="infoblock">
      <h1 class="infoblock__title">Wrap App</h1>
      <h2 class="infoblock__description"> {{ $t('InfoAppDescription') }} </h2>
    </div>
    <div class="infoblock">
      <h1 class="infoblock__title"> {{ $t('InfoLinesTitle') }} </h1>
      <img :src="require(`../assets/img/info-lines-${this.$i18n.locale}.jpg`)" alt="Lines" class="infoblock__img">
      <h2 class="infoblock__description"> {{ $t('InfoLinesDescriptions') }} </h2>
    </div>
    <div class="infoblock">
      <h1 class="infoblock__title">{{ $t('InfoFiguresTitle') }}</h1>
      <img :src="require(`../assets/img/info-figures-${this.$i18n.locale}.jpg`)" alt="Figures" class="infoblock__img">
      <h2 class="infoblock__description"> {{ $t('InfoFiguresDescriptions') }} </h2>
    </div>
    <div class="infoblock">
      <h1 class="infoblock__title">{{ $t('InfoIconsTitle') }}</h1>
      <img :src="require(`../assets/img/info-icons-${this.$i18n.locale}.jpg`)" alt="Icons" class="infoblock__img">
      <h2 class="infoblock__description"> {{ $t('InfoIconsDescription') }}</h2>
    </div>
    <div class="infoblock">
      <h1 class="infoblock__title">{{ $t('InfoTextTitle') }}</h1>
      <img :src="require(`../assets/img/info-text-${this.$i18n.locale}.jpg`)" alt="Text" class="infoblock__img">
      <h2 class="infoblock__description"> {{ $t('InfoTextDescription') }}</h2>
    </div>
    <div class="infoblock">
      <h1 class="infoblock__title">{{ $t('InfoImageTitle') }}</h1>
      <img :src="require(`../assets/img/info-addimage-${this.$i18n.locale}.jpg`)" alt="Add Image" class="infoblock__img">
      <h2 class="infoblock__description">{{ $t('InfoImageDescription') }}</h2>
    </div>
    <div class="infoblock">
      <h1 class="infoblock__title">{{ $t('InfoFiltersTitle') }}</h1>
      <img :src="require(`../assets/img/info-filters-${this.$i18n.locale}.jpg`)" alt="Filters" class="infoblock__img">
      <h2 class="infoblock__description">{{ $t('InfoFiltersDescription') }}</h2>
    </div>
    <div class="infoblock">
      <h1 class="infoblock__title">{{ $t('InfoModelTitle') }}</h1>
      <img :src="require(`../assets/img/info-model-${this.$i18n.locale}.jpg`)" alt="Model" class="infoblock__img">
      <h2 class="infoblock__description">{{ $t('InfoModelDescription') }}</h2>
    </div>
    

  </div>
</template>

<style scoped>
  #help {
    max-width: 1024px;
    margin: 0 auto;
  }

  #help .lang-switcher {
    left: unset;
    right: 20px;
  }

  h1, h2 {
    font-family: 'Montserrat', sans-serif;
  }

  .infoblock {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .infoblock__title {
    font-size: 27px;
  }

  .infoblock__img {
    max-width: 630px;
    border: 1px solid #ff9933;
  }

  .infoblock__description {
    font-size: 17px;
  }


</style>

<script>
import LangSwitcher from './LangSwitcher.vue';

export default {
    components: {
      LangSwitcher
  },
}
</script>