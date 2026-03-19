'use client';

import { Form } from './Form';
import {
  ControlledInput,
  ControlledSelect,
  ControlledCheckbox,
} from './FormField';
import { prayerRequestSchema, PrayerRequestInput } from '@/lib/validations/schemas';

interface PrayerRequestFormProps {
  onSubmit: (data: PrayerRequestInput) => Promise<void>;
  isLoading?: boolean;
}

const categoryOptions = [
  { value: 'healing', label: 'Healing & Health' },
  { value: 'provision', label: 'Financial Provision' },
  { value: 'guidance', label: 'Guidance & Direction' },
  { value: 'family', label: 'Family & Relationships' },
  { value: 'ministry', label: 'Ministry & Service' },
  { value: 'other', label: 'Other' },
];

export function PrayerRequestForm({ onSubmit, isLoading }: PrayerRequestFormProps) {
  return (
    <Form
      schema={prayerRequestSchema}
      defaultValues={{
        title: '',
        content: '',
        category: 'other',
        isAnonymous: false,
        isPublic: false,
        name: '',
        email: '',
        phone: '',
      }}
      onSubmit={onSubmit}
      submitLabel="Submit Prayer Request"
      isLoading={isLoading}
    >
      <ControlledInput
        name="title"
        label="Title"
        placeholder="Brief title for your prayer request"
        helperText="Keep it concise (5-100 characters)"
        required
      />

      <ControlledSelect
        name="category"
        label="Category"
        options={categoryOptions}
        required
      />

      <ControlledInput
        name="content"
        label="Your Prayer Request"
        type="textarea"
        placeholder="Share your prayer request in detail..."
        helperText="Minimum 20 characters"
        required
      />

      <div className="space-y-4 border-t border-gray-200 pt-4">
        <ControlledCheckbox
          name="isAnonymous"
          label="Submit anonymously"
          helperText="Your name won't be displayed publicly"
        />

        <ControlledCheckbox
          name="isPublic"
          label="Make this prayer request public"
          helperText="Allow others to pray with you (name will be shown unless anonymous)"
        />
      </div>

      <div className="border-t border-gray-200 pt-4">
        <p className="text-sm text-gray-600 mb-4">
          Contact Information (optional - only visible to prayer team)
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ControlledInput
            name="name"
            label="Your Name"
            placeholder="John Doe"
          />

          <ControlledInput
            name="email"
            label="Email"
            type="email"
            placeholder="you@example.com"
          />
        </div>

        <ControlledInput
          name="phone"
          label="Phone Number"
          type="tel"
          placeholder="+237 6XX XXX XXX"
          helperText="Cameroon format: +237 6XX XXX XXX"
        />
      </div>
    </Form>
  );
}
