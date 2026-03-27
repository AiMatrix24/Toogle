import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Send, Paperclip, Phone, Video } from 'lucide-react'
import { mockProviders, mockMessages } from '../data/mockData'

export default function Messages() {
  const { providerId } = useParams()
  const [messages, setMessages] = useState(mockMessages)
  const [newMsg, setNewMsg] = useState('')
  const [activeChat, setActiveChat] = useState(providerId ? parseInt(providerId) : 1)

  const sendMessage = () => {
    if (!newMsg.trim()) return
    setMessages(prev => [...prev, {
      id: Date.now(), from: 'customer', text: newMsg,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }])
    setNewMsg('')
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now() + 1, from: 'provider', text: 'Thanks for your message! I\'ll get back to you shortly.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }])
    }, 1500)
  }

  const activeProvider = mockProviders.find(p => p.id === activeChat)

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Messages</h1>
      <div className="card flex h-[600px]">
        {/* Sidebar */}
        <div className="w-72 border-r border-gray-100 overflow-y-auto shrink-0 hidden sm:block">
          <div className="p-4">
            <input type="text" placeholder="Search conversations..." className="input-field text-sm py-2" />
          </div>
          {mockProviders.filter(p => p.available).map(p => (
            <button key={p.id} onClick={() => setActiveChat(p.id)}
              className={`w-full flex items-center gap-3 p-4 text-left hover:bg-gray-50 transition-colors ${
                activeChat === p.id ? 'bg-brand-50 border-r-2 border-brand-600' : ''
              }`}>
              <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center text-white font-bold shrink-0">
                {p.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-sm text-gray-900 truncate">{p.name}</h3>
                <p className="text-xs text-gray-400 truncate">{p.category}</p>
              </div>
              <span className="w-2 h-2 rounded-full bg-green-500 ml-auto shrink-0" />
            </button>
          ))}
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {activeProvider && (
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center text-white font-bold">
                  {activeProvider.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{activeProvider.name}</h3>
                  <span className="text-xs text-green-600">Online</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg hover:bg-gray-100"><Phone size={18} className="text-gray-500" /></button>
                <button className="p-2 rounded-lg hover:bg-gray-100"><Video size={18} className="text-gray-500" /></button>
              </div>
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map(m => (
              <div key={m.id} className={`flex ${m.from === 'customer' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] px-4 py-3 rounded-2xl ${
                  m.from === 'customer'
                    ? 'bg-brand-600 text-white rounded-br-md'
                    : 'bg-gray-100 text-gray-800 rounded-bl-md'
                }`}>
                  <p className="text-sm">{m.text}</p>
                  <span className={`text-xs mt-1 block ${m.from === 'customer' ? 'text-white/60' : 'text-gray-400'}`}>
                    {m.time}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <button className="p-2 rounded-lg hover:bg-gray-100">
                <Paperclip size={20} className="text-gray-400" />
              </button>
              <input type="text" value={newMsg}
                onChange={(e) => setNewMsg(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message..."
                className="input-field flex-1 py-2.5" />
              <button onClick={sendMessage}
                className="p-3 bg-brand-600 text-white rounded-xl hover:bg-brand-700 transition-colors">
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
