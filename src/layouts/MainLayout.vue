<template>
  <q-layout view="lHh Lpr lFf" class="layout">
    <q-header elevated class="header">
      <q-toolbar>
        <q-toolbar-title> Spark GIF </q-toolbar-title>

        <q-select
          class="lang-select"
          v-model="locale"
          :options="localeOptions"
          :label="$t('lang')"
          dense
          borderless
          emit-value
          map-options
          options-dense
          style="min-width: 100px"
        ></q-select>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'MainLayout',

  components: {},

  setup() {
    const { locale } = useI18n({ useScope: 'global' });
    return {
      locale,
      localeOptions: [
        {
          value: 'zh-CN',
          label: '简体中文',
        },
        {
          value: 'en-US',
          label: 'English',
        },
      ],
    };
  },
});
</script>

<style lang="scss" scoped>
.layout {
  .header {
    .lang-select {
      :deep(.q-field__inner) {
        .q-field__label,
        .q-field__native,
        .q-field__prefix,
        .q-field__suffix,
        .q-field__input,
        .q-field__marginal {
          color: white !important;
        }
      }
    }
  }
}
</style>
