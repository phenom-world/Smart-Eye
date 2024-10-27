'use client';

import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib';

import { FormControl, FormField, FormItem } from './form';

const Checkbox = React.forwardRef<React.ElementRef<typeof CheckboxPrimitive.Root>, React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>>(
  ({ className, ...props }, ref) => (
    <CheckboxPrimitive.Root
      ref={ref}
      className={cn(
        'peer h-5 w-5 shrink-0 rounded-[3px] border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator className={cn('flex items-center justify-center text-current')}>
        <Check className="h-5 w-5" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
);
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

type CheckboxGroupProps = {
  options: { value: string; label: string }[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  methods: any;
  name: string;
  disabled?: boolean;
};

const CheckboxGroup = ({ options, methods, name, disabled }: CheckboxGroupProps) => {
  return (
    <>
      {options.map((item) => (
        <FormField
          key={item.value}
          control={methods.control}
          name={name}
          render={({ field }) => {
            return (
              <FormItem key={item.value} className="flex flex-row items-center gap-2">
                <FormControl>
                  <Checkbox
                    checked={field.value?.includes(item.value)}
                    onCheckedChange={(checked) => {
                      return checked
                        ? field.onChange([...field.value, item.value])
                        : field.onChange(field.value?.filter((value: string) => value !== item.value));
                    }}
                    disabled={disabled}
                  />
                </FormControl>
                <p className="text-sm font-normal !my-0 !space-y-0">{item.label}</p>
              </FormItem>
            );
          }}
        />
      ))}
    </>
  );
};

export { Checkbox, CheckboxGroup };
