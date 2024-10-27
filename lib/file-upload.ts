import toast from 'react-hot-toast';

import { ALLOWED_CONTENT_TYPES } from '@/constants';

import { uploadMedia } from './s3Client';
import { generateUUID } from './utils';

type MediaGroup = 'profile' | 'documents';

const getFileMeta = (file: File, ext?: string) => {
  const fileName = file.name;
  const extension = fileName?.split('.').pop() || ext;
  return { extension, mimeType: file.type };
};

const uploadFile = async (file: File, group: MediaGroup, ext?: string) => {
  const myUUID = generateUUID();
  const meta = getFileMeta(file, ext);
  const mediaId = `${group}/${myUUID}.${meta.extension}`;
  const newFile = new File([file], group, { type: meta.mimeType });

  if (!ALLOWED_CONTENT_TYPES.includes(meta.mimeType)) {
    toast.error('Invalid file type');
  }

  if (!mediaId || !meta.mimeType) {
    toast.error('Missing file or file type');
  }

  try {
    await uploadMedia(newFile, mediaId);
    return { mediaId, success: true };
  } catch (error) {
    toast.error(error?.response?.data?.message ?? error?.message ?? 'Error uploading file');
    return { success: false };
  }
};

export { getFileMeta, uploadFile };
