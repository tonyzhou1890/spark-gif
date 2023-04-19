<template>
  <div class="workbench flex flex-column flex-content-center">
    <ul class="images tac">
      <li v-for="(item, index) in framesData" :key="item.id" class="image-item">
        <!-- <div class="top-actions-wrapper flex flex-content-between">
          <div class="action-item check-wrapper">
            <q-checkbox
              v-model="item.checked"
              keep-color
              color="primary"
            ></q-checkbox>
          </div>
          <div class="action-item close-wrapper">
            <q-icon
              :name="matClose"
              size="24px"
              class="text-primary close-icon cp"
              @click="() => handleDelete(index)"
            ></q-icon>
          </div>
        </div> -->
        <div
          class="image-content flex"
          :class="item.checked ? 'checked' : ''"
          @click="() => handleCheck(index)"
        >
          <img class="image-self" :src="item.base64" />
        </div>
        <div class="bottom-actions-wrapper">
          <div class="actions-row flex flex-content-between">
            <div class="action-item">
              <q-icon
                v-if="index"
                :name="matWest"
                size="24px"
                class="text-primary cp"
                @click="() => handleSwap(index, index - 1)"
              ></q-icon>
            </div>
            <div class="action-item">
              <q-icon
                v-if="index !== framesData.length - 1"
                :name="matEast"
                size="24px"
                class="text-primary cp"
                @click="() => handleSwap(index, index + 1)"
              ></q-icon>
            </div>
          </div>
          <div class="actions-row">
            <q-input
              outlined
              v-model.number="item.delay"
              type="number"
              maxlength="3"
              dense
              :placeholder="$t('delayPlaceholder')"
              :label="$t('delay')"
              :rules="[(val) => isEmpty(val) || val >= 0]"
            />
          </div>
        </div>
      </li>
      <li class="image-item upload-item">
        <!-- <div class="top-actions-wrapper"></div> -->
        <div class="image-content upload">
          <Upload
            :multiple="true"
            accept=".jpeg, .jpg, .png, .bmp, .webp, .gif"
            @on-change="handleGetFile"
            class="upload"
          >
            <div class="upload-block flex inline-flex">
              <q-icon :name="matAdd" size="5em" class="text-grey-5"></q-icon>
            </div>
          </Upload>
        </div>
        <div class="bottom-actions-wrapper"></div>
      </li>
    </ul>
    <IndexPageMenu />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Upload from '../Upload.vue';
import IndexPageMenu from './IndexPageMenu.vue';
import {
  matAdd,
  matClose,
  matWest,
  matEast,
} from '@quasar/extras/material-icons';
import { useQuasar } from 'quasar';
import { useCoreStore } from 'src/stores/core-store';
import { storeToRefs } from 'pinia';
import { imageFilesToFramesData } from '../../utils/image';
import { isEmpty } from 'src/utils/commom';

export default defineComponent({
  name: 'IndexPageStart',
  components: {
    Upload,
    IndexPageMenu,
  },
  setup(_, { emit }) {
    const $q = useQuasar();
    const coreStore = useCoreStore();
    // 帧图片列表
    const { framesData } = storeToRefs(coreStore);
    const { setFramesData } = coreStore;
    // 获取图片
    const handleGetFile = (files: Array<File>) => {
      $q.loading.show();
      imageFilesToFramesData(files)
        .then((data) => {
          console.log(data);
          data.map((item) => {
            item.id = Math.random().toString().substring(2);
            item.checked = false;
          });
          setFramesData([...framesData.value, ...data]);
        })
        .finally(() => {
          $q.loading.hide();
        });
      console.log(files);
      emit('start');
    };
    // 选择图片
    const handleCheck = (index: number) => {
      framesData.value[index].checked = !framesData.value[index].checked;
    };
    // 交换图片
    const handleSwap = (a: number, b: number) => {
      const temp = framesData.value[a];
      framesData.value[a] = framesData.value[b];
      framesData.value[b] = temp;
    };
    return {
      framesData,
      handleGetFile,
      handleCheck,
      handleSwap,
      // icons
      matAdd,
      matClose,
      matWest,
      matEast,
      isEmpty,
    };
  },
});
</script>

<style lang="scss" scoped>
.workbench {
  box-sizing: border-box;
  padding: 0;
  width: 100%;
  height: calc(100vh - 50px);
  .images {
    width: 100%;
    padding: 0 10px;
    overflow: auto;
    white-space: nowrap;
    margin: 0;
    list-style: none;
    .image-item {
      margin-right: 10px;
      display: inline-block;
      vertical-align: middle;
      .top-actions-wrapper {
        width: 150px;
        height: 30px;
        .close-icon {
          transform: translateX(4px);
        }
        &:deep(.q-checkbox) {
          &:not(.disabled):focus .q-checkbox__inner:before,
          &:not(.disabled):hover .q-checkbox__inner:before {
            content: none;
          }
          .q-checkbox__bg {
            left: 0;
          }
        }
      }
      .image-content {
        margin: 10px 0;
        border: 1px solid $grey-5;
        box-sizing: border-box;
        width: 150px;
        height: 150px;
        background-image: url('../../assets/images/empty-bg.png');
        &.checked {
          border-color: $primary;
          background-color: $secondary;
          box-shadow: 0 0 3px 3px $primary;
        }
      }
      .image-self {
        max-width: 100%;
        max-height: 100%;
      }
      .upload-block {
        width: 148px;
        height: 148px;
      }
      .bottom-actions-wrapper {
        width: 150px;
        height: 70px;
        .actions-row {
          margin-bottom: 5px;
        }
      }
      &.upload-item {
        margin-right: 0;
      }
    }
  }
}
</style>
