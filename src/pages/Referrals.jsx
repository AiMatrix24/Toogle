import { useState, useEffect } from 'react'
import { Share2, Copy, Gift, Users, TrendingUp, Mail, MessageSquare, CheckCircle, Award, Crown } from 'lucide-react'
import { referrals as referralsApi } from '../lib/api'

const statusStyles = {
  'Signed Up': 'bg-yellow-100 text-yellow-700',
  'First Booking': 'bg-blue-100 text-blue-700',
  'Credit Earned': 'bg-green-100 text-green-700',
}

export default function Referrals() {
  const [copied, setCopied] = useState(false)
  const [refData, setRefData] = useState({
    code: 'LOADING', totalReferrals: 0, pendingReferrals: 0,
    earnedCredit: 0, successfulConversions: 0, history: [], leaderboard: [],
  })

  useEffect(() => {
    referralsApi.get().then(data => {
      setRefData({ ...data, leaderboard: data.leaderboard || [
        { rank: 1, name: 'Jessica W.', referrals: 12, reward: 300 },
        { rank: 2, name: 'Marcus D.', referrals: 9, reward: 225 },
        { rank: 3, name: 'You', referrals: data.totalReferrals || 0, reward: data.earnedCredit || 0 },
      ] })
    }).catch(() => {})
  }, [])

  const handleCopyCode = () => {
    navigator.clipboard.writeText(refData.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://toggle.app/ref/${refData.code}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const stats = [
    { label: 'Total Referrals', value: refData.totalReferrals, icon: Users, color: 'text-blue-600 bg-blue-50' },
    { label: 'Pending', value: refData.pendingReferrals, icon: TrendingUp, color: 'text-yellow-600 bg-yellow-50' },
    { label: 'Earned Credit', value: `$${refData.earnedCredit}`, icon: Gift, color: 'text-green-600 bg-green-50' },
    { label: 'Conversions', value: refData.successfulConversions, icon: CheckCircle, color: 'text-purple-600 bg-purple-50' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 text-white">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Share2 size={32} />
          </div>
          <h1 className="text-4xl font-bold mb-3">Share Toggle, Earn Rewards</h1>
          <p className="text-blue-100 text-lg max-w-xl mx-auto">
            Invite friends to Toggle and you both earn $25 credit toward your next service booking.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* How It Works */}
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 mb-8">
          <h2 className="text-xl font-bold text-gray-900 text-center mb-8">How It Works</h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center flex-1">
              <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold mb-3">
                1
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Share your code</h3>
              <p className="text-sm text-gray-500">Send your unique referral code to friends</p>
            </div>

            {/* Connector */}
            <div className="hidden md:block w-16 h-0.5 bg-blue-200 mt-[-2rem]" />
            <div className="md:hidden h-8 w-0.5 bg-blue-200" />

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center flex-1">
              <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold mb-3">
                2
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Friend signs up</h3>
              <p className="text-sm text-gray-500">They create an account and book a service</p>
            </div>

            {/* Connector */}
            <div className="hidden md:block w-16 h-0.5 bg-blue-200 mt-[-2rem]" />
            <div className="md:hidden h-8 w-0.5 bg-blue-200" />

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center flex-1">
              <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold mb-3">
                3
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">You both earn $25</h3>
              <p className="text-sm text-gray-500">Credit is applied to both accounts instantly</p>
            </div>
          </div>
        </div>

        {/* Referral Code Card */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Referral Code</h2>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex-1 w-full bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl px-6 py-4 text-center">
              <span className="text-2xl font-mono font-bold text-gray-900 tracking-wider">
                {refData.code}
              </span>
            </div>
            <button
              onClick={handleCopyCode}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors min-w-[120px] justify-center"
            >
              {copied ? (
                <>
                  <CheckCircle size={18} />
                  Copied!
                </>
              ) : (
                <>
                  <Copy size={18} />
                  Copy
                </>
              )}
            </button>
          </div>

          {/* Share Buttons */}
          <div className="flex flex-wrap items-center gap-3 mt-5 pt-5 border-t border-gray-100">
            <span className="text-sm text-gray-500 mr-1">Share via:</span>
            <a
              href={`mailto:?subject=Join%20me%20on%20Toggle&body=Use%20my%20referral%20code%20${refData.code}%20to%20get%20%2425%20off%20your%20first%20booking!%20https://toggle.app/ref/${refData.code}`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
            >
              <Mail size={16} />
              Email
            </a>
            <a
              href={`sms:?body=Join%20me%20on%20Toggle!%20Use%20code%20${refData.code}%20for%20%2425%20off.%20https://toggle.app/ref/${refData.code}`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
            >
              <MessageSquare size={16} />
              SMS
            </a>
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
            >
              <Copy size={16} />
              Copy Link
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map(stat => {
            const Icon = stat.icon
            return (
              <div key={stat.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${stat.color}`}>
                  <Icon size={20} />
                </div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            )
          })}
        </div>

        {/* Referral History Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Referral History</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-500 bg-gray-50">
                  <th className="px-6 py-3 font-medium">Friend Name</th>
                  <th className="px-6 py-3 font-medium">Date</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium text-right">Reward</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {refData.history.map(ref => (
                  <tr key={ref.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{ref.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{ref.date}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[ref.status] || 'bg-gray-100 text-gray-700'}`}>
                        {ref.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-right">
                      {ref.reward > 0 ? (
                        <span className="text-green-600">${ref.reward}</span>
                      ) : (
                        <span className="text-gray-400">--</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Monthly Leaderboard */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Award size={20} className="text-yellow-500" />
              Monthly Leaderboard
            </h2>
          </div>
          <div className="divide-y divide-gray-100">
            {refData.leaderboard.map(entry => {
              const isCurrentUser = entry.name === 'John D.'
              return (
                <div
                  key={entry.rank}
                  className={`flex items-center gap-4 px-6 py-4 transition-colors ${
                    isCurrentUser ? 'bg-blue-50 border-l-4 border-blue-600' : 'hover:bg-gray-50'
                  }`}
                >
                  {/* Rank */}
                  <div className="w-8 flex-shrink-0 text-center">
                    {entry.rank === 1 ? (
                      <Crown size={22} className="text-yellow-500 mx-auto" />
                    ) : (
                      <span className="text-lg font-bold text-gray-400">#{entry.rank}</span>
                    )}
                  </div>

                  {/* Name */}
                  <div className="flex-1">
                    <p className={`font-medium ${isCurrentUser ? 'text-blue-700' : 'text-gray-900'}`}>
                      {entry.name}
                      {isCurrentUser && (
                        <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-medium">
                          You
                        </span>
                      )}
                    </p>
                  </div>

                  {/* Referrals Count */}
                  <div className="text-center px-4">
                    <p className="text-sm font-bold text-gray-900">{entry.referrals}</p>
                    <p className="text-xs text-gray-500">referrals</p>
                  </div>

                  {/* Reward */}
                  <div className="text-right">
                    <p className="text-sm font-bold text-green-600">${entry.reward}</p>
                    <p className="text-xs text-gray-500">earned</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
