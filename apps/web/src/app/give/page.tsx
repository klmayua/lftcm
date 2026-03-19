'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Heart, Shield, Globe, CreditCard, Smartphone, Building } from 'lucide-react';
import { GivingForm } from '@/components/forms/GivingForm';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { usePaymentMutations, PaymentRequest } from '@/hooks/useGiving';
import { useAuth } from '@/hooks/useAuth';
import { GivingInput } from '@/lib/validations/schemas';
import { useToast } from '@/components/ui/Toast';

// Payment method mapping
const paymentMethodToProvider = {
  mobile_money: 'MTN' as const,
  card: 'PAYSTACK' as const,
  bank_transfer: 'PAYSTACK' as const,
};

// Donation type mapping
const donationTypeMap: Record<string, string> = {
  tithe: 'TITHE',
  offering: 'OFFERING',
  partnership: 'PROJECT',
  building: 'BUILDING_FUND',
  special: 'PROJECT',
  other: 'OTHER',
};

// Payment method info for display
const paymentMethods = [
  {
    id: 'mobile_money',
    name: 'Mobile Money',
    description: 'MTN Mobile Money & Orange Money',
    icon: Smartphone,
    available: true,
  },
  {
    id: 'card',
    name: 'Card Payment',
    description: 'Visa, Mastercard, Amex via Paystack',
    icon: CreditCard,
    available: true,
  },
  {
    id: 'bank_transfer',
    name: 'Bank Transfer',
    description: 'Direct bank transfer via Paystack',
    icon: Building,
    available: true,
  },
];

export default function GivePage() {
  const router = useRouter();
  const { user } = useAuth();
  const { initiatePayment, isLoading } = usePaymentMutations();
  const { addToast } = useToast();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentData, setPaymentData] = useState<GivingInput | null>(null);
  const [paymentResponse, setPaymentResponse] = useState<{
    authorizationUrl?: string;
    reference: string;
    provider: string;
  } | null>(null);

  const handleFormSubmit = async (data: GivingInput) => {
    setPaymentData(data);
    setShowPaymentModal(true);
  };

  const handleConfirmPayment = async () => {
    if (!paymentData) return;

    try {
      // Map form data to payment request
      const provider = paymentMethodToProvider[paymentData.paymentMethod];

      const request: PaymentRequest = {
        amount: paymentData.amount,
        currency: paymentData.currency,
        phoneNumber: paymentData.phoneNumber,
        provider,
        description: paymentData.message || `${donationTypeMap[paymentData.type]} donation`,
        donationType: donationTypeMap[paymentData.type] as PaymentRequest['donationType'],
        donorName: user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : undefined,
        donorEmail: user?.email,
        callbackUrl: `${window.location.origin}/giving/verify`,
        channels: paymentData.paymentMethod === 'card'
          ? ['card']
          : paymentData.paymentMethod === 'bank_transfer'
          ? ['bank']
          : ['mobile_money'],
      };

      const response = await initiatePayment(request);

      if (response.authorizationUrl) {
        // Paystack redirect flow
        setPaymentResponse({
          authorizationUrl: response.authorizationUrl,
          reference: response.reference,
          provider: response.provider,
        });
      } else {
        // Mobile money - show confirmation
        addToast('Payment initiated! Please check your phone to confirm.', 'success');
        setShowPaymentModal(false);

        // Redirect to verification page
        router.push(`/giving/verify?reference=${response.reference}&provider=${response.provider}`);
      }
    } catch (error) {
      addToast(error instanceof Error ? error.message : 'Payment failed. Please try again.', 'error');
    }
  };

  const handlePaystackRedirect = () => {
    if (paymentResponse?.authorizationUrl) {
      window.location.href = paymentResponse.authorizationUrl;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-authority-black py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Heart className="w-12 h-12 text-gold-400 mx-auto mb-6" />
            <h1 className="text-white mb-4">
              Give with <span className="text-gold-gradient">Joy</span>
            </h1>
            <p className="text-gray-300 max-w-2xl mx-auto text-lg">
              &quot;Each of you should give what you have decided in your heart to give,
              not reluctantly or under compulsion, for God loves a cheerful giver.&quot;
              <span className="block mt-2 text-gold-400">— 2 Corinthians 9:7</span>
            </p>
          </motion.div>
        </div>
      </section>

      {/* Payment Options Info */}
      <section className="py-12 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {paymentMethods.map((method) => {
              const Icon = method.icon;
              return (
                <div
                  key={method.id}
                  className="flex items-start space-x-4 p-4 rounded-lg bg-gray-50"
                >
                  <div className="w-10 h-10 rounded-lg bg-gold-100 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-gold-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{method.name}</h3>
                    <p className="text-sm text-gray-600">{method.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Form */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Make a Donation
              </h2>
              <p className="text-gray-600">
                Your generous support helps us spread the Gospel and serve our community.
              </p>
            </div>

            <GivingForm onSubmit={handleFormSubmit} isLoading={isLoading} />
          </div>

          {/* Security Note */}
          <div className="mt-8 flex items-center justify-center space-x-2 text-sm text-gray-500">
            <Shield className="w-4 h-4" />
            <span>Secure payment processing. Your information is protected.</span>
          </div>

          {/* International Note */}
          <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-gray-500">
            <Globe className="w-4 h-4" />
            <span>International payments accepted via Paystack</span>
          </div>
        </div>
      </section>

      {/* Payment Confirmation Modal */}
      <Modal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        title="Confirm Your Donation"
        size="md"
      >
        {paymentResponse?.authorizationUrl ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-8 h-8 text-gold-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Redirect to Paystack
            </h3>
            <p className="text-gray-600 mb-6">
              You will be redirected to our secure payment partner to complete your donation.
            </p>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowPaymentModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handlePaystackRedirect}
                variant="gold"
                className="flex-1"
              >
                Proceed to Payment
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {paymentData && (
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-semibold">
                    {paymentData.amount.toLocaleString()} {paymentData.currency}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-semibold capitalize">{paymentData.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Method:</span>
                  <span className="font-semibold capitalize">
                    {paymentData.paymentMethod.replace('_', ' ')}
                  </span>
                </div>
                {paymentData.phoneNumber && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span className="font-semibold">{paymentData.phoneNumber}</span>
                  </div>
                )}
              </div>
            )}

            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowPaymentModal(false)}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                onClick={handleConfirmPayment}
                isLoading={isLoading}
                variant="gold"
                className="flex-1"
              >
                Confirm Payment
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
