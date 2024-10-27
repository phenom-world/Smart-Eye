import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';

import { Button, DateInput, Form, FormField, FormRender, Input, Modal, SelectInput, Switch } from '@/components/ui';
import { useGetUsers } from '@/hooks';
import { useGetPatients } from '@/hooks/request/patient';
import { useCreateVisit } from '@/hooks/request/visit';
import { getFullName, resetTime } from '@/lib';
import { getRecurringDates } from '@/lib/schedule';
import { visitDefaultValue, VisitForm, visitSchema } from '@/schema/visit';

const ScheduleVisit = ({ opened, onClose, onSuccessCallback }: { opened: boolean; onClose: () => void; onSuccessCallback: () => void }) => {
  const { data, isLoading } = useGetPatients({ status: 'ACTIVE' });
  const { data: getUsers, isLoading: isLoading2 } = useGetUsers({ status: 'active', role: 'caregiver' });
  const methods = useForm<VisitForm>({
    resolver: zodResolver(visitSchema),
    defaultValues: visitDefaultValue,
    mode: 'onChange',
    shouldUnregister: false,
  });

  const closeModal = () => {
    methods.reset(visitDefaultValue);
    onClose();
  };

  const { trigger, isMutating } = useCreateVisit({
    onSuccess: () => {
      closeModal();
      onSuccessCallback();
    },
  });

  return (
    <Modal title={'Schedule Visit'} open={opened} onClose={closeModal} className="md:max-w-[560px]">
      <Form {...methods}>
        <form
          className="overflow-auto justify-between flex flex-col gap-8 scrollbar-hide"
          onSubmit={methods.handleSubmit(async (data) => {
            let dates: Date[] = [];
            if (data?.isRecurring) {
              const recurringDates = getRecurringDates({
                pattern: data?.frequency,
                startDate: data?.startDate,
                endDate: data?.endDate,
              });
              dates = [...recurringDates, data?.visitDate];
            } else {
              dates = [data?.visitDate];
            }

            await trigger({
              dates: dates.map((date) => resetTime(date)),
              startTime: data?.startTime,
              endTime: data?.endTime,
              patientId: data?.patientId,
              caregiverId: data?.caregiverId,
            });
          })}
        >
          <div className="grid gap-y-6 gap-x-4 px-2">
            <FormField
              control={methods.control}
              name={'patientId'}
              render={({ field }) => (
                <FormRender label={'Patient'} formClassName="lg:col-span-2">
                  <SelectInput
                    field={field}
                    placeholder="Select Patient"
                    options={data?.data?.map((patient) => ({
                      label: getFullName(patient?.firstName, patient?.lastName),
                      value: patient.uuid,
                    }))}
                    searchable
                    modalSearch
                    loading={isLoading}
                  />
                </FormRender>
              )}
            />
            <FormField
              control={methods.control}
              name={'caregiverId'}
              render={({ field }) => (
                <FormRender label={'Caregiver'} formClassName="lg:col-span-2">
                  <SelectInput
                    field={field}
                    placeholder="Select Caregiver"
                    options={getUsers?.data?.map((user) => ({
                      label: getFullName(user?.firstName, user?.lastName),
                      value: user.uuid,
                    }))}
                    searchable
                    loading={isLoading2}
                    modalSearch
                  />
                </FormRender>
              )}
            />
            <FormField
              control={methods.control}
              name={'visitDate'}
              render={({ field }) => (
                <FormRender label={'Date of Session'} formClassName="lg:col-span-2">
                  <DateInput {...field} value={field.value as Date} />
                </FormRender>
              )}
            />

            <FormField
              control={methods.control}
              name={'startTime'}
              render={({ field }) => (
                <FormRender label={'Start Time'}>
                  <Input {...field} type="time" />
                </FormRender>
              )}
            />
            <FormField
              control={methods.control}
              name={'endTime'}
              render={({ field }) => (
                <FormRender label={'End Time'}>
                  <Input {...field} type="time" />
                </FormRender>
              )}
            />
            <FormField
              control={methods.control}
              name={'isRecurring'}
              render={({ field }) => (
                <FormRender formClassName="lg:col-span-2">
                  <div className="flex gap-2 items-center">
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                    <span className="text-sm font-medium leading-[14px] text-black">Schedule recurrent visits</span>
                  </div>
                </FormRender>
              )}
            />
            {methods.watch('isRecurring') && (
              <>
                <FormField
                  control={methods.control}
                  name={'frequency'}
                  render={({ field }) => (
                    <FormRender label={'Frequency'} formClassName="lg:col-span-2">
                      <SelectInput
                        field={field}
                        options={[
                          { value: 'DAILY', label: 'Daily' },
                          { value: 'WEEKLY', label: 'Weekly' },
                          { value: 'MONTHLY', label: 'Monthly' },
                          { value: 'YEARLY', label: 'Yearly' },
                        ]}
                        placeholder="Select Frequency"
                      />
                    </FormRender>
                  )}
                />
                <FormField
                  control={methods.control}
                  name={'startDate'}
                  render={({ field }) => (
                    <FormRender label={'Start Date'}>
                      <DateInput {...field} value={field.value as Date} />
                    </FormRender>
                  )}
                />
                <FormField
                  control={methods.control}
                  name={'endDate'}
                  render={({ field }) => (
                    <FormRender label={'End Date'}>
                      <DateInput {...field} value={field.value as Date} />
                    </FormRender>
                  )}
                />
              </>
            )}
          </div>

          <div className="grid lg:grid-cols-2 gap-3">
            <Button variant="secondary" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button loading={isMutating} type="submit">
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </Modal>
  );
};

export default ScheduleVisit;
