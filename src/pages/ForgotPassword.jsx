import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Key, Lock, CheckCircle, ArrowLeft } from 'lucide-react'
import { auth } from '../lib/api'

export default function ForgotPassword() {
  const [step, setStep] = useState(1) // 1=email, 2=code, 3=new password, 4=success
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [devCode, setDevCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleRequestCode = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const result = await auth.forgotPassword(email)
      if (result.devCode) setDevCode(result.devCode)
      setStep(2)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setError('')
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    setLoading(true)
    try {
      await auth.resetPassword(email, code, newPassword)
      setStep(4)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-brand-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Key size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {step === 4 ? 'Password Reset!' : 'Reset Your Password'}
          </h1>
          <p className="text-gray-500 mt-1">
            {step === 1 && "Enter your email to receive a reset code"}
            {step === 2 && "Enter the 6-digit code we sent you"}
            {step === 3 && "Choose your new password"}
            {step === 4 && "You can now sign in with your new password"}
          </p>
        </div>

        <div className="card p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>
          )}

          {step === 1 && (
            <form onSubmit={handleRequestCode} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    required placeholder="you@email.com" className="input-field pl-11" />
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
                {loading ? 'Sending...' : 'Send Reset Code'}
              </button>
            </form>
          )}

          {step === 2 && (
            <div className="space-y-4">
              {devCode && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-700 text-sm">
                  Dev mode - your code is: <strong>{devCode}</strong>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">6-Digit Code</label>
                <input type="text" value={code} onChange={(e) => setCode(e.target.value)}
                  maxLength={6} placeholder="000000"
                  className="input-field text-center text-2xl tracking-[0.5em] font-mono" />
              </div>
              <button onClick={() => code.length === 6 && setStep(3)}
                disabled={code.length !== 6}
                className="btn-primary w-full disabled:opacity-50">
                Verify Code
              </button>
            </div>
          )}

          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                    required minLength={6} placeholder="Min 6 characters" className="input-field pl-11" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                    required placeholder="Confirm password" className="input-field pl-11" />
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          )}

          {step === 4 && (
            <div className="text-center">
              <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
              <button onClick={() => navigate('/login')} className="btn-primary w-full">
                Sign In Now
              </button>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <Link to="/login" className="text-sm text-brand-600 font-medium hover:text-brand-700 flex items-center justify-center gap-1">
              <ArrowLeft size={14} /> Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
