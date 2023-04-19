<template>
  <div class="menu-list">
    <div v-if="hasFrame" class="menus tac ova">
      <div
        class="menu-item cp"
        :title="$t('selectAll')"
        @click="handleToggleSelect"
      >
        <q-icon :name="matSelectAll" size="30px" color="primary"></q-icon>
        <p class="text-primary text-subtitle2">{{ $t('selectAll') }}</p>
      </div>
      <div
        v-if="hasMoreThanOneCheckedFrames"
        class="menu-item cp"
        :title="$t('shuffle')"
        @click="handleShuffle"
      >
        <q-icon :name="matShuffle" size="30px" color="primary"></q-icon>
        <p class="text-primary text-subtitle2">{{ $t('shuffle') }}</p>
      </div>
      <div
        v-if="hasCheckedFrame && !hasMoreThanOneCheckedFrames"
        class="menu-item cp"
        :title="$t('split')"
        @click="handleSplit"
      >
        <q-icon :name="matContentCut" size="30px" color="primary"></q-icon>
        <p class="text-primary text-subtitle2">{{ $t('split') }}</p>
      </div>
      <div
        v-if="hasCheckedFrame"
        class="menu-item cp"
        :title="$t('delete')"
        @click="() => handleDelete()"
      >
        <q-icon :name="matClose" size="30px" color="primary"></q-icon>
        <p class="text-primary text-subtitle2">{{ $t('delete') }}</p>
      </div>
      <div class="menu-item cp" :title="$t('save')" @click="handleSave">
        <q-icon :name="matSave" size="30px" color="primary"></q-icon>
        <p class="text-primary text-subtitle2">{{ $t('save') }}</p>
      </div>
    </div>
  </div>

  <split-dialog ref="splitDialog" />

  <save-dialog ref="saveDialog" />
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import SplitDialog from './SplitDialog.vue';
import SaveDialog from './SaveDialog.vue';
import {
  matSelectAll,
  matShuffle,
  matContentCut,
  matClose,
  matSave,
} from '@quasar/extras/material-icons';
import { useCoreStore } from 'src/stores/core-store';
import { storeToRefs } from 'pinia';
import { shuffle } from '../../utils/commom';
import { FrameData } from '../../types';

export default defineComponent({
  name: 'IndexPageMenu',
  components: {
    SplitDialog,
    SaveDialog,
  },
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

    const splitDialog = ref(null);

    const handleSplit = () => {
      console.log('handleSplit');
      if (splitDialog.value) {
        (splitDialog.value as typeof SplitDialog)?.open();
      }
    };

    // 删除图片
    const handleDelete = () => {
      framesData.value = framesData.value.filter((item) => !item.checked);
    };

    const saveDialog = ref(null);

    const handleSave = () => {
      if (saveDialog.value) {
        (saveDialog.value as typeof SaveDialog)?.open();
      }
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
      splitDialog,
      handleSplit,
      matClose,
      handleDelete,
      saveDialog,
      handleSave,
    };
  },
});
</script>

<style lang="scss" scoped>
.menu-list {
  height: 80px;
  box-sizing: border-box;
  padding-top: 20px;
  .menus {
    .menu-item {
      margin-right: 10px;
      text-align: center;
      display: inline-block;
      width: 80px;
      &:last-child {
        margin-right: 0;
      }
      .text-subtitle2 {
        margin-bottom: 0;
      }
    }
  }
}
</style>
