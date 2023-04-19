<template>
  <q-dialog v-model="show">
    <q-card class="card">
      <q-tabs
        v-model="tab"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
      >
        <q-tab name="gif" :label="$t('saveDialog.asGif')" />
        <q-tab name="sprite" :label="$t('saveDialog.asSprite')" />
      </q-tabs>

      <q-separator />
      <q-form @submit="onSubmit" class="q-gutter-md">
        <template v-if="isGif">
          <q-input
            filled
            type="number"
            v-model.number="delay"
            :label="$t('saveDialog.unspecifiedDelay')"
            :placeholder="$t('delayPlaceholder')"
            lazy-rules
            dense
            :rules="[(val) => val >= 0]"
          />

          <q-select
            v-model="disposal"
            :options="disposalMethods"
            :label="$t('disposalMethod.disposalMethod')"
            dense
            filled
            emit-value
            map-options
            options-dense
          ></q-select>
        </template>

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
import { download, isEmpty } from 'src/utils/commom';
import { imagesToSingleBlob, imagesToGif } from 'src/utils/image';

export default defineComponent({
  name: 'SaveDialog',
  setup() {
    const $q = useQuasar();
    const { t } = useI18n();

    const show = ref(false);

    const open = () => {
      show.value = true;
    };

    const tab = ref('gif');

    const isGif = computed(() => tab.value === 'gif');

    const coreStore = useCoreStore();
    const { framesData } = storeToRefs(coreStore);
    const checkedFrame = computed(() => {
      return framesData.value.filter((item) => item.checked)?.[0];
    });

    const delay = ref(10);
    const disposal = ref(1);

    const disposalMethods = computed(() => {
      return [
        {
          value: 1,
          label: t('disposalMethod.keep'),
        },
        {
          value: 3,
          label: t('disposalMethod.discard'),
        },
      ];
    });

    const onClose = () => {
      show.value = false;
      console.log(show);
    };

    const onSubmit = () => {
      $q.loading.show();
      onClose();

      if (isGif.value) {
        const frames = framesData.value.map((item) => {
          const temp = { ...item };
          if (isEmpty(temp.delay)) {
            temp.delay = delay.value;
          }
          (temp.delay as number) *= 10;
          temp.disposalMethod = disposal.value;
          return temp;
        });
        console.log('frames: ', frames);
        imagesToGif(frames)
          .then((data) => {
            const blob = new Blob([data], {
              type: 'image/gif',
            });
            download(blob);
          })
          .finally(() => {
            $q.loading.hide();
          });
      } else {
        imagesToSingleBlob(framesData.value)
          .then((data) => {
            if (data) {
              download(data);
            }
          })
          .finally(() => {
            $q.loading.hide();
          });
      }
    };

    return {
      show,
      open,
      tab,
      isGif,
      checkedFrame,
      delay,
      disposal,
      disposalMethods,
      onClose,
      onSubmit,
    };
  },
});
</script>

<style lang="scss" scoped>
.card {
  padding: 15px;
  .btns {
    padding-top: 10px;
  }
}
</style>
