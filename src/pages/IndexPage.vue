<template>
  <q-page class="row items-center justify-evenly">
    <Start v-show="isStart" @start="changeStart" />
    <Workbench v-show="!isStart" />
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import Start from 'src/components/IndexPage/Start.vue';
import Workbench from 'src/components/IndexPage/Workbench.vue';

export default defineComponent({
  name: 'IndexPage',
  components: { Start, Workbench },
  setup() {
    const isStart = ref<boolean>(true);
    const changeStart = () => {
      isStart.value = !isStart.value;
    };
    return { isStart, changeStart };
  },
});
</script>
