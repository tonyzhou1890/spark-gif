import { FrameData, Point } from 'src/types';
import { decode, build, getCompositedFramesImageData } from 'amazing-gif';

const gCanvas = document.createElement('canvas');
const gCtx = gCanvas.getContext('2d') as CanvasRenderingContext2D;

/**
 * imageFilesToFramesData
 * @param files
 * @returns
 */
export function imageFilesToFramesData(
  files: Array<File>
): Promise<Array<FrameData>> {
  const frames: Array<Array<FrameData>> = [];
  return new Promise((resolve) => {
    let decodeCount = 0;
    let failedCount = 0;
    [].forEach.call(files, (item, index) => {
      fileToFramesData(item)
        .then((data: Array<FrameData>) => {
          frames[index] = data;
        })
        .catch(() => {
          failedCount++;
        })
        .finally(() => {
          decodeCount++;
          if (decodeCount === files.length) {
            console.log('image files failed count: ', failedCount);
            resolve(frames.flat());
          }
        });
    });
  });
}

/**
 * fileToBase64
 * @param file
 * @returns
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const read = new FileReader();
    read.onload = () => {
      resolve(read.result as string);
    };
    read.onerror = (e) => {
      reject(e);
    };
    read.readAsDataURL(file);
  });
}

/**
 * fileToBuffer
 * @param file
 * @returns
 */
export function fileToBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const read = new FileReader();
    read.onload = () => {
      resolve(read.result as ArrayBuffer);
    };
    read.onerror = (e) => {
      reject(e);
    };
    read.readAsArrayBuffer(file);
  });
}

/**
 * imageDataToBase64
 * @param imageData
 * @returns
 */
export function imageDataToBase64(imageData: ImageData): string {
  gCtx.save();
  gCanvas.width = imageData.width;
  gCanvas.height = imageData.height;
  gCtx.putImageData(imageData, 0, 0);
  const base64 = gCanvas.toDataURL();
  gCtx.restore();
  return base64;
}

/**
 * base64ToImageData
 * @param base64
 * @returns
 */
export function base64ToImageData(base64: string): Promise<ImageData> {
  const image = new Image();
  image.src = base64;

  return new Promise((resolve) => {
    image.onload = () => {
      gCtx.save();

      gCanvas.width = image.width;
      gCanvas.height = image.height;
      gCtx.drawImage(image, 0, 0);
      const imageData = gCtx.getImageData(0, 0, image.width, image.height);

      gCtx.restore();

      resolve(imageData);
    };
  });
}

/**
 * fileToFramesData
 * @param file
 * @returns
 */
export function fileToFramesData(file: File): Promise<Array<FrameData>> {
  return new Promise((resolve, reject) => {
    if (file.type === 'image/gif') {
      fileToBuffer(file).then((data) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        decode(data, (e: string) => {
          reject(e);
          return undefined;
        })
          .then((gifData) => {
            if (gifData) {
              const frames = getCompositedFramesImageData(gifData);
              resolve(
                frames.map((item, index) => {
                  return {
                    base64: imageDataToBase64(item),
                    imageData: item,
                    delay: Math.round(gifData.frames[index].delay / 10),
                  };
                })
              );
            } else {
              reject();
            }
          })
          .catch((e) => {
            reject(e);
          });
      });
    } else {
      fileToBase64(file)
        .then((base64) => {
          base64ToImageData(base64)
            .then((imageData) => {
              resolve([
                {
                  base64,
                  imageData,
                },
              ]);
            })
            .catch((e) => reject(e));
        })
        .catch((e) => reject(e));
    }
  });
}

/**
 * images to gif buffer
 * @param images
 * @returns
 */
export function imagesToGif(images: Array<FrameData>): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    build({
      repetition: 0,
      frames: images,
    })
      .then((data) => {
        resolve(data);
      })
      .catch((e) => {
        reject(e);
      });
  });
}

/**
 * get max width and max height
 */
export function getMaxImageSize(...args: Array<ImageData>): Point {
  return {
    x: Math.max(...args.map((item) => item.width)),
    y: Math.max(...args.map((item) => item.height)),
  };
}

export function imagesToSingleBlob(
  images: Array<FrameData>,
  type?: string,
  quality?: number
): Promise<Blob | null> {
  const size = getMaxImageSize(...images.map((item) => item.imageData));
  const col = Math.min(5, images.length);
  const row = Math.ceil(images.length / 5);
  const canvasWidth = size.x * col;
  const canvasHeight = size.y * row;

  gCtx.save();

  gCanvas.width = canvasWidth;
  gCanvas.height = canvasHeight;

  for (let y = 0; y < row; y++) {
    for (let x = 0; x < col; x++) {
      const image = images[y * col + x];
      if (image) {
        gCtx.putImageData(
          image.imageData,
          x * size.x + (((size.x - image.imageData.width) / 2) >> 0),
          y * size.y + (((size.y - image.imageData.height) / 2) >> 0)
        );
      }
    }
  }

  return new Promise((resolve) => {
    gCanvas.toBlob(
      (blob) => {
        gCtx.restore();
        resolve(blob);
      },
      type,
      quality
    );
  });
}
