<template>
  <div class="start tac">
    <h1 class="page-title bold">Spark GIF</h1>
    <div class="start-desc">
      <p class="desc-1">{{ $t('startDesc1') }}</p>
      <p class="desc-2 text-grey-7">{{ $t('startDesc2') }}</p>
    </div>
    <q-btn @click="handleStart" color="primary">{{ $t('startBtn') }}</q-btn>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'IndexPageStart',
  setup(_, { emit }) {
    const handleStart = () => {
      emit('start');
    };
    return {
      handleStart,
    };
  },
});
</script>

<style lang="scss" scoped>
.start {
  box-sizing: border-box;
  padding: 0 5vw 20vh;
  .page-title {
    margin: 1rem 0;
    font-size: 4rem;
  }
}
</style>
