'use client';

import { Form } from './Form';
import {
  ControlledInput,
  ControlledSelect,
} from './FormField';
import { contactSchema, ContactInput } from '@/lib/validations/schemas';

interface ContactFormProps {
  onSubmit: (data: ContactInput) => Promise<void>;
  isLoading?: boolean;
  branches?: { id: string; name: string }[];
}

export function ContactForm({ onSubmit, isLoading, branches }: ContactFormProps) {
  return (
    <Form
      schema={contactSchema}
      defaultValues={{
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        branchId: '',
      }}
      onSubmit={onSubmit}
      submitLabel="Send Message"
      isLoading={isLoading}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ControlledInput
          name="name"
          label="Full Name"
          placeholder="John Doe"
          required
        />

        <ControlledInput
          name="email"
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ControlledInput
          name="phone"
          label="Phone Number"
          type="tel"
          placeholder="+237 6XX XXX XXX"
          helperText="Optional, but recommended for faster response"
        />

        {branches && branches.length > 0 && (
          <ControlledSelect
            name="branchId"
            label="Branch"
            placeholder="Select a branch"
            options={[
              { value: '', label: 'General Inquiry' },
              ...branches.map((b) => ({ value: b.id, label: b.name })),
            ]}
          />
        )}
      </div>

      <ControlledInput
        name="subject"
        label="Subject"
        placeholder="What is this regarding?"
        required
      />

      <ControlledInput
        name="message"
        label="Message"
        type="textarea"
        placeholder="How can we help you?"
        helperText="Please provide as much detail as possible"
        required
      />
    </Form>
  );
}
