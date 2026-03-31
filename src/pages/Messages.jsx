import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { Send, Paperclip, Phone, Video, Check, CheckCheck, Image, Smile, Search } from 'lucide-react'
import { providers as providersApi } from '../lib/api'

const defaultMessages = [
  { id: 1, from: 'customer', text: 'Hi, I have a leaky faucet in my kitchen. Can you come today?', time: '10:30 AM' },
  { id: 2, from: 'provider', text: "Hi there! Yes, I'm available this afternoon. Can you send a photo of the faucet?", time: '10:32 AM' },
  { id: 3, from: 'customer', text: "Sure, it's a single-handle Moen faucet, dripping from the base.", time: '10:35 AM' },
  { id: 4, from: 'provider', text: "Got it. That's likely a cartridge issue. I can be there by 2 PM. The repair should take about 30 min and cost around $85-$120. Want me to come by?", time: '10:37 AM' },
]

function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-md">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  )
}

function MessageStatus({ status }) {
  if (status === 'sent') return <Check size={12} className="text-white/50" />
  if (status === 'delivered') return <CheckCheck size={12} className="text-white/50" />
  if (status === 'read') return <CheckCheck size={12} className="text-blue-300" />
  return null
}

const providerReplies = [
  "Thanks for your message! I'm available and can help with that.",
  "I can be there within the hour. Does that work for you?",
  "Great question! Let me check my schedule and get back to you right away.",
  "I'd recommend we start with a quick assessment. I can come by today if needed.",
  "Absolutely! I've handled many similar jobs. The typical cost would be around $75-$150.",
  "I'm wrapping up another job nearby. I could swing by in about 30 minutes!",
]

