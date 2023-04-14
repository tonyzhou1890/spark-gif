import { defineStore } from 'pinia';
import { FrameData } from 'src/types';

export const useCoreStore = defineStore('core', {
  state: () => ({
    framesData: [] as Array<FrameData>,
  }),
  getters: {},
  actions: {
    setFramesData(data: Array<FrameData>) {
      this.framesData = data;
    },
  },
});
