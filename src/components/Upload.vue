<template>
  <div class="c-upload">
    <div class="c-upload__inner" @click="handleClick">
      <slot />
      <input
        type="file"
        class="c-upload__input"
        ref="input"
        @change="handleChange"
        :multiple="multiple"
        :accept="accept"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'IndexPageStart',
  props: {
    multiple: {
      type: Boolean,
      default: false,
    },
    accept: {
      type: String,
      default: '',
    },
    onChange: {
      type: Function,
      default: () => {
        return null;
      },
    },
  },
  setup(props, { emit }) {
    const input = ref(null);

    const handleClick = () => {
      if (input.value) {
        const dom = input.value as HTMLInputElement;
        dom.value = '';
        dom.click();
      }
    };

    const handleChange = (e: Event) => {
      emit('on-change', (e.target as HTMLInputElement).files);
    };

    return {
      input,
      handleClick,
      handleChange,
      ...props,
    };
  },
});
</script>

<style lang="scss">
.c-upload {
  display: inline-block;
}
.c-upload__inner {
  display: inline-block;
}
.c-upload__input {
  display: none;
}
</style>