export default function Messages() {
  const { providerId } = useParams()
  const [allProviders, setAllProviders] = useState([])
  const [messages, setMessages] = useState(
    defaultMessages.map((m, i) => ({ ...m, status: 'read', timestamp: Date.now() - (4 - i) * 120000 }))
  )
  const [newMsg, setNewMsg] = useState('')
  const [activeChat, setActiveChat] = useState(providerId || null)
  const [isTyping, setIsTyping] = useState(false)
  const [searchConversations, setSearchConversations] = useState('')
  const [onlineStatus, setOnlineStatus] = useState({})
  const chatRef = useRef(null)
  const replyIdx = useRef(0)

  // Fetch providers for sidebar
  useEffect(() => {
    providersApi.list().then(data => {
      setAllProviders(data)
      if (!activeChat && data.length > 0) setActiveChat(data[0].id)
      const statuses = {}
      data.forEach(p => {
        statuses[p.id] = p.available ? 'online' : Math.random() > 0.5 ? 'away' : 'offline'
      })
      setOnlineStatus(statuses)
    }).catch(() => {})
  }, [])

  const activeProvider = allProviders.find(p => p.id === activeChat)

  // Scroll to bottom on new messages
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight
    }
  }, [messages, isTyping])

  const sendMessage = () => {
    if (!newMsg.trim()) return

    // Add customer message as sent
    const msgId = Date.now()
    setMessages(prev => [...prev, {
      id: msgId, from: 'customer', text: newMsg, status: 'sent',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: Date.now()
    }])
    setNewMsg('')

    // Mark as delivered after 500ms
    setTimeout(() => {
      setMessages(prev => prev.map(m => m.id === msgId ? { ...m, status: 'delivered' } : m))
    }, 500)

    // Mark as read after 1s
    setTimeout(() => {
      setMessages(prev => prev.map(m => m.id === msgId ? { ...m, status: 'read' } : m))
    }, 1000)

    // Show typing indicator after 1.5s
    setTimeout(() => setIsTyping(true), 1500)

    // Provider reply after 3s
    setTimeout(() => {
      setIsTyping(false)
      const reply = providerReplies[replyIdx.current % providerReplies.length]
      replyIdx.current++
      setMessages(prev => [...prev, {
        id: Date.now(), from: 'provider', text: reply, status: 'read',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        timestamp: Date.now()
      }])
    }, 3500)
  }

  const getStatusColor = (status) => {
    if (status === 'online') return 'bg-green-500'
    if (status === 'away') return 'bg-yellow-500'
    return 'bg-gray-300'
  }

  const getStatusLabel = (status) => {
    if (status === 'online') return 'Online'
    if (status === 'away') return 'Away'
    return 'Offline'
  }

  const filteredProviders = allProviders.filter(p =>
    p.name.toLowerCase().includes(searchConversations.toLowerCase())
  )

  const getLastSeen = (providerId) => {
    const status = onlineStatus[providerId]
    if (status === 'online') return 'Active now'
    if (status === 'away') return 'Away · last seen 5 min ago'
    return 'Offline · last seen 2 hrs ago'
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Messages</h1>
      <div className="card flex h-[650px]">
        {/* Sidebar */}
        <div className="w-80 border-r border-gray-100 overflow-y-auto shrink-0 hidden sm:flex flex-col">
          <div className="p-4 border-b border-gray-100">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" value={searchConversations}
                onChange={(e) => setSearchConversations(e.target.value)}
                placeholder="Search conversations..."
                className="input-field text-sm py-2 pl-10" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredProviders.map(p => (
              <button key={p.id} onClick={() => setActiveChat(p.id)}
                className={`w-full flex items-center gap-3 p-4 text-left hover:bg-gray-50 transition-colors ${
                  activeChat === p.id ? 'bg-brand-50 border-r-2 border-brand-600' : ''
                }`}>
                <div className="relative shrink-0">
                  <div className="w-11 h-11 bg-brand-600 rounded-xl flex items-center justify-center text-white font-bold">
                    {p.name.charAt(0)}
                  </div>
                  <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${
                    getStatusColor(onlineStatus[p.id])
                  }`} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm text-gray-900 truncate">{p.name}</h3>
                    <span className="text-xs text-gray-400">10:37 AM</span>
                  </div>
                  <p className="text-xs text-gray-400 truncate">{p.category} &middot; {getStatusLabel(onlineStatus[p.id])}</p>
                </div>
                {p.id === 1 && (
                  <span className="w-5 h-5 bg-brand-600 text-white text-xs rounded-full flex items-center justify-center shrink-0">2</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {activeProvider && (
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center text-white font-bold">
                    {activeProvider.name.charAt(0)}
                  </div>
                  <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                    getStatusColor(onlineStatus[activeProvider.id])
                  }`} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{activeProvider.name}</h3>
                  <span className={`text-xs ${
                    onlineStatus[activeProvider.id] === 'online' ? 'text-green-600' : 'text-gray-400'
                  }`}>
                    {getLastSeen(activeProvider.id)}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg hover:bg-gray-100" title="Voice call">
                  <Phone size={18} className="text-gray-500" />
                </button>
                <button className="p-2 rounded-lg hover:bg-gray-100" title="Video call">
                  <Video size={18} className="text-gray-500" />
                </button>
              </div>
            </div>
          )}

          {/* Messages */}
          <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {/* Date Separator */}
            <div className="flex items-center gap-3 py-2">
              <div className="flex-1 border-t border-gray-200" />
              <span className="text-xs text-gray-400 font-medium">Today</span>
              <div className="flex-1 border-t border-gray-200" />
            </div>

            {messages.map(m => (
              <div key={m.id} className={`flex ${m.from === 'customer' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] px-4 py-3 rounded-2xl ${
                  m.from === 'customer'
                    ? 'bg-brand-600 text-white rounded-br-md'
                    : 'bg-gray-100 text-gray-800 rounded-bl-md'
                }`}>
                  <p className="text-sm">{m.text}</p>
                  <div className={`flex items-center gap-1.5 mt-1 ${
                    m.from === 'customer' ? 'justify-end' : ''
                  }`}>
                    <span className={`text-xs ${m.from === 'customer' ? 'text-white/50' : 'text-gray-400'}`}>
                      {m.time}
                    </span>
                    {m.from === 'customer' && <MessageStatus status={m.status} />}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && <TypingIndicator />}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <button className="p-2 rounded-lg hover:bg-gray-100" title="Attach file">
                <Paperclip size={20} className="text-gray-400" />
              </button>
              <button className="p-2 rounded-lg hover:bg-gray-100" title="Send image">
                <Image size={20} className="text-gray-400" />
              </button>
              <input type="text" value={newMsg}
                onChange={(e) => setNewMsg(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message..."
                className="input-field flex-1 py-2.5" />
              <button className="p-2 rounded-lg hover:bg-gray-100" title="Emoji">
                <Smile size={20} className="text-gray-400" />
              </button>
              <button onClick={sendMessage}
                disabled={!newMsg.trim()}
                className={`p-3 rounded-xl transition-colors ${
                  newMsg.trim() ? 'bg-brand-600 text-white hover:bg-brand-700' : 'bg-gray-200 text-gray-400'
                }`}>
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
