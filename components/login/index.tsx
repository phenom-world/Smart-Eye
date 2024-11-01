'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useRouter } from 'next-nprogress-bar';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSWRConfig } from 'swr';

import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Form, FormField, FormRender, Input } from '@/components/ui';
import { getCookies } from '@/lib';
import { loginDefaultValues, LoginForm, loginFormSchema } from '@/schema/auth/login';

import ErrorBox from '../error-box';
import LogoIcon from '../ui/svg/logo';

const LoginUserForm = () => {
  const [loading, setLoading] = useState(false);
  const { mutate } = useSWRConfig();
  const [error, setError] = useState<string>('');
  const form = useForm<LoginForm>({
    defaultValues: loginDefaultValues,
    resolver: zodResolver(loginFormSchema),
  });
  const router = useRouter();

  const handleSubmit = async (formData: LoginForm) => {
    try {
      setLoading(true);
      await axios.post('/api/auth/login', { ...formData, isAdmin: true });
      router.push('/');
      setLoading(false);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    getCookies().then(async (cookies) => {
      if (!cookies?.auth && !cookies.refresh) {
        mutate(() => true, undefined, false);
        router.push('/login', undefined);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mutate]);

  return (
    <Card className="w-[480px]">
      <CardHeader className="space-y-0 pb-4 sm:pb-8">
        <div className="flex justify-center items-center pb-4 sm:pb-6">
          <LogoIcon />
        </div>
        <CardTitle className="text-[#101828] text-xl leading-7 sm:!text-[30px] sm:!leading-[38px] !font-semibold text-center sm:!mb-2">
          Log in to your account
        </CardTitle>
        <CardDescription className="text-center text-sm md:!text-base !text-[#475467] font-normal leading-6">
          Welcome back! Please enter your details.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <CardContent className="space-y-4 sm:space-y-5">
            <FormField
              control={form.control}
              name={'email'}
              render={({ field }) => (
                <FormRender label={'Email Address'} required={true}>
                  <Input {...field} />
                </FormRender>
              )}
            />

            <FormField
              control={form.control}
              name={'password'}
              render={({ field }) => (
                <FormRender label={'Password'} required={true}>
                  <Input {...field} type="password" />
                </FormRender>
              )}
            />
            {error && <ErrorBox message={error} />}
          </CardContent>
          <CardFooter>
            <Button className="w-full" type="submit" loading={loading}>
              Login
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default LoginUserForm;
