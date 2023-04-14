<template>
  <div class="menu-list flex">
    <div v-if="hasFrame" class="menus flex">
      <div class="menu-item" :title="$t('selectAll')">
        <q-icon
          :name="matSelectAll"
          size="30px"
          color="primary cp"
          @click="handleToggleSelect"
        ></q-icon>
      </div>
      <div
        v-if="hasMoreThanOneCheckedFrames"
        class="menu-item"
        :title="$t('shuffle')"
      >
        <q-icon
          :name="matShuffle"
          size="30px"
          color="primary cp"
          @click="handleShuffle"
        ></q-icon>
      </div>
      <div v-if="hasCheckedFrame" class="menu-item" :title="$t('split')">
        <q-icon
          :name="matContentCut"
          size="30px"
          color="primary cp"
          @click="handleSplit"
        ></q-icon>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import {
  matSelectAll,
  matShuffle,
  matContentCut,
  matSave,
} from '@quasar/extras/material-icons';
import { useCoreStore } from 'src/stores/core-store';
import { storeToRefs } from 'pinia';
import { shuffle } from '../../utils/commom';
import { FrameData } from '../../types';

export default defineComponent({
  name: 'IndexPageMenu',
  setup() {
    const coreStore = useCoreStore();
    const { framesData } = storeToRefs(coreStore);
    const hasFrame = computed(() => !!framesData.value.length);
    const checkedFrames = computed(() =>
      framesData.value.filter((item) => item.checked)
    );
    const hasCheckedFrame = computed(() => !!checkedFrames.value.length);
    const hasMoreThanOneCheckedFrames = computed(
      () => checkedFrames.value.length > 1
    );

    const handleToggleSelect = () => {
      if (framesData.value.some((item) => item.checked)) {
        framesData.value.map((item) => {
          item.checked = false;
        });
      } else {
        framesData.value.map((item) => {
          item.checked = true;
        });
      }
    };

    const handleShuffle = () => {
      if (hasMoreThanOneCheckedFrames.value) {
        const indices: Array<number> = [];
        let frames: Array<FrameData> = [];
        framesData.value.forEach((item, index) => {
          if (item.checked) {
            indices.push(index);
            frames.push(item);
          }
        });
        frames = shuffle(frames);
        indices.forEach((index, idx) => {
          framesData.value[index] = frames[idx];
        });
      }
    };

    const handleSplit = () => {
      console.log('handleSplit');
    };

    return {
      hasFrame,
      hasCheckedFrame,
      hasMoreThanOneCheckedFrames,
      matSelectAll,
      matShuffle,
      matContentCut,
      matSave,
      handleToggleSelect,
      handleShuffle,
      handleSplit,
    };
  },
});
</script>

<style lang="scss" scoped>
.menu-list {
  height: 60px;
  .menus {
    .menu-item {
      margin-right: 10px;
      &:last-child {
        margin-right: 0;
      }
    }
  }
}
</style>
