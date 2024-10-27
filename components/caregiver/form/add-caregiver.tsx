import { zodResolver } from '@hookform/resolvers/zod';
import { Gender, User } from '@prisma/client';
import React from 'react';
import { useForm } from 'react-hook-form';

import { Button, Checkbox, DateInput, Form, FormField, FormRender, Input, Modal, SelectInput } from '@/components/ui';
import EditIcon from '@/components/ui/svg/editIcon';
import { useCreateUser, useDisclosure, usePopulateForm, useUpdateUser } from '@/hooks';
import { getFullName } from '@/lib';
import { caregiverDefaultValue, CaregiverForm, caregiverSchema } from '@/schema/caregiver';
import { UserResponse } from '@/types';

import SuccessModal from '../modal/success';

const AddCaregiver = ({
  defaultValues,
  opened,
  onClose,
  onSuccessCallback,
  action,
  setAction,
}: {
  opened: boolean;
  onClose: () => void;
  onSuccessCallback: () => void;
  defaultValues: UserResponse;
  action: string;
  setAction: (action: string) => void;
}) => {
  const { opened: openedSuccess, onOpen: onOpenSuccess, onClose: onCloseSuccess } = useDisclosure();
  const methods = useForm<CaregiverForm>({
    resolver: zodResolver(caregiverSchema),
    defaultValues: caregiverDefaultValue,
    mode: 'onChange',
    shouldUnregister: false,
  });

  const onCloseModal = () => {
    methods.reset(caregiverDefaultValue);
    onClose();
    onCloseSuccess();
  };

  const { trigger, isMutating, data } = useCreateUser({
    noToast: true,
    onSuccess: () => {
      onOpenSuccess();
      onSuccessCallback();
    },
  });
  const { trigger: triggerUpdate, isMutating: isMutatingUpdate } = useUpdateUser({
    onSuccess: () => {
      onSuccessCallback();
      onCloseModal();
    },
  });

  usePopulateForm<CaregiverForm, Omit<User, 'password' | 'id'>>(methods.reset, defaultValues);

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          {`${action === 'view' ? getFullName(defaultValues?.firstName, defaultValues?.lastName) : action === 'edit' ? 'Update Caregiver' : 'Add Caregiver'}`}
          {action === 'view' && (
            <span className="cursor-pointer ml-2" onClick={() => setAction('edit')}>
              <EditIcon />
            </span>
          )}
        </div>
      }
      open={opened}
      onClose={onCloseModal}
      className="md:max-w-[720px]"
    >
      <SuccessModal
        opened={openedSuccess}
        onBack={onCloseSuccess}
        onClose={onCloseModal}
        caregiver={defaultValues ?? data?.data}
        callback={() => {
          methods.reset(caregiverDefaultValue);
          onCloseSuccess();
        }}
      />
      <Form {...methods}>
        <form
          className="max-h-[900px] overflow-auto flex flex-col scrollbar-hide gap-8 px-2"
          onSubmit={methods.handleSubmit(async (formData) => {
            if (defaultValues) {
              await triggerUpdate({ ...formData, id: defaultValues.uuid });
            } else {
              await trigger({ ...formData, role: 'caregiver' });
            }
          })}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6">
            <FormField
              control={methods.control}
              name={'firstName'}
              render={({ field }) => (
                <FormRender label={'First Name'}>
                  <Input {...field} placeholder="Enter first name " disabled={action === 'view'} />
                </FormRender>
              )}
            />
            <FormField
              control={methods.control}
              name={'middleName'}
              render={({ field }) => (
                <FormRender label={'Middle Name (Optional)'}>
                  <Input {...field} placeholder="Enter middle name " disabled={action === 'view'} />
                </FormRender>
              )}
            />
            <FormField
              control={methods.control}
              name={'lastName'}
              render={({ field }) => (
                <FormRender label={'Last Name'}>
                  <Input {...field} placeholder="Enter last name" disabled={action === 'view'} />
                </FormRender>
              )}
            />
            <FormField
              control={methods.control}
              name={'email'}
              render={({ field }) => (
                <FormRender label={'Email Address'}>
                  <Input {...field} placeholder="Enter email address" disabled={action === 'view'} />
                </FormRender>
              )}
            />
            <FormField
              control={methods.control}
              name={'dob'}
              render={({ field }) => (
                <FormRender label={'Date of Birth'}>
                  <DateInput {...field} value={field.value as Date} disabled={action === 'view'} />
                </FormRender>
              )}
            />
            <FormField
              control={methods.control}
              name={'phone'}
              render={({ field }) => (
                <FormRender label={'Phone Number'}>
                  <Input {...field} type="number" placeholder="Enter phone number " disabled={action === 'view'} />
                </FormRender>
              )}
            />
            <FormField
              control={methods.control}
              name={'zip'}
              render={({ field }) => (
                <FormRender label={'Zip Code'}>
                  <Input {...field} placeholder="Enter patient's last name" disabled={action === 'view'} />
                </FormRender>
              )}
            />
            <FormField
              control={methods.control}
              name={'country'}
              render={({ field }) => (
                <FormRender label={'Country'}>
                  <Input {...field} placeholder="Enter country" disabled={action === 'view'} />
                </FormRender>
              )}
            />
            <FormField
              control={methods.control}
              name={'state'}
              render={({ field }) => (
                <FormRender label={'State'}>
                  <Input {...field} placeholder="Enter state" disabled={action === 'view'} />
                </FormRender>
              )}
            />
            <FormField
              control={methods.control}
              name={'city'}
              render={({ field }) => (
                <FormRender label={'City'}>
                  <Input {...field} placeholder="Enter city" disabled={action === 'view'} />
                </FormRender>
              )}
            />

            <FormField
              control={methods.control}
              name={'sssopId'}
              render={({ field }) => (
                <FormRender label={'SSSOP ID'}>
                  <Input {...field} label="Social Services Servicing Only Provider ID" disabled={action === 'view'} />
                </FormRender>
              )}
            />
            <FormField
              control={methods.control}
              name={'gender'}
              render={({ field }) => (
                <FormRender label="Gender:">
                  <SelectInput
                    allowClear
                    options={[
                      { value: Gender.MALE, label: 'Male' },
                      { value: Gender.FEMALE, label: 'Female' },
                    ]}
                    field={field}
                    disabled={action === 'view'}
                  />
                </FormRender>
              )}
            />
            <FormField
              control={methods.control}
              name={'address'}
              render={({ field }) => (
                <FormRender label={'Address'} formClassName="lg:col-span-2">
                  <Input {...field} placeholder="Enter caregiver's full address here" disabled={action === 'view'} />
                </FormRender>
              )}
            />
            {action !== 'view' && !defaultValues?.invitedAt && (
              <FormField
                control={methods.control}
                name={'sendMail'}
                render={({ field }) => (
                  <FormRender formClassName="lg:col-span-2">
                    <div className="flex gap-2 items-center">
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      <span className="text-[15px] font-normal leading-6 text-[#101828]">Email employee login credentials</span>
                    </div>
                  </FormRender>
                )}
              />
            )}
          </div>
          {action !== 'view' && (
            <div className="grid lg:grid-cols-2 gap-3">
              <Button variant="secondary" type="button" onClick={onCloseModal}>
                Cancel
              </Button>
              <Button loading={isMutating || isMutatingUpdate}>{action === 'edit' ? 'Update' : 'Add'} Caregiver</Button>
            </div>
          )}
        </form>
      </Form>
    </Modal>
  );
};

export default AddCaregiver;
