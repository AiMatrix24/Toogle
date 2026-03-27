import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { CreditCard, Shield, Lock, CheckCircle, DollarSign, ArrowRight } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'

export default function Checkout({ providers }) {
  const { providerId } = useParams()
  const provider = providers?.find(p => p.id === parseInt(providerId)) || providers?.[0]
  const [step, setStep] = useState('review') // review -> payment -> success
  const [paymentMethod, setPaymentMethod] = useState('samiteon')

  const orderSummary = {
    service: provider?.services?.[0] || 'General Service',
    provider: provider?.name || 'Provider',
    subtotal: provider?.hourlyRate || 85,
    serviceFee: 5,
    tax: Math.round((provider?.hourlyRate || 85) * 0.09),
  }
  orderSummary.total = orderSummary.subtotal + orderSummary.serviceFee + orderSummary.tax

  const contractId = `SC-${Date.now()}`

  if (step === 'success') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <div className="card p-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
          <p className="text-gray-500 mb-6">Your payment has been processed via Samiteon</p>

          <div className="bg-gray-50 rounded-2xl p-5 text-left mb-6 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Amount Paid</span><span className="font-bold text-lg">${orderSummary.total}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Provider</span><span className="font-medium">{orderSummary.provider}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Service</span><span className="font-medium">{orderSummary.service}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Transaction ID</span><span className="font-mono text-xs">{contractId}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Payment Method</span><span className="font-medium">Samiteon **** 8842</span></div>
          </div>

          <div className="inline-block p-3 bg-white border-2 border-gray-100 rounded-xl mb-4">
            <QRCodeSVG value={JSON.stringify({ contractId, amount: orderSummary.total, chain: 'toogle-chain' })}
              size={140} level="H" fgColor="#5b21b6" />
          </div>
          <p className="text-xs text-gray-400 mb-6">Receipt recorded on blockchain - Scan to verify</p>

          <div className="flex gap-3 justify-center">
            <Link to="/contracts" className="btn-primary">View Contracts</Link>
            <Link to="/" className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50">Back to Home</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {/* Payment Method */}
          <div className="card p-6">
            <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CreditCard size={18} /> Payment Method
            </h2>

            <div className="space-y-3">
              <label onClick={() => setPaymentMethod('samiteon')}
                className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer border-2 transition-colors ${
                  paymentMethod === 'samiteon' ? 'border-samiteon-500 bg-samiteon-500/5' : 'border-gray-100 hover:border-gray-200'
                }`}>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  paymentMethod === 'samiteon' ? 'border-samiteon-500' : 'border-gray-300'
                }`}>
                  {paymentMethod === 'samiteon' && <div className="w-3 h-3 rounded-full bg-samiteon-500" />}
                </div>
                <div className="w-12 h-8 bg-gradient-to-r from-samiteon-500 to-samiteon-700 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xs">S</span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">Samiteon Charge Card</p>
                  <p className="text-xs text-gray-400">**** **** **** 8842</p>
                </div>
                <Shield size={16} className="text-samiteon-500" />
              </label>

              <label onClick={() => setPaymentMethod('card')}
                className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer border-2 transition-colors ${
                  paymentMethod === 'card' ? 'border-brand-500 bg-brand-50' : 'border-gray-100 hover:border-gray-200'
                }`}>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  paymentMethod === 'card' ? 'border-brand-500' : 'border-gray-300'
                }`}>
                  {paymentMethod === 'card' && <div className="w-3 h-3 rounded-full bg-brand-500" />}
                </div>
                <div className="w-12 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                  <CreditCard size={16} className="text-gray-500" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">Credit / Debit Card</p>
                  <p className="text-xs text-gray-400">Visa, Mastercard, Amex</p>
                </div>
              </label>
            </div>

            {paymentMethod === 'card' && (
              <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                <input type="text" placeholder="Card Number" className="input-field" />
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" placeholder="MM / YY" className="input-field" />
                  <input type="text" placeholder="CVC" className="input-field" />
                </div>
                <input type="text" placeholder="Cardholder Name" className="input-field" />
              </div>
            )}
          </div>

          {/* Billing Address */}
          <div className="card p-6">
            <h2 className="font-bold text-gray-900 mb-4">Billing Address</h2>
            <div className="space-y-3">
              <input type="text" defaultValue="456 Oak Ave" placeholder="Street Address" className="input-field" />
              <div className="grid grid-cols-3 gap-3">
                <input type="text" defaultValue="Los Angeles" placeholder="City" className="input-field" />
                <input type="text" defaultValue="CA" placeholder="State" className="input-field" />
                <input type="text" defaultValue="90012" placeholder="ZIP" className="input-field" />
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="card p-6 h-fit sticky top-24">
          <h2 className="font-bold text-gray-900 mb-4">Order Summary</h2>
          <div className="space-y-3 text-sm mb-4">
            <div className="flex justify-between"><span className="text-gray-500">Service</span><span className="font-medium">{orderSummary.service}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Provider</span><span className="font-medium">{orderSummary.provider}</span></div>
            <div className="border-t border-gray-100 pt-3 flex justify-between"><span className="text-gray-500">Subtotal</span><span>${orderSummary.subtotal}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Service Fee</span><span>${orderSummary.serviceFee}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Tax</span><span>${orderSummary.tax}</span></div>
            <div className="border-t border-gray-100 pt-3 flex justify-between text-base">
              <span className="font-bold">Total</span>
              <span className="font-bold text-lg">${orderSummary.total}</span>
            </div>
          </div>

          <button onClick={() => setStep('success')}
            className={`w-full py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors ${
              paymentMethod === 'samiteon'
                ? 'bg-samiteon-600 hover:bg-samiteon-700 text-white'
                : 'bg-brand-600 hover:bg-brand-700 text-white'
            }`}>
            <Lock size={16} /> Pay ${orderSummary.total}
          </button>
          <p className="text-xs text-gray-400 text-center mt-3 flex items-center justify-center gap-1">
            <Shield size={12} /> Secured by Samiteon & blockchain verification
          </p>
        </div>
      </div>
    </div>
  )
}
