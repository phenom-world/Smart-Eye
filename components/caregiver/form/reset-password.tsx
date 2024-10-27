import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { Button, Checkbox, Form, FormField, FormRender, Input, Modal } from '@/components/ui';
import { useResetPassword } from '@/hooks';
import { generateRandomString, getFullName } from '@/lib';
import { resetPasswordDefaultValue, ResetPasswordForm, resetPasswordSchema } from '@/schema/caregiver/reset-password';
import { UserResponse } from '@/types';

const ResetPassword = ({
  opened,
  onClose,
  selected,
  onSuccessCallback,
}: {
  opened: boolean;
  onClose: () => void;
  selected: UserResponse;
  onSuccessCallback: () => void;
}) => {
  const methods = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: resetPasswordDefaultValue,
    mode: 'onChange',
    shouldUnregister: false,
  });

  const onCloseModal = () => {
    methods.reset(resetPasswordDefaultValue);
    onClose();
  };

  const { trigger, isMutating } = useResetPassword({
    onSuccess: () => {
      onCloseModal();
      onSuccessCallback();
    },
  });

  useEffect(() => {
    methods.setValue('email', selected?.email);
  }, [methods, selected]);

  return (
    <Modal
      title={`Reset Password-${getFullName(selected?.lastName, selected?.firstName)}`}
      open={opened}
      onClose={onCloseModal}
      className="md:max-w-[560px]"
    >
      <Form {...methods}>
        <form
          className="overflow-auto justify-between flex flex-col scrollbar-hide gap-8 px-2"
          onSubmit={methods.handleSubmit(async (formData) => {
            await trigger(formData);
          })}
        >
          <div className="grid grid-col-1 gap-y-6 items-end">
            <FormField
              control={methods.control}
              name={'email'}
              render={({ field }) => (
                <FormRender label={'Email Address'}>
                  <Input {...field} placeholder="Enter first name" />
                </FormRender>
              )}
            />

            <div className="flex items-center gap-4">
              <FormField
                control={methods.control}
                name={'password'}
                render={({ field }) => (
                  <FormRender label={'Password'} formClassName="flex-1">
                    <Input
                      {...field}
                      placeholder="Enter new password here"
                      rightSection={
                        <Button
                          type="button"
                          className="!py-2 !px-3 !text-sm !bg-[#F1F5F9] !text-[#0F172A]"
                          onClick={() => {
                            methods.setValue('password', generateRandomString());
                          }}
                        >
                          Generate
                        </Button>
                      }
                    />
                  </FormRender>
                )}
              />
            </div>

            <FormField
              control={methods.control}
              name={'sendMail'}
              render={({ field }) => (
                <FormRender>
                  <div className="flex gap-2 items-center">
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    <span className="text-base font-normal leading-6 text-[#101828]">Email employee login credentials</span>
                  </div>
                </FormRender>
              )}
            />
          </div>

          <div className="grid lg:grid-cols-2 gap-3">
            <Button variant="secondary" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button loading={isMutating}>Reset Password</Button>
          </div>
        </form>
      </Form>
    </Modal>
  );
};

export default ResetPassword;
