export interface FrameData {
  id?: string;
  checked?: boolean;
  delay?: number;
  disposalMethod?: number;
  setLocalColorTable?: boolean;
  imageData: ImageData;
  base64: string;
}

/**
 * string key object
 */
export interface StringKeyObjType {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [x: string]: any;
}

/**
 * worker job type
 */
export interface WorkerJobType {
  action: string;
  param?: Array<unknown>;
  transferable?: Transferable[];
}

/**
 * worker job wrap type
 */
export interface WorkerJobWrapType {
  _sign: number;
  job: WorkerJobType;
  p: {
    resolve: (value: unknown) => void;
    reject: (value: unknown) => void;
  };
}

export interface Point {
  x: number;
  y: number;
}
