<template>
  <q-dialog v-model="show">
    <q-card class="card">
      <div v-if="checkedFrame" class="frame-info">
        <div class="image-content flex">
          <img class="image-self" :src="checkedFrame.base64" alt="" />
        </div>
        <div class="image-info">
          <p class="image-info-text">
            <span class="label">{{ $t('width') }}: </span>
            <span class="value">{{
              checkedFrame.imageData.width + $t('px')
            }}</span>
          </p>
          <p class="image-info-text">
            <span class="label">{{ $t('height') }}: </span>
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
      <q-form v-if="checkedFrame" @submit="onSubmit" class="q-gutter-md">
        <template v-if="isPixel">
          <q-input
            filled
            type="number"
            v-model.number="width"
            dense
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
            v-model.number="height"
            dense
            :label="$t('height')"
            lazy-rules
            :rules="[
              (val) =>
                (val > 0 && val <= checkedFrame.imageData.height) ||
                `${$t('numberRangeLimit')}1~${checkedFrame.imageData.height}`,
            ]"
          />
        </template>

        <template v-else>
          <q-input
            filled
            type="number"
            v-model.number="hBlocks"
            dense
            :label="$t('splitDialog.hBlocks')"
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
            v-model.number="vBlocks"
            dense
            :label="$t('splitDialog.vBlocks')"
            lazy-rules
            :rules="[
              (val) =>
                (val > 0 && val <= checkedFrame.imageData.height) ||
                `${$t('numberRangeLimit')}1~${checkedFrame.imageData.height}`,
            ]"
          />
        </template>

        <q-toggle v-model="center" :label="$t('splitDialog.adjustToCenter')" />

        <div class="btns tac">
          <q-btn :label="$t('confirm')" type="submit" color="primary" />
          <q-btn
            :label="$t('cancel')"
            type="reset"
            color="primary"
            @click="() => onClose()"
            flat
            class="q-ml-sm"
          />
        </div>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { ref, defineComponent, computed } from 'vue';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useCoreStore } from 'src/stores/core-store';
import { storeToRefs } from 'pinia';
import worker from '../../utils/worker';
import { FrameData } from '../../types';
import { imageDataToBase64 } from 'src/utils/image';

export default defineComponent({
  name: 'SplitDialog',
  setup() {
    const $q = useQuasar();
    const { t } = useI18n();

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
      hBlocks.value = null;
      vBlocks.value = null;
      show.value = false;
    };

    const onSubmit = () => {
      const image = checkedFrame.value.imageData;
      // calc bolock num and check it
      let blockNum = 0;
      let w = Number(width.value),
        h = Number(height.value),
        hNum = Number(hBlocks.value),
        vNum = Number(vBlocks.value);
      if (isPixel.value) {
        blockNum = Math.ceil(image.width / w) * Math.ceil(image.height / h);
      } else {
        blockNum = hNum * vNum;
      }
      if (blockNum > 1000) {
        $q.notify({
          message: t('splitDialog.tooMoreSubimages') + '1000',
          position: 'top',
        });
        return;
      }
      onClose();
      // split

      $q.loading.show();
      if (!isPixel.value) {
        w = Math.ceil(image.width / hNum);
        h = Math.ceil(image.height / vNum);
      }
      worker({
        action: 'imageSplit',
        param: [[image], w, h, center.value],
      }).then((data) => {
        const frames: Array<FrameData> = (data as Array<ImageData>).map(
          (item) => {
            return {
              id: Math.random().toString().substring(2),
              imageData: item,
              base64: imageDataToBase64(item),
              checked: true,
              setLocalColorTable: true,
            };
          }
        );
        const idx = framesData.value.findIndex(
          (val) => val.id === checkedFrame.value.id
        );
        framesData.value.splice(idx, 1, ...frames);

        $q.loading.hide();
      });
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
.card {
  padding: 15px;
  .image-content {
    margin: 10px auto;
    border: 1px solid $grey-5;
    box-sizing: border-box;
    width: 150px;
    height: 150px;
    background-image: url('../../assets/images/empty-bg.png');
  }
  .image-self {
    max-width: 100%;
    max-height: 100%;
  }
  .btns {
    padding-top: 10px;
  }
}
</style>
