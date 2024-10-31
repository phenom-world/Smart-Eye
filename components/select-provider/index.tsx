'use client';
import { ArrowLeftIcon } from '@radix-ui/react-icons';
import axios from 'axios';
import { useRouter } from 'next-nprogress-bar';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { ImSpinner8 } from 'react-icons/im';

import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Separator } from '@/components/ui';
import LogoIcon from '@/components/ui/svg/logo';
import { useAuth } from '@/context/AuthContext';
import { getCookies } from '@/lib';
import blurDataUrl from '@/lib/generateBlurPlaceholder';
import { getObjectURL } from '@/lib/s3Client';
import { ProviderResponse } from '@/types';

import { StaticImage } from '../static-image';

function SelectProvider() {
  const [loading, setLoading] = useState(false);
  const { authUser, updateUser } = useAuth();
  const router = useRouter();
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [loggedIn, setLoggedIn] = useState(true);
  const [mounting, setMounting] = useState(true);
  const [providers, setProviders] = useState<(ProviderResponse & { logoUrl: string })[]>([]);

  const handleAuthenticateProvider = async (id: string) => {
    try {
      setLoading(true);
      const response = await axios.post(
        '/api/auth/select-provider',
        { providerId: id },
        { headers: { Authorization: `Bearer ${authUser?.accessToken}` } }
      );
      const data = await response.data;
      updateUser(data?.data);
      router.push('/');
      setLoading(false);
    } catch (err) {
      const errorMessage = err.response?.data?.message ?? err.message ?? 'An error occurred';
      toast.error(errorMessage);
      setLoading(false);
    }
  };

  useEffect(() => {
    getCookies().then(async (cookies) => {
      if (!cookies?.auth && !cookies.refresh) {
        setLoggedIn(false);
      }
      setMounting(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    (async () => {
      const providersWithLogo = await Promise.all(
        (authUser?.providers ?? [])?.map(async (provider) => ({ ...provider, logoUrl: await getObjectURL(provider?.logo?.mediaId as string) }))
      );
      setProviders(providersWithLogo);
    })();
  }, [authUser?.providers]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-8">
      <CardHeader className="text-center space-y-3">
        <div className="flex justify-center items-center mb-4">
          <LogoIcon />
        </div>
        <CardTitle className="text-gray-900 text-2xl sm:text-4xl font-extrabold leading-tight tracking-tight">Choose Your Provider</CardTitle>
        <CardDescription className="text-gray-600 text-base sm:text-lg mt-2">Please select the provider to continue</CardDescription>
      </CardHeader>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6 w-full max-w-[60rem]">
        {mounting ? (
          <div className="flex flex-col items-center justify-center gap-4 w-full mx-auto col-span-full">
            <ImSpinner8 className="animate-spin text-5xl text-primary" />
          </div>
        ) : providers?.length > 0 ? (
          providers?.map((provider, index) => (
            <Card
              key={index}
              className="border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow min-w-[250px] px-3 py-4 flex flex-col justify-between"
            >
              <div>
                <StaticImage
                  src={provider.logoUrl ?? '/images/avatar-2.png'}
                  alt="provider logo"
                  imageClassName="object-cover"
                  className="h-[64px] w-[64px] rounded-full mx-auto"
                  blurDataURL={blurDataUrl()}
                />
                <CardHeader className="pb-1">
                  <h3 className="text-lg font-semibold text-gray-800">{provider.name ?? 'N/A'}</h3>
                </CardHeader>
                <div className="px-4">
                  <Separator className="mb-5" />
                </div>
                <CardContent className="flex flex-col gap-1 text-gray-600 break-all">
                  <p className="text-sm">
                    <span className="font-semibold">Email:</span> {provider.email ?? 'N/A'}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Phone:</span> {provider.phone ?? 'N/A'}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Address:</span> {provider.address1 ?? 'N/A'}
                  </p>
                </CardContent>
              </div>
              <CardFooter className="mt-4">
                <Button
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-base transition"
                  onClick={() => {
                    setSelectedProvider(provider.cuid);
                    handleAuthenticateProvider(provider.cuid);
                  }}
                  loading={loading && selectedProvider === provider.cuid}
                >
                  Select Provider
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 w-full mx-auto col-span-full">
            <p className="text-gray-600 text-lg">{loggedIn ? 'Only one provider is available' : 'No providers found'}</p>
            <Button
              onClick={() => router.push(loggedIn ? '/' : '/login')}
              className="py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-base"
              leftIcon={<ArrowLeftIcon />}
            >
              Go Back {loggedIn ? 'to Dashboard' : 'to Login'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default SelectProvider;
