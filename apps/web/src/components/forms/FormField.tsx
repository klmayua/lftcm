'use client';

import { ReactNode } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { cn } from '@/lib/utils';

interface FormFieldProps {
  name: string;
  label?: string;
  helperText?: string;
  children: ReactNode;
  className?: string;
  required?: boolean;
}

export function FormField({
  name,
  label,
  helperText,
  children,
  className,
  required,
}: FormFieldProps) {
  const { formState: { errors } } = useFormContext();
  const error = errors[name]?.message as string | undefined;

  return (
    <div className={cn('space-y-1.5', className)}>
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {children}
      {error ? (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : helperText ? (
        <p className="text-sm text-gray-500">{helperText}</p>
      ) : null}
    </div>
  );
}

// Controlled input wrapper for react-hook-form
interface ControlledInputProps {
  name: string;
  label?: string;
  helperText?: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'tel' | 'number' | 'date' | 'textarea';
  required?: boolean;
  disabled?: boolean;
  className?: string;
  autoComplete?: string;
}

export function ControlledInput({
  name,
  label,
  helperText,
  placeholder,
  type = 'text',
  required,
  disabled,
  className,
  autoComplete,
}: ControlledInputProps) {
  const { control, formState: { errors } } = useFormContext();
  const error = errors[name]?.message as string | undefined;

  const inputClasses = cn(
    'w-full px-4 py-2.5 rounded-lg border bg-white transition-colors',
    'focus:outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500',
    error
      ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
      : 'border-gray-300 hover:border-gray-400',
    disabled && 'bg-gray-100 cursor-not-allowed opacity-60',
    type === 'textarea' && 'min-h-[120px] resize-y',
    className
  );

  return (
    <FormField
      name={name}
      label={label}
      helperText={helperText}
      required={required}
    >
      <Controller
        name={name}
        control={control}
        render={({ field }) =>
          type === 'textarea' ? (
            <textarea
              {...field}
              id={name}
              placeholder={placeholder}
              disabled={disabled}
              className={inputClasses}
              aria-invalid={error ? 'true' : 'false'}
              aria-describedby={error ? `${name}-error` : undefined}
            />
          ) : (
            <input
              {...field}
              id={name}
              type={type}
              placeholder={placeholder}
              disabled={disabled}
              autoComplete={autoComplete}
              className={inputClasses}
              aria-invalid={error ? 'true' : 'false'}
              aria-describedby={error ? `${name}-error` : undefined}
            />
          )
        }
      />
    </FormField>
  );
}

// Controlled select wrapper
interface ControlledSelectProps {
  name: string;
  label?: string;
  helperText?: string;
  options: { value: string; label: string }[];
  required?: boolean;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
}

export function ControlledSelect({
  name,
  label,
  helperText,
  options,
  required,
  disabled,
  className,
  placeholder,
}: ControlledSelectProps) {
  const { control, formState: { errors } } = useFormContext();
  const error = errors[name]?.message as string | undefined;

  const selectClasses = cn(
    'w-full px-4 py-2.5 rounded-lg border bg-white transition-colors appearance-none',
    'focus:outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500',
    'bg-[url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2712%27 height=%2712%27 viewBox=%270 0 12 12%27%3E%3Cpath fill=%27%236b7280%27 d=%27M6 8L1 3h10z%27/%3E%3C/svg%3E")] bg-no-repeat bg-[right_1rem_center] pr-10',
    error
      ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
      : 'border-gray-300 hover:border-gray-400',
    disabled && 'bg-gray-100 cursor-not-allowed opacity-60',
    className
  );

  return (
    <FormField
      name={name}
      label={label}
      helperText={helperText}
      required={required}
    >
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <select
            {...field}
            id={name}
            disabled={disabled}
            className={selectClasses}
            aria-invalid={error ? 'true' : 'false'}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}
      />
    </FormField>
  );
}

// Controlled checkbox wrapper
interface ControlledCheckboxProps {
  name: string;
  label: string | ReactNode;
  helperText?: string;
  disabled?: boolean;
  className?: string;
}

export function ControlledCheckbox({
  name,
  label,
  helperText,
  disabled,
  className,
}: ControlledCheckboxProps) {
  const { control, formState: { errors } } = useFormContext();
  const error = errors[name]?.message as string | undefined;

  return (
    <div className={cn('space-y-1.5', className)}>
      <Controller
        name={name}
        control={control}
        render={({ field: { value, onChange, ...field } }) => (
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={value}
              onChange={(e) => onChange(e.target.checked)}
              disabled={disabled}
              className={cn(
                'mt-0.5 w-5 h-5 rounded border-gray-300 text-gold-600',
                'focus:ring-gold-500 focus:ring-offset-0',
                disabled && 'cursor-not-allowed opacity-60'
              )}
              {...field}
            />
            <div className="flex-1">
              <span className={cn('text-sm', error ? 'text-red-600' : 'text-gray-700')}>
                {label}
              </span>
              {helperText && (
                <p className="text-sm text-gray-500 mt-0.5">{helperText}</p>
              )}
            </div>
          </label>
        )}
      />
      {error && (
        <p className="text-sm text-red-600 ml-8" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

// Controlled radio group wrapper
interface ControlledRadioGroupProps {
  name: string;
  label?: string;
  options: { value: string; label: string; description?: string }[];
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export function ControlledRadioGroup({
  name,
  label,
  options,
  required,
  disabled,
  className,
}: ControlledRadioGroupProps) {
  const { control, formState: { errors } } = useFormContext();
  const error = errors[name]?.message as string | undefined;

  return (
    <FormField
      name={name}
      label={label}
      required={required}
    >
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div className={cn('space-y-3', className)}>
            {options.map((option) => (
              <label
                key={option.value}
                className={cn(
                  'flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors',
                  field.value === option.value
                    ? 'border-gold-500 bg-gold-50'
                    : 'border-gray-200 hover:border-gray-300',
                  disabled && 'cursor-not-allowed opacity-60'
                )}
              >
                <input
                  type="radio"
                  {...field}
                  value={option.value}
                  checked={field.value === option.value}
                  disabled={disabled}
                  className="mt-0.5 w-4 h-4 text-gold-600 border-gray-300 focus:ring-gold-500"
                />
                <div className="flex-1">
                  <span className="text-sm font-medium text-gray-900">
                    {option.label}
                  </span>
                  {option.description && (
                    <p className="text-sm text-gray-500 mt-0.5">
                      {option.description}
                    </p>
                  )}
                </div>
              </label>
            ))}
          </div>
        )}
      />
    </FormField>
  );
}
