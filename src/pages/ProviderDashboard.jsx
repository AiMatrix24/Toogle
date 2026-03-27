import { useState } from 'react'
import { Eye, Upload, FileText, Mic, Play, Image, PenLine } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function ProviderDashboard({ providers, toggleAvailability }) {
  const [activeTab, setActiveTab] = useState('status')
  const [blogTitle, setBlogTitle] = useState('')
  const [blogContent, setBlogContent] = useState('')
  const [uploadType, setUploadType] = useState('video')

  const myProvider = providers[0] // Simulating logged-in provider

  const tabs = [
    { id: 'status', label: 'Availability' },
    { id: 'media', label: 'Upload Media' },
    { id: 'blog', label: 'Write Blog' },
    { id: 'services', label: 'My Services' },
  ]

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Provider Dashboard</h1>
          <p className="text-gray-500">Manage your availability, services, and content</p>
        </div>
        <Link to={`/provider/${myProvider.id}`} className="flex items-center gap-2 text-brand-600 hover:text-brand-700 font-medium">
          <Eye size={16} /> View My Page
        </Link>
      </div>

      {/* Availability Toggle */}
      <div className="card p-6 mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Your Availability Status</h2>
            <p className="text-sm text-gray-500">Toggle your availability for customers to see in real-time</p>
          </div>
          <div className="flex items-center gap-4">
            {myProvider.available ? (
              <span className="badge-available text-base px-4 py-2">
                <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                Available Now
              </span>
            ) : (
              <span className="badge-unavailable text-base px-4 py-2">
                <span className="w-3 h-3 rounded-full bg-red-400" />
                Unavailable
              </span>
            )}
            <button onClick={() => toggleAvailability(myProvider.id)}
              className={`toggle-track w-16 h-8 ${myProvider.available ? 'bg-accent-500' : 'bg-gray-300'}`}>
              <div className={`toggle-thumb w-7 h-7 ${myProvider.available ? 'translate-x-8' : ''}`} />
            </button>
          </div>
        </div>

        {/* Per-Provider Toggles */}
        <div className="mt-6 pt-6 border-t border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">All Provider Availability</h3>
          <div className="space-y-3">
            {providers.map(p => (
              <div key={p.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm ${
                    p.available ? 'bg-brand-600' : 'bg-gray-400'
                  }`}>
                    {p.name.charAt(0)}
                  </div>
                  <div>
                    <span className="font-medium text-sm text-gray-900">{p.name}</span>
                    <p className="text-xs text-gray-400">{p.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-medium ${p.available ? 'text-green-600' : 'text-red-500'}`}>
                    {p.available ? 'ON' : 'OFF'}
                  </span>
                  <button onClick={() => toggleAvailability(p.id)}
                    className={`toggle-track w-12 h-6 ${p.available ? 'bg-accent-500' : 'bg-gray-300'}`}>
                    <div className={`toggle-thumb w-5 h-5 ${p.available ? 'translate-x-5' : ''}`} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === t.id ? 'bg-brand-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'media' && (
        <div className="card p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Upload Media Content</h2>
          <div className="flex gap-2 mb-6">
            {[
              { type: 'video', icon: Play, label: 'Video' },
              { type: 'podcast', icon: Mic, label: 'Podcast' },
              { type: 'audio', icon: Mic, label: 'Audio' },
              { type: 'image', icon: Image, label: 'Image' },
            ].map(({ type, icon: Icon, label }) => (
              <button key={type} onClick={() => setUploadType(type)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  uploadType === type ? 'bg-brand-100 text-brand-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}>
                <Icon size={16} /> {label}
              </button>
            ))}
          </div>
          <div className="border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center hover:border-brand-300 transition-colors cursor-pointer">
            <Upload size={40} className="mx-auto text-gray-300 mb-3" />
            <h3 className="font-semibold text-gray-700 mb-1">Drop your {uploadType} file here</h3>
            <p className="text-sm text-gray-400">or click to browse</p>
            <input type="file" className="hidden" />
          </div>
          <div className="mt-4">
            <input type="text" placeholder="Title for your media..." className="input-field mb-3" />
            <textarea placeholder="Description..." className="input-field h-24 resize-none" />
            <button className="btn-primary mt-4">
              <Upload size={16} className="inline mr-2" /> Upload {uploadType}
            </button>
          </div>
        </div>
      )}

      {activeTab === 'blog' && (
        <div className="card p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <PenLine size={18} /> Write a Blog Post
          </h2>
          <input type="text" value={blogTitle} onChange={(e) => setBlogTitle(e.target.value)}
            placeholder="Blog post title..." className="input-field mb-4 text-lg font-semibold" />
          <textarea value={blogContent} onChange={(e) => setBlogContent(e.target.value)}
            placeholder="Write your blog post content here. Share tips, industry knowledge, or updates about your services..."
            className="input-field h-64 resize-none mb-4" />
          <div className="flex items-center gap-3">
            <button className="btn-primary">
              <FileText size={16} className="inline mr-2" /> Publish Post
            </button>
            <button className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50">
              Save Draft
            </button>
          </div>
        </div>
      )}

      {activeTab === 'services' && (
        <div className="card p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">My Services</h2>
          <div className="space-y-3 mb-6">
            {myProvider.services.map((s, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <span className="font-medium text-gray-800">{s}</span>
                <span className="text-sm text-gray-500">${myProvider.hourlyRate}/hr</span>
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <input type="text" placeholder="Add a new service..." className="input-field flex-1" />
            <button className="btn-primary">Add Service</button>
          </div>
        </div>
      )}

      {activeTab === 'status' && (
        <div className="card p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Dashboard Overview</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Total Reviews', value: myProvider.reviewCount, color: 'bg-blue-50 text-blue-700' },
              { label: 'Rating', value: myProvider.rating, color: 'bg-yellow-50 text-yellow-700' },
              { label: 'Hourly Rate', value: `$${myProvider.hourlyRate}`, color: 'bg-green-50 text-green-700' },
              { label: 'Response Time', value: myProvider.responseTime, color: 'bg-purple-50 text-purple-700' },
            ].map(({ label, value, color }) => (
              <div key={label} className={`p-4 rounded-xl ${color}`}>
                <p className="text-xs font-medium opacity-70">{label}</p>
                <p className="text-2xl font-bold mt-1">{value}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
