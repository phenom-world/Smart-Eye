import React from 'react';

import { Button, Modal } from '@/components/ui';
import SuccessIcon from '@/components/ui/svg/success';
import { getFullName } from '@/lib';
import { UserResponse } from '@/types';

const SuccessModal = ({
  opened,
  onClose,
  caregiver,
  callback,
  onBack,
}: {
  opened: boolean;
  onClose: () => void;
  caregiver: UserResponse;
  callback: () => void;
  onBack?: () => void;
}) => {
  return (
    <Modal title="" open={opened} onClose={onClose} className="md:max-w-[480px]">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col justify-center items-center">
          <SuccessIcon />
          <p className="text-lg font-semibold leading-7 text-center text-[#101828] mt-5">
            {getFullName(caregiver?.firstName, caregiver?.lastName)} Added Successfully
          </p>
          <p className="text-sm font-normal leading-5 text-center text-[#475467] mt-2">
            You have successfully added caregiver and the login details have been sent to {caregiver?.email}.
          </p>
        </div>
        <div className="grid lg:grid-cols-2 gap-3">
          <Button variant="secondary" type="button" onClick={onBack}>
            Back
          </Button>
          <Button type="button" onClick={callback}>
            Add New Caregiver
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default SuccessModal;
