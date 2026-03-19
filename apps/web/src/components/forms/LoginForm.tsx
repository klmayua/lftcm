'use client';

import { Form } from './Form';
import {
  ControlledInput,
  ControlledCheckbox,
} from './FormField';
import { loginSchema, LoginInput } from '@/lib/validations/schemas';

interface LoginFormProps {
  onSubmit: (data: LoginInput) => Promise<void>;
  isLoading?: boolean;
}

export function LoginForm({ onSubmit, isLoading }: LoginFormProps) {
  return (
    <Form
      schema={loginSchema}
      defaultValues={{
        email: '',
        password: '',
        rememberMe: false,
      }}
      onSubmit={onSubmit}
      submitLabel="Sign In"
      isLoading={isLoading}
      className="space-y-4"
    >
      <ControlledInput
        name="email"
        label="Email Address"
        type="email"
        placeholder="you@example.com"
        autoComplete="email"
        required
      />

      <ControlledInput
        name="password"
        label="Password"
        type="password"
        placeholder="••••••••"
        autoComplete="current-password"
        required
      />

      <div className="flex items-center justify-between">
        <ControlledCheckbox
          name="rememberMe"
          label="Remember me"
        />

        <a
          href="/auth/forgot-password"
          className="text-sm text-gold-600 hover:text-gold-700"
        >
          Forgot password?
        </a>
      </div>
    </Form>
  );
}
