'use client';
import { themes } from '@/constants';
import { AppProgressBar } from 'next-nprogress-bar';
import { useTheme } from 'next-themes';
import React from 'react';

const ProgressBar = () => {
  const [mounted, setMounted] = React.useState(false);
  const { resolvedTheme } = useTheme();
  const color = themes.find((item) => item.theme === resolvedTheme)?.color;

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return <AppProgressBar height="2px" color={color} options={{ showSpinner: true }} shallowRouting shouldCompareComplexProps />;
};

export default ProgressBar;
