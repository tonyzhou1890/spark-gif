import { StringKeyObjType } from '../../types';
import * as imageUtils from './image';

const utils: StringKeyObjType = {
  ...imageUtils,
};

onmessage = (e) => {
  const { action, param, _sign } = e.data;
  if (typeof utils[action] === 'function') {
    const res = {
      action,
      result: utils[action](...(param ?? [])),
      _sign,
    };
    postMessage(res);
  } else {
    console.log(`action ${action} not found`);
  }
};
