import Image, { StaticImageData } from 'next/image';
import { CSSProperties, FC } from 'react';

type Props = {
  src: StaticImageData | string;
  alt: string;
  className?: string;
  imageClassName?: string;
  style?: CSSProperties;
  blurDataURL?: string;
  fill?: boolean;
  height?: number;
  width?: number;
  onError?: () => void;
};

export const StaticImage: FC<Props> = ({
  src,
  alt,
  className,
  imageClassName,
  blurDataURL,
  height = 100,
  width = 100,
  fill = true,
  onError,
  ...rest
}) => (
  <div className={`relative overflow-hidden ${className}`} {...rest}>
    <Image
      fill={fill}
      src={src}
      alt={alt}
      className={`image ${imageClassName}`}
      blurDataURL={blurDataURL}
      placeholder={typeof src === 'string' && !src.includes('http') ? 'empty' : 'blur'}
      sizes="100px"
      height={!fill ? height : 0}
      width={!fill ? width : 0}
      priority
      onError={onError}
    />
  </div>
);
