'use client';

import { useWatch } from 'react-hook-form';
import { Form } from './Form';
import {
  ControlledInput,
  ControlledSelect,
  ControlledCheckbox,
  ControlledRadioGroup,
} from './FormField';
import { givingSchema, GivingInput } from '@/lib/validations/schemas';

interface GivingFormProps {
  onSubmit: (data: GivingInput) => Promise<void>;
  isLoading?: boolean;
}

const givingTypeOptions = [
  { value: 'tithe', label: 'Tithe', description: '10% of your income' },
  { value: 'offering', label: 'Offering', description: 'Free will giving' },
  { value: 'partnership', label: 'Partnership', description: 'Support church ministries' },
  { value: 'building', label: 'Building Fund', description: 'Contributions for facilities' },
  { value: 'special', label: 'Special Project', description: 'Specific church projects' },
  { value: 'other', label: 'Other', description: 'Specify in message' },
];

const paymentMethodOptions = [
  { value: 'mobile_money', label: 'Mobile Money', description: 'MTN Mobile Money or Orange Money' },
  { value: 'card', label: 'Credit/Debit Card', description: 'Visa, Mastercard, etc.' },
  { value: 'bank_transfer', label: 'Bank Transfer', description: 'Direct bank transfer' },
];

const frequencyOptions = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'biweekly', label: 'Bi-weekly' },
  { value: 'monthly', label: 'Monthly' },
];

// Component to conditionally show phone field based on payment method
function PhoneField() {
  const paymentMethod = useWatch({ name: 'paymentMethod' });

  if (paymentMethod !== 'mobile_money') return null;

  return (
    <ControlledInput
      name="phoneNumber"
      label="Mobile Money Phone Number"
      type="tel"
      placeholder="+237 6XX XXX XXX"
      helperText="Enter the phone number for your Mobile Money account"
      required
    />
  );
}

// Component to conditionally show frequency field based on recurring
function FrequencyField() {
  const isRecurring = useWatch({ name: 'isRecurring' });

  if (!isRecurring) return null;

  return (
    <ControlledSelect
      name="frequency"
      label="Frequency"
      options={frequencyOptions}
      required
    />
  );
}

export function GivingForm({ onSubmit, isLoading }: GivingFormProps) {
  return (
    <Form
      schema={givingSchema}
      defaultValues={{
        amount: 1000,
        currency: 'XAF',
        type: 'tithe',
        paymentMethod: 'mobile_money',
        phoneNumber: '',
        isRecurring: false,
        frequency: undefined,
        message: '',
      }}
      onSubmit={onSubmit}
      submitLabel="Proceed to Payment"
      isLoading={isLoading}
    >
      <ControlledRadioGroup
        name="type"
        label="Giving Type"
        options={givingTypeOptions}
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <ControlledInput
          name="amount"
          label="Amount"
          type="number"
          placeholder="1000"
          required
        />

        <ControlledSelect
          name="currency"
          label="Currency"
          options={[
            { value: 'XAF', label: 'XAF (FCFA)' },
            { value: 'USD', label: 'USD ($)' },
            { value: 'EUR', label: 'EUR (€)' },
          ]}
          required
        />
      </div>

      <ControlledRadioGroup
        name="paymentMethod"
        label="Payment Method"
        options={paymentMethodOptions}
        required
      />

      <PhoneField />

      <div className="border-t border-gray-200 pt-4">
        <ControlledCheckbox
          name="isRecurring"
          label="Make this a recurring gift"
          helperText="Set up automatic giving on a schedule"
        />

        <FrequencyField />
      </div>

      <ControlledInput
        name="message"
        label="Message (Optional)"
        type="textarea"
        placeholder="Add a note or specify if this is for a particular purpose..."
      />
    </Form>
  );
}
