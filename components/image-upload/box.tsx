import { cn } from '@/lib';

import UploadIcon from '../ui/svg/upload';
import ImageUpload, { UploadValue } from './upload';

type Props = {
  callback?: (value: UploadValue) => void;
  rounded?: boolean;
  className?: string;
  defaultValue?: string | File;
  disabled?: boolean;
  center?: boolean;
};

const ImageUploader = ({ rounded, callback, className, disabled, center = true }: Props) => {
  const getUploadResult = (img: UploadValue) => {
    callback?.(img);
  };

  return (
    <ImageUpload onFinish={(value: UploadValue) => getUploadResult(value)} id="single-image" center={center} disabled={disabled}>
      <div
        className={cn(
          'relative rounded-xl border border-light-grey-outline dark:border-dark-grey-outline dark:bg-dark-bg-color h-[218px] w-[218px]',
          rounded && 'rounded-full',
          className
        )}
      >
        {!disabled && (
          <div className="absolute left-0 top-0 z-0 flex flex-col gap-3 h-full w-full items-center text-center justify-center text-xs text-[#475467]">
            <UploadIcon />
            <div>
              <p className="text-sm mb-1">
                <span className="text-[#1A41B7] font-semibold">Click to upload</span> or drag and drop
              </p>
              <p> PNG or JPG (144 x 32 px)</p>
            </div>
          </div>
        )}
      </div>
    </ImageUpload>
  );
};

export default ImageUploader;
