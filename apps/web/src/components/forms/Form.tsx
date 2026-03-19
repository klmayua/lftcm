'use client';

import { ReactNode, useState } from 'react';
import {
  useForm,
  FormProvider,
  UseFormReturn,
  FieldValues,
  DefaultValues,
  Resolver,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ZodSchema } from 'zod';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface FormProps<T extends FieldValues> {
  schema: ZodSchema<T>;
  defaultValues: DefaultValues<T>;
  onSubmit: (data: T, form: UseFormReturn<T>) => Promise<void> | void;
  children: ReactNode;
  className?: string;
  submitLabel?: string;
  submitVariant?: 'gold' | 'secondary' | 'outline' | 'ghost' | 'danger';
  submitSize?: 'sm' | 'md' | 'lg';
  submitClassName?: string;
  isLoading?: boolean;
  showSubmitButton?: boolean;
  id?: string;
}

export function Form<T extends FieldValues>({
  schema,
  defaultValues,
  onSubmit,
  children,
  className,
  submitLabel = 'Submit',
  submitVariant = 'gold',
  submitSize = 'md',
  submitClassName,
  isLoading: externalLoading,
  showSubmitButton = true,
  id,
}: FormProps<T>) {
  const [internalLoading, setInternalLoading] = useState(false);
  const isLoading = externalLoading ?? internalLoading;

  const form = useForm<T>({
    resolver: zodResolver(schema) as Resolver<T>,
    defaultValues,
    mode: 'onBlur',
  });

  const handleSubmit = async (data: T) => {
    setInternalLoading(true);
    try {
      await onSubmit(data, form);
    } finally {
      setInternalLoading(false);
    }
  };

  return (
    <FormProvider {...form}>
      <form
        id={id}
        onSubmit={form.handleSubmit(handleSubmit)}
        className={cn('space-y-6', className)}
      >
        {children}

        {showSubmitButton && (
          <div className="pt-2">
            <Button
              type="submit"
              variant={submitVariant}
              size={submitSize}
              isLoading={isLoading}
              className={cn('w-full sm:w-auto', submitClassName)}
            >
              {submitLabel}
            </Button>
          </div>
        )}
      </form>
    </FormProvider>
  );
}

// Re-export form hooks for convenience
export { useFormContext, useWatch } from 'react-hook-form';
export type { UseFormReturn, FieldValues } from 'react-hook-form';
