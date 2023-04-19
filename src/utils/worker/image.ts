/**
 * copy image
 */
export function imageCopy(
  source: ImageData,
  x: number,
  y: number,
  width: number,
  height: number
): ImageData {
  width = Math.min(x + width, source.width) - x;
  height = Math.min(y + height, source.height) - y;

  if (x === 0 && width === source.width) {
    const idx = (y * source.width + x) * 4;
    return new ImageData(
      source.data.slice(idx, idx + width * height * 4),
      width,
      height
    );
  } else {
    const data = new ImageData(width, height);
    for (let i = 0; i < height; i++) {
      data.data.set(
        source.data.slice(
          ((i + y) * source.width + x) * 4,
          ((i + y) * source.width + x + width) * 4
        ),
        width * i * 4
      );
    }
    return data;
  }
}

/**
 * paste image
 */
export function imagePaste(
  source: ImageData,
  target: ImageData,
  x: number,
  y: number
): ImageData {
  const width = Math.min(target.width, source.width + x) - x;
  const height = Math.min(target.height, source.height + y) - y;

  for (let i = 0; i < height; i++) {
    target.data.set(
      source.data.slice(i * source.width * 4, (i * source.width + width) * 4),
      ((i + y) * target.width + x) * 4
    );
  }

  return target;
}

/**
 * split image to subimages
 * @param source
 * @param subWidth width of subimage
 * @param subHeight height of subimage
 * @param center if adjust subimage to center of new image (same size as source)
 */
export function imageSplit(
  source: Array<ImageData>,
  subWidth: number,
  subHeight: number,
  center: boolean
): Array<ImageData> {
  const subImages: Array<ImageData> = [];

  source.forEach((image) => {
    const hBlocks = Math.ceil(image.width / subWidth);
    const vBlocks = Math.ceil(image.height / subHeight);
    const padWidth = hBlocks * subWidth;
    const padHeight = vBlocks * subHeight;
    const padImage = new ImageData(padWidth, padHeight);
    imagePaste(image, padImage, 0, 0);

    for (let y = 0; y < vBlocks; y++) {
      for (let x = 0; x < hBlocks; x++) {
        const subImage = imageCopy(
          padImage,
          x * subWidth,
          y * subHeight,
          subWidth,
          subHeight
        );
        if (center) {
          subImages.push(
            subImage
            // imagePaste(
            //   subImage,
            //   new ImageData(image.width, image.height),
            //   ((image.width - subWidth) / 2) >> 0,
            //   ((image.height - subHeight) / 2) >> 0
            // )
          );
        } else {
          subImages.push(
            imagePaste(
              subImage,
              new ImageData(image.width, image.height),
              x * subWidth,
              y * subHeight
            )
          );
        }
      }
    }
  });

  return subImages;
}
