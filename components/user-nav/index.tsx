'use client';

import { useRouter } from 'next-nprogress-bar';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { ImSpinner8 } from 'react-icons/im';

import { useAuth } from '@/context/AuthContext';
import { getObjectURL } from '@/lib/s3Client';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui';

export function UserNav() {
  const [loading, setLoading] = useState(false);
  const { user, logout } = useAuth();
  const [imageUrl, setImageUrl] = useState('');
  const router = useRouter();

  const handleLogout = async () => {
    try {
      setLoading(true);
      await logout();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      location.href = '/login';
      toast.error(error?.response?.data?.message ?? error?.message);
    }
  };

  useEffect(() => {
    if (user?.profilePhoto?.mediaId) {
      getObjectURL(user?.profilePhoto?.mediaId).then((item) => setImageUrl(item));
    }
  }, [user?.profilePhoto?.mediaId]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={loading}>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          {!loading && user ? (
            <Avatar className="h-8 w-8">
              <AvatarImage src={imageUrl || ''} alt="@shadcn" />
              {user?.lastName && user?.firstName && (
                <AvatarFallback>
                  {user?.lastName.charAt(0)}
                  {user?.firstName.charAt(0)}
                </AvatarFallback>
              )}
            </Avatar>
          ) : (
            <Avatar className="h-8 w-8 items-center justify-center place-items-center bg-border/60">
              <ImSpinner8 className="animate-spin" />
            </Avatar>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount sideOffset={16}>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {/* <DropdownMenuItem>Profile</DropdownMenuItem> */}
          <DropdownMenuItem onClick={() => router.push('/settings')}>Settings</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
