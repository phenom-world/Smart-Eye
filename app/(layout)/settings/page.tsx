'use client';
import { CheckedInMethod, Provider } from '@prisma/client';
import { useTheme } from 'next-themes';
import React, { useEffect, useState } from 'react';
import { mutate } from 'swr';

import AppLoader from '@/components/app-loader';
import { Shell } from '@/components/data-table';
import { ImageUploadBox } from '@/components/image-upload';
import { UploadValue } from '@/components/image-upload/upload';
import { StaticImage } from '@/components/static-image';
import { Button, Input, RadioGroup, RadioGroupItem } from '@/components/ui';
import CheckedIcon from '@/components/ui/svg/checked';
import { themes } from '@/constants';
import { useAuth } from '@/context/AuthContext';
import { useGetProvider, useUpdateProvider } from '@/hooks/request/provider';
import { uploadFile } from '@/lib';
import blurDataUrl from '@/lib/generateBlurPlaceholder';
import { getObjectURL } from '@/lib/s3Client';

const Settings = () => {
  const { user } = useAuth();
  const { setTheme } = useTheme();
  const [imageUrl, setImageUrl] = useState<string>();
  const [provider, setProvider] = useState<Partial<Provider>>();
  const { trigger, isMutating } = useUpdateProvider({
    onSuccess: () => {
      mutate('/api/user/me');
      setTheme(themes.find((item) => item.color === provider?.theme)?.theme ?? 'light');
    },
  });

  const { isLoading, data: providerData } = useGetProvider(user?.provider.cuid);
  const [value, setValue] = useState<UploadValue | null>(null);
  const [spinner, setSpinner] = useState(false);

  useEffect(() => {
    setProvider({
      name: user?.provider?.name,
      theme: user?.provider?.theme,
      checkedinMethod: user?.provider?.checkedinMethod,
    });
  }, [user?.provider?.name, user?.provider?.theme, user?.provider?.checkedinMethod]);

  const onSaveChanges = async () => {
    let mediaId;
    if (value?.preview) {
      setSpinner(true);
      const response = await uploadFile(value?.value as File, 'profile');
      mediaId = response?.mediaId as string;
      setSpinner(false);
      if (!response?.success) return;
    }
    trigger({ theme: provider?.theme, name: provider?.name, logoId: mediaId, checkedinMethod: provider?.checkedinMethod });
  };

  useEffect(() => {
    if (providerData?.data?.logo?.mediaId) {
      getObjectURL(providerData?.data?.logo?.mediaId).then((item) => setImageUrl(item));
    }
  }, [providerData?.data?.logo?.mediaId]);

  return (
    <Shell>
      <AppLoader loading={isLoading} />
      <div>
        <p className="text-[#101828] text-xl leading-7 md:text-[30px] md:leading-[38px] font-semibold">Settings</p>
        <div className="pb-5 border-b border-[#EAECF0] mt-4 md:mt-8">
          <p className="text-lg text-[#101828] leading-7 font-semibold">Company Details</p>
          <p className="text-sm text-[#475467] leading-5 font-normal">Update your company details here.</p>
        </div>

        <div className="flex flex-col w-full lg:flex-row items-start gap-4 lg:gap-8 pt-6 pb-5 border-b border-[#EAECF0]">
          <p className="text-sm text-[#344054] leading-5 font-medium xl:w-[280px]">Company Name</p>
          <div className="w-full lg:w-[512px]">
            <Input
              className="w-full"
              placeholder="Mill Contracting"
              value={provider?.name ?? ''}
              onChange={(e) => setProvider({ ...provider, name: e.target.value })}
            />
          </div>
        </div>
        <div className="flex flex-col w-full lg:flex-row items-start gap-4 lg:gap-8 pt-6 pb-5 border-b border-[#EAECF0]">
          <p className="text-sm text-[#344054] leading-5 font-medium xl:w-[280px]">Checked-in method</p>
          <div className="w-full lg:w-[512px]">
            <RadioGroup
              onValueChange={(value) => setProvider({ ...provider, checkedinMethod: value as CheckedInMethod })}
              defaultValue={provider?.checkedinMethod ?? ''}
              value={provider?.checkedinMethod ?? ''}
              className="flex gap-4 flex-wrap"
            >
              {Object.values(CheckedInMethod).map((item) => (
                <div key={item} className="flex items-center gap-3 space-y-0">
                  <RadioGroupItem value={item} id={item} onChange={() => setProvider({ ...provider, checkedinMethod: item })} />
                  <label className="font-normal" htmlFor={item}>
                    {item}
                  </label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>
        <div className="flex w-full flex-col lg:flex-row items-start gap-4 lg:gap-8 py-5 border-b border-[#EAECF0]">
          <p className="text-sm text-[#344054] leading-5 font-medium xl:w-[280px]">Company logo</p>
          <div className="w-full lg:w-[512px] gap-4 sm:gap-8 flex flex-col md:flex-row items-center md:items-start ">
            <StaticImage
              src={(value?.preview as string) ?? imageUrl ?? '/images/avatar-2.png'}
              alt="settings"
              imageClassName="object-cover"
              className="h-[64px] w-[64px] rounded-full"
              onError={() => setImageUrl(undefined)}
              blurDataURL={blurDataUrl()}
            />
            <div className="w-full flex-1">
              <ImageUploadBox
                className="w-full h-[126px]"
                callback={(value) => {
                  setValue(value);
                }}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row items-start gap-4 lg:gap-8 py-5 border-b border-[#EAECF0]">
          <p className="text-sm text-[#344054] leading-5 font-medium xl:w-[280px]">Theme Colour</p>
          <div className="flex items-center gap-4">
            {themes.map((item) => (
              <div
                key={item.theme}
                className="w-10 h-10 flex justify-center items-center rounded-full cursor-pointer"
                style={{ backgroundColor: item.color }}
                onClick={() => {
                  setProvider({ ...provider, theme: item.color });
                }}
              >
                {provider?.theme === item.color && <CheckedIcon />}
              </div>
            ))}
          </div>
        </div>
        <div className="w-full flex flex-col sm:flex-row justify-end gap-3 mt-5">
          <Button variant="secondary" type="button" className="px-[63px]">
            Cancel
          </Button>
          <Button className="!px-[39px]" loading={isMutating || spinner} onClick={onSaveChanges}>
            Save Changes
          </Button>
        </div>
      </div>
    </Shell>
  );
};

export default Settings;
