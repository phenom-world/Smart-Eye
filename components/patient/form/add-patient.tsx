import { zodResolver } from '@hookform/resolvers/zod';
import { Gender, Patient } from '@prisma/client';
import React from 'react';
import { useForm } from 'react-hook-form';

import { Button, DateInput, Form, FormField, FormRender, Input, Modal, SelectInput } from '@/components/ui';
import { usePopulateForm } from '@/hooks';
import { useCreatePatient, useUpdatePatient } from '@/hooks/request/patient';
import { patientDefaultValue, PatientForm, patientSchema } from '@/schema/patient';
import { PatientResponse } from '@/types';

const AddPatient = ({
  selected,
  opened,
  onClose,
  onSuccessCallback,
}: {
  opened: boolean;
  onClose: () => void;
  onSuccessCallback: () => void;
  selected: PatientResponse;
}) => {
  const methods = useForm<PatientForm>({
    resolver: zodResolver(patientSchema),
    defaultValues: patientDefaultValue,
    mode: 'onChange',
    shouldUnregister: false,
  });

  const onCloseModal = () => {
    methods.reset(patientDefaultValue);
    onClose();
  };

  const { trigger, isMutating } = useCreatePatient({
    onSuccess: () => {
      onCloseModal();
      onSuccessCallback();
    },
  });
  const { trigger: update, isMutating: isMutating2 } = useUpdatePatient({
    onSuccess: () => {
      onCloseModal();
      onSuccessCallback();
    },
  });

  usePopulateForm<PatientForm, Omit<Patient, 'id' | 'providerId'>>(methods.reset, selected);

  return (
    <Modal title={`${selected ? 'Update' : 'Add'} Patient`} open={opened} onClose={onCloseModal} className="md:max-w-[720px]">
      <Form {...methods}>
        <form
          className="max-h-[900px] overflow-auto flex flex-col gap-8 scrollbar-hide px-2"
          onSubmit={methods.handleSubmit(async (formData) => {
            if (selected?.cuid) {
              await update({ ...formData, id: selected.cuid });
            } else {
              await trigger(formData);
            }
          })}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2  gap-x-8 gap-y-6">
            <FormField
              control={methods.control}
              name={'firstName'}
              render={({ field }) => (
                <FormRender label={'First Name'}>
                  <Input {...field} placeholder="Enter patient's first name" />
                </FormRender>
              )}
            />
            <FormField
              control={methods.control}
              name={'lastName'}
              render={({ field }) => (
                <FormRender label={'Last Name'}>
                  <Input {...field} placeholder="Enter patient's last name" />
                </FormRender>
              )}
            />
            <FormField
              control={methods.control}
              name={'email'}
              render={({ field }) => (
                <FormRender label={'Email Address'}>
                  <Input {...field} placeholder="Enter email address" />
                </FormRender>
              )}
            />
            <FormField
              control={methods.control}
              name={'phone'}
              render={({ field }) => (
                <FormRender label={'Phone Number'}>
                  <Input {...field} type="number" placeholder="Enter phone number here" />
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
                  />
                </FormRender>
              )}
            />
            <FormField
              control={methods.control}
              name={'dob'}
              render={({ field }) => (
                <FormRender label={'Date of Birth'}>
                  <DateInput {...field} value={field.value as Date} />
                </FormRender>
              )}
            />
            <FormField
              control={methods.control}
              name={'race'}
              render={({ field }) => (
                <FormRender label="Race:">
                  <SelectInput
                    allowClear
                    options={[
                      { value: 'AMERICAN-INDIAN', label: 'American Indian or Alaska Native' },
                      { value: 'HAWAIIAN', label: 'Hawaiian or Pacific Islander' },
                      { value: 'BLACK', label: 'Black or African American' },
                      { value: 'WHITE', label: 'White or Caucasian' },
                      { value: 'MONOGOLOID', label: 'Monogoloid or Asian' },
                    ]}
                    field={field}
                  />
                </FormRender>
              )}
            />
            <FormField
              control={methods.control}
              name={'country'}
              render={({ field }) => (
                <FormRender label={'Country'}>
                  <Input {...field} placeholder="Enter country" />
                </FormRender>
              )}
            />
            <FormField
              control={methods.control}
              name={'state'}
              render={({ field }) => (
                <FormRender label={'State'}>
                  <Input {...field} placeholder="Enter state" />
                </FormRender>
              )}
            />
            <FormField
              control={methods.control}
              name={'city'}
              render={({ field }) => (
                <FormRender label={'City'}>
                  <Input {...field} placeholder="Enter city" />
                </FormRender>
              )}
            />
            <FormField
              control={methods.control}
              name={'zip'}
              render={({ field }) => (
                <FormRender label={'Zip Code'}>
                  <Input {...field} placeholder="Enter zip code" />
                </FormRender>
              )}
            />
            <FormField
              control={methods.control}
              name={'apartmentNumber'}
              render={({ field }) => (
                <FormRender label={'Apartment Number'}>
                  <Input {...field} type="number" placeholder="Enter apartment number here" />
                </FormRender>
              )}
            />

            <FormField
              control={methods.control}
              name={'medicaidNumber'}
              render={({ field }) => (
                <FormRender label={'Medicaid Number'}>
                  <Input {...field} type="number" placeholder="Enter Medicaid Number here" />
                </FormRender>
              )}
            />
            <FormField
              control={methods.control}
              name={'ssnNumber'}
              render={({ field }) => (
                <FormRender label={'SSN Number'}>
                  <Input {...field} type="number" placeholder="Enter last 4 digits of SSN Number here" />
                </FormRender>
              )}
            />
            <FormField
              control={methods.control}
              name={'address'}
              render={({ field }) => (
                <FormRender label={'Full Address'} formClassName="lg:col-span-2">
                  <Input {...field} placeholder="Enter full address here" />
                </FormRender>
              )}
            />
          </div>

          <div className="grid lg:grid-cols-2 gap-3">
            <Button variant="secondary" type="button" onClick={onCloseModal}>
              Cancel
            </Button>
            <Button loading={isMutating || isMutating2}>{selected?.id ? 'Update' : 'Add'} Patient</Button>
          </div>
        </form>
      </Form>
    </Modal>
  );
};

export default AddPatient;
