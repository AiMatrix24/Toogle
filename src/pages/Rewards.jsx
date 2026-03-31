import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Gift, Star, Trophy, TrendingUp, DollarSign, Award, Zap, ChevronRight } from 'lucide-react'
import { rewards as rewardsApi } from '../lib/api'

const TIER_CONFIG = {
  Bronze: { color: '#CD7F32', min: 0, max: 499, next: 'Silver', nextMin: 500 },
  Silver: { color: '#C0C0C0', min: 500, max: 1499, next: 'Gold', nextMin: 1500 },
  Gold: { color: '#FFD700', min: 1500, max: 2999, next: 'Platinum', nextMin: 3000 },
  Platinum: { color: '#E5E4E2', min: 3000, max: Infinity, next: null, nextMin: null },
}

const EARN_METHODS = [
  { icon: Star, title: 'Complete booking', points: 100, description: 'Book and complete a service' },
  { icon: Award, title: 'Leave review', points: 50, description: 'Rate your experience' },
  { icon: Gift, title: 'Refer a friend', points: 200, description: 'Share your referral code' },
  { icon: Zap, title: 'New provider bonus', points: 75, description: 'Try a new provider' },
  { icon: Trophy, title: '5-star review bonus', points: 25, description: 'Leave a perfect rating' },
  { icon: TrendingUp, title: 'Streak bonus', points: 150, description: '3 bookings in a row' },
]

const CATALOG_ITEMS = [
  { id: 1, title: '$10 off next booking', points: 500, icon: DollarSign, description: 'Applied at checkout' },
  { id: 2, title: 'Service fee waiver', points: 300, icon: Zap, description: 'One-time fee removal' },
  { id: 3, title: 'Priority matching', points: 400, icon: TrendingUp, description: 'Get matched faster' },
  { id: 4, title: 'Featured review badge', points: 200, icon: Award, description: 'Stand out on reviews' },
]

const STORAGE_KEY = 'toggle_rewards'

function getTier(points) {
  if (points >= 3000) return 'Platinum'
  if (points >= 1500) return 'Gold'
  if (points >= 500) return 'Silver'
  return 'Bronze'
}

