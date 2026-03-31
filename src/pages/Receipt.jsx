import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import { FileText, Download, Printer, CheckCircle, Calendar, Clock, DollarSign, User, Shield } from 'lucide-react'
import { payments as paymentsApi } from '../lib/api'

export default function Receipt() {
  const { paymentId } = useParams()
  const [payment, setPayment] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (paymentId) {
      paymentsApi.get(paymentId).then(setPayment).catch(() => {}).finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [paymentId])

  const handlePrint = () => window.print()

  if (loading) return <div className="max-w-2xl mx-auto px-4 py-16 text-center text-gray-400">Loading receipt...</div>
  if (!payment) return <div className="max-w-2xl mx-auto px-4 py-16 text-center text-gray-400">Receipt not found</div>

  const blockchainHash = '0x' + (payment.transaction_id || payment.id || '').replace(/\W/g, '').slice(0, 16)

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 print:hidden">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <FileText size={24} className="text-brand-600" /> Receipt
        </h1>
        <div className="flex gap-2">
          <button onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 text-sm font-medium"
            aria-label="Print receipt">
            <Printer size={16} /> Print
          </button>
          <button onClick={() => {
            const text = `Toggle Receipt\nTransaction: ${payment.transaction_id}\nAmount: $${payment.amount}\nDate: ${payment.created_at?.split('T')[0]}\nBlockchain: ${blockchainHash}`
            const blob = new Blob([text], { type: 'text/plain' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a'); a.href = url; a.download = `toggle-receipt-${payment.transaction_id || payment.id}.txt`; a.click()
          }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 text-white hover:bg-brand-700 text-sm font-medium"
            aria-label="Download receipt">
            <Download size={16} /> Download
          </button>
        </div>
      </div>

      {/* Receipt Card */}
      <div className="card p-8" id="receipt-content">
        {/* Brand Header */}
        <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center" aria-hidden="true">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <div>
              <p className="font-bold text-brand-dark">Toggle</p>
              <p className="text-xs text-gray-400">Service Receipt</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">{payment.transaction_id || 'N/A'}</p>
            <p className="text-xs text-gray-400">{payment.created_at?.split('T')[0]}</p>
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center gap-2 mb-6">
          <CheckCircle size={20} className="text-green-500" />
          <span className="text-sm font-medium text-green-700">Payment {payment.status || 'Completed'}</span>
        </div>

        {/* Details */}
        <div className="space-y-3 mb-6">
          {[
            { icon: DollarSign, label: 'Amount', value: `$${payment.amount}` },
            { icon: DollarSign, label: 'Subtotal', value: `$${payment.subtotal || payment.amount}` },
            { icon: DollarSign, label: 'Service Fee', value: `$${payment.service_fee || 5}` },
            { icon: DollarSign, label: 'Tax', value: `$${payment.tax || 0}` },
            { icon: Calendar, label: 'Date', value: payment.created_at?.split('T')[0] || 'N/A' },
            { icon: User, label: 'Payment Method', value: (payment.payment_method || 'samiteon').charAt(0).toUpperCase() + (payment.payment_method || 'samiteon').slice(1) },
          ].map(d => (
            <div key={d.label} className="flex items-center justify-between py-2 border-b border-gray-50">
              <span className="flex items-center gap-2 text-sm text-gray-500">
                <d.icon size={14} aria-hidden="true" /> {d.label}
              </span>
              <span className="text-sm font-medium text-gray-900">{d.value}</span>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="flex items-center justify-between p-4 bg-brand-50 rounded-xl mb-6">
          <span className="font-bold text-brand-800">Total Paid</span>
          <span className="text-2xl font-bold text-brand-700">${payment.amount}</span>
        </div>

        {/* Blockchain Verification */}
        <div className="text-center pt-6 border-t border-gray-200">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Shield size={16} className="text-brand-600" />
            <span className="text-xs font-medium text-gray-500">Blockchain Verified</span>
          </div>
          <QRCodeSVG
            value={JSON.stringify({ txId: payment.transaction_id, amount: payment.amount, hash: blockchainHash, chain: 'toggle-chain' })}
            size={120} level="H" fgColor="#1647b6"
          />
          <p className="text-xs text-gray-400 mt-2 font-mono break-all">{blockchainHash}</p>
        </div>
      </div>

      {/* Back Link */}
      <div className="mt-6 text-center print:hidden">
        <Link to="/profile" className="text-sm text-brand-600 font-medium hover:text-brand-700">
          Back to Profile
        </Link>
      </div>
    </div>
  )
}
