<template>
  <q-dialog v-model="show">
    <div v-if="checkedFrame" class="frame-info">
      <div class="frame-image">
        <img :src="checkedFrame.base64" alt="" />
      </div>
      <div class="image-info">
        <p class="image-info-text">
          <span class="label">{{ $t('width') }}:</span>
          <span class="value">{{
            checkedFrame.imageData.width + $t('px')
          }}</span>
        </p>
        <p class="image-info-text">
          <span class="label">{{ $t('height') }}:</span>
          <span class="value">{{
            checkedFrame.imageData.height + $t('px')
          }}</span>
        </p>
      </div>
    </div>

    <q-separator />

    <q-tabs
      v-model="tab"
      dense
      class="text-grey"
      active-color="primary"
      indicator-color="primary"
      align="justify"
      narrow-indicator
    >
      <q-tab name="pixel" :label="$t('splitDialog.byPixel')" />
      <q-tab name="block" :label="$t('splitDialog.byBlock')" />
    </q-tabs>

    <q-separator />
    <q-form v-if="checkedFrame" @submit="onSubmit" dense class="q-gutter-md">
      <template v-if="isPixel">
        <q-input
          filled
          type="number"
          v-model="width"
          :label="$t('width')"
          lazy-rules
          :rules="[
            (val) =>
              (val > 0 && val <= checkedFrame.imageData.width) ||
              `${$t('numberRangeLimit')}1~${checkedFrame.imageData.width}`,
          ]"
        />

        <q-input
          filled
          type="number"
          v-model="height"
          :label="$t('height')"
          lazy-rules
          :rules="[
            (val) =>
              (val > 0 && val <= checkedFrame.imageData.height) ||
              `${$t('numberRangeLimit')}1~${checkedFrame.imageData.height}`,
          ]"
        />
      </template>

      <q-toggle v-model="center" :label="$t('splitDialog.adjustToCenter')" />

      <div class="tac">
        <q-btn label="Submit" type="submit" color="primary" />
        <q-btn
          label="Reset"
          type="reset"
          color="primary"
          @click="() => onClose"
          flat
          class="q-ml-sm"
        />
      </div>
    </q-form>
  </q-dialog>
</template>

<script lang="ts">
import { ref, defineComponent, computed } from 'vue';
import { useCoreStore } from 'src/stores/core-store';
import { storeToRefs } from 'pinia';

export default defineComponent({
  name: 'SplitDialog',
  setup() {
    const show = ref(false);

    const open = () => {
      show.value = true;
    };

    const tab = ref('pixel');

    const isPixel = computed(() => tab.value === 'pixel');

    const coreStore = useCoreStore();
    const { framesData } = storeToRefs(coreStore);
    const checkedFrame = computed(() => {
      return framesData.value.filter((item) => item.checked)?.[0];
    });

    const width = ref(null);
    const height = ref(null);
    const hBlocks = ref(null);
    const vBlocks = ref(null);
    const center = ref(false);

    const onClose = () => {
      width.value = null;
      height.value = null;

      show.value = false;
    };

    const onSubmit = () => {
      console.log('su');
    };

    return {
      show,
      open,
      tab,
      isPixel,
      checkedFrame,
      width,
      height,
      hBlocks,
      vBlocks,
      center,
      onClose,
      onSubmit,
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