export default function Rewards() {
  const [rewardsData, setRewardsData] = useState({
    points: 0, history: [], redeemedItems: [],
  })

  useEffect(() => {
    rewardsApi.get().then(data => {
      setRewardsData(prev => ({
        ...prev,
        points: data.points || 0,
        history: data.history || [],
      }))
    }).catch(() => {
      // Fallback to localStorage
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) setRewardsData(JSON.parse(stored))
      } catch {}
    })
  }, [])

  const [animatePoints, setAnimatePoints] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setAnimatePoints(true), 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rewardsData))
  }, [rewardsData])

  const currentTier = getTier(rewardsData.points)
  const tierConfig = TIER_CONFIG[currentTier]

  const progressToNext = useMemo(() => {
    if (!tierConfig.next) return 100
    const range = tierConfig.nextMin - tierConfig.min
    const progress = rewardsData.points - tierConfig.min
    return Math.min((progress / range) * 100, 100)
  }, [rewardsData.points, tierConfig])

  const pointsToNext = tierConfig.next ? tierConfig.nextMin - rewardsData.points : 0

  const handleRedeem = (item) => {
    if (rewardsData.points < item.points) return
    const newEntry = {
      id: Date.now(),
      action: `Redeemed: ${item.title}`,
      points: -item.points,
      date: new Date().toISOString().split('T')[0],
      type: 'redeem',
    }
    setRewardsData(prev => ({
      ...prev,
      points: prev.points - item.points,
      history: [newEntry, ...prev.history],
      redeemedItems: [...prev.redeemedItems, item.id],
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-6">
        <div className="flex items-center gap-3 mb-2">
          <Trophy size={28} />
          <h1 className="text-2xl font-bold">Rewards</h1>
        </div>
        <p className="text-amber-100 text-sm">Earn points, unlock perks, save more</p>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Points Balance */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Your Points Balance</p>
          <p
            className={`text-5xl font-bold text-gray-900 transition-all duration-1000 ${
              animatePoints ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            {rewardsData.points.toLocaleString()}
          </p>
          <p className="text-sm text-gray-400 mt-1">points</p>
        </div>

        {/* Tier System */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              <Award size={18} />
              Your Tier
            </h2>
            <div
              className="px-3 py-1.5 rounded-full font-bold text-sm border-2"
              style={{
                backgroundColor: `${tierConfig.color}20`,
                borderColor: tierConfig.color,
                color: currentTier === 'Silver' || currentTier === 'Platinum' ? '#555' : tierConfig.color,
              }}
            >
              {currentTier}
            </div>
          </div>

          {/* Tier Progress Bar */}
          <div className="mb-3">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>{currentTier}</span>
              {tierConfig.next && <span>{tierConfig.next}</span>}
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3">
              <div
                className="h-3 rounded-full transition-all duration-1000"
                style={{ width: `${progressToNext}%`, backgroundColor: tierConfig.color }}
              />
            </div>
            {tierConfig.next ? (
              <p className="text-xs text-gray-500 mt-1">{pointsToNext} points to {tierConfig.next}</p>
            ) : (
              <p className="text-xs text-gray-500 mt-1">You have reached the highest tier!</p>
            )}
          </div>

          {/* All Tiers */}
          <div className="grid grid-cols-4 gap-2 mt-4">
            {Object.entries(TIER_CONFIG).map(([name, config]) => (
              <div
                key={name}
                className={`text-center p-2 rounded-lg border ${
                  name === currentTier ? 'border-2 shadow-sm' : 'border-gray-100 opacity-60'
                }`}
                style={name === currentTier ? { borderColor: config.color } : {}}
              >
                <div
                  className="w-8 h-8 rounded-full mx-auto mb-1 flex items-center justify-center"
                  style={{ backgroundColor: config.color }}
                >
                  <Star size={14} className="text-white" />
                </div>
                <p className="text-xs font-medium text-gray-700">{name}</p>
                <p className="text-xs text-gray-400">{config.min}+</p>
              </div>
            ))}
          </div>
        </div>

        {/* How to Earn */}
        <div>
          <h2 className="font-bold text-gray-900 flex items-center gap-2 mb-3">
            <TrendingUp size={18} />
            How to Earn
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {EARN_METHODS.map((method, index) => (
              <div key={index} className="bg-white rounded-xl border border-gray-200 p-3 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                    <method.icon size={16} className="text-amber-600" />
                  </div>
                  <span className="text-green-600 font-bold text-sm">+{method.points}</span>
                </div>
                <p className="text-sm font-semibold text-gray-900">{method.title}</p>
                <p className="text-xs text-gray-500">{method.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Rewards Catalog */}
        <div>
          <h2 className="font-bold text-gray-900 flex items-center gap-2 mb-3">
            <Gift size={18} />
            Rewards Catalog
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {CATALOG_ITEMS.map(item => {
              const canAfford = rewardsData.points >= item.points
              return (
                <div key={item.id} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex flex-col">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center mb-3">
                    <item.icon size={20} className="text-purple-600" />
                  </div>
                  <h3 className="font-bold text-sm text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-xs text-gray-500 mb-2">{item.description}</p>
                  <p className="text-sm font-bold text-amber-600 mb-3">{item.points} pts</p>
                  <button
                    onClick={() => handleRedeem(item)}
                    disabled={!canAfford}
                    className={`mt-auto w-full py-2 rounded-lg text-sm font-bold transition-all ${
                      canAfford
                        ? 'bg-purple-600 hover:bg-purple-700 text-white'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {canAfford ? 'Redeem' : 'Not enough pts'}
                  </button>
                </div>
              )
            })}
          </div>
        </div>

        {/* Points History */}
        <div>
          <h2 className="font-bold text-gray-900 flex items-center gap-2 mb-3">
            <DollarSign size={18} />
            Points History
          </h2>
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-xs text-gray-500 uppercase">
                  <th className="text-left px-4 py-3 font-medium">Date</th>
                  <th className="text-left px-4 py-3 font-medium">Action</th>
                  <th className="text-right px-4 py-3 font-medium">Points</th>
                </tr>
              </thead>
              <tbody>
                {rewardsData.history.map(entry => (
                  <tr key={entry.id} className="border-t border-gray-100">
                    <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{entry.date}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{entry.action}</td>
                    <td className={`px-4 py-3 text-sm font-bold text-right ${
                      entry.type === 'earn' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {entry.type === 'earn' ? '+' : ''}{entry.points}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
