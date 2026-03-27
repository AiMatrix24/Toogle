import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Star, Camera, CheckCircle, ThumbsUp } from 'lucide-react'

export default function ReviewSubmit() {
  const navigate = useNavigate()
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [review, setReview] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [tags, setTags] = useState([])

  const tagOptions = ['Professional', 'On Time', 'Clean Work', 'Fair Price', 'Friendly', 'Skilled', 'Fast', 'Recommended']

  const toggleTag = (tag) => {
    setTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])
  }

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="card p-8">
          <CheckCircle size={56} className="mx-auto text-accent-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Review Submitted!</h2>
          <p className="text-gray-500 mb-6">Thank you for helping the Toogle community</p>
          <button onClick={() => navigate('/')} className="btn-primary">Back to Home</button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Leave a Review</h1>
      <p className="text-gray-500 mb-6">How was your experience with Mike's Plumbing Pro?</p>

      <div className="card p-6 space-y-6">
        {/* Provider */}
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
          <div className="w-12 h-12 rounded-xl bg-brand-600 flex items-center justify-center text-white font-bold text-lg">M</div>
          <div>
            <h3 className="font-semibold">Mike's Plumbing Pro</h3>
            <p className="text-sm text-gray-500">Leak Repair &middot; March 20, 2026</p>
          </div>
        </div>

        {/* Star Rating */}
        <div className="text-center">
          <p className="text-sm font-medium text-gray-700 mb-3">Overall Rating</p>
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3, 4, 5].map(i => (
              <button key={i} onClick={() => setRating(i)}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(0)}
                className="transition-transform hover:scale-110">
                <Star size={36} className={`transition-colors ${
                  i <= (hover || rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                }`} />
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-400 mt-2">
            {rating === 1 && 'Poor'}{rating === 2 && 'Below Average'}{rating === 3 && 'Average'}
            {rating === 4 && 'Good'}{rating === 5 && 'Excellent'}
          </p>
        </div>

        {/* Quick Tags */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">What stood out?</p>
          <div className="flex flex-wrap gap-2">
            {tagOptions.map(tag => (
              <button key={tag} onClick={() => toggleTag(tag)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  tags.includes(tag) ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}>
                {tags.includes(tag) && <ThumbsUp size={12} className="inline mr-1" />}
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Written Review */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Your Review</label>
          <textarea value={review} onChange={(e) => setReview(e.target.value)}
            placeholder="Share details about your experience..."
            className="input-field h-28 resize-none" />
        </div>

        {/* Photo Upload */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Add Photos (optional)</p>
          <div className="flex gap-3">
            <div className="w-20 h-20 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center cursor-pointer hover:border-brand-300 transition-colors">
              <Camera size={24} className="text-gray-300" />
            </div>
          </div>
        </div>

        <button onClick={() => setSubmitted(true)}
          disabled={rating === 0}
          className={`w-full py-3.5 rounded-xl font-semibold transition-all ${
            rating > 0 ? 'bg-brand-600 text-white hover:bg-brand-700' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}>
          Submit Review
        </button>
      </div>
    </div>
  )
}
