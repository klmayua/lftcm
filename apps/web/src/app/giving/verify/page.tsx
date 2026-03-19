'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Loader2, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { usePaymentMutations } from '@/hooks/useGiving';

export default function VerifyPaymentPage() {
  const searchParams = useSearchParams();
  const reference = searchParams.get('reference');
  const provider = searchParams.get('provider') as 'MTN' | 'ORANGE' | 'PAYSTACK' | null;
  const trxref = searchParams.get('trxref'); // Paystack reference

  const { verifyPayment, generateReceipt, isLoading } = usePaymentMutations();
  const [status, setStatus] = useState<'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REFUNDED' | 'CANCELLED' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [receiptGenerated, setReceiptGenerated] = useState(false);

  useEffect(() => {
    const checkPayment = async () => {
      // Use trxref for Paystack (from callback URL) or reference from query params
      const transactionId = trxref || reference;
      const paymentProvider = provider || (trxref ? 'PAYSTACK' : null);

      if (!transactionId || !paymentProvider) {
        setError('Invalid payment reference');
        return;
      }

      try {
        const result = await verifyPayment(transactionId, paymentProvider);
        setStatus(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to verify payment');
      }
    };

    checkPayment();
  }, [reference, provider, trxref, verifyPayment]);

  const handleGenerateReceipt = async () => {
    if (!reference) return;

    try {
      await generateReceipt(reference);
      setReceiptGenerated(true);
    } catch (err) {
      // Receipt generation failed, but payment was successful
      console.error('Failed to generate receipt:', err);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center"
        >
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Verification Failed
          </h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link href="/give">
            <Button className="w-full">Try Again</Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  if (isLoading || !status) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <Loader2 className="w-12 h-12 text-gold-500 mx-auto mb-4 animate-spin" />
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            Verifying Payment...
          </h1>
          <p className="text-gray-600">
            Please wait while we confirm your donation.
          </p>
        </div>
      </div>
    );
  }

  if (status === 'COMPLETED') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center"
        >
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Thank You!
          </h1>
          <p className="text-gray-600 mb-6">
            Your donation has been received successfully. May God bless your generosity!
          </p>

          {!receiptGenerated ? (
            <Button
              onClick={handleGenerateReceipt}
              isLoading={isLoading}
              variant="outline"
              className="w-full mb-3"
            >
              <Receipt className="w-4 h-4 mr-2" />
              Generate Receipt
            </Button>
          ) : (
            <p className="text-sm text-green-600 mb-3">
              Receipt generated successfully!
            </p>
          )}

          <Link href="/">
            <Button className="w-full">Return Home</Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  if (status === 'FAILED') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center"
        >
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Payment Failed
          </h1>
          <p className="text-gray-600 mb-6">
            We couldn&#39;t process your donation. Please try again or contact support.
          </p>
          <Link href="/give">
            <Button className="w-full">Try Again</Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  // PENDING status
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        <Loader2 className="w-12 h-12 text-gold-500 mx-auto mb-4 animate-spin" />
        <h1 className="text-xl font-semibold text-gray-900 mb-2">
          Payment Pending
        </h1>
        <p className="text-gray-600 mb-4">
          Your payment is being processed. This may take a few moments.
        </p>
        <p className="text-sm text-gray-500">
          Reference: {reference || trxref}
        </p>
      </div>
    </div>
  );
}
