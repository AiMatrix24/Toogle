import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import { Shield, CheckCircle, Clock, Hash, ArrowRight, ExternalLink, Search, Copy, Layers, Box, Link2 } from 'lucide-react'
import { payments as paymentsApi } from '../lib/api'

function generateBlockchainData(contract) {
  const hash = contract.blockchainHash
  const blockNum = 1000000 + parseInt(contract.id.replace(/\D/g, '')) * 137
  const gasUsed = 21000 + Math.floor(Math.random() * 50000)
  const confirmations = Math.floor(Math.random() * 500) + 12

  return {
    transactionHash: `0x${hash.replace('...', '')}${'a'.repeat(20)}f2c8d9e1b7`,
    blockNumber: blockNum,
    from: `0x742d35Cc6634C0532925a3b844Bc${contract.customer.replace(/\s/g, '').substring(0, 4)}`,
    to: `0x8Ba1f109551bD432803012645Ac1${contract.provider.replace(/\s/g, '').substring(0, 6)}`,
    value: `${contract.amount} USDT`,
    gasUsed,
    gasPrice: '0.000000025 ETH',
    confirmations,
    status: contract.status === 'completed' ? 'Success' : contract.status === 'in-progress' ? 'Pending' : 'Queued',
    timestamp: contract.date,
    contractAddress: `0xTGL${contract.id.replace(/-/g, '')}Chain`,
    events: [
      { name: 'ContractCreated', data: `Service: ${contract.service}`, time: contract.date },
      { name: 'PaymentEscrowed', data: `Amount: $${contract.amount}`, time: contract.date },
      ...(contract.status === 'completed' ? [
        { name: 'ServiceVerified', data: 'Provider confirmed completion', time: contract.date },
        { name: 'PaymentReleased', data: `$${contract.amount} released to provider`, time: contract.date },
      ] : []),
    ]
  }
}

export default function BlockchainExplorer() {
  const [searchParams] = useSearchParams()
  const contractId = searchParams.get('contract')
  const [searchInput, setSearchInput] = useState(contractId || '')
  const [activeContract, setActiveContract] = useState(null)
  const [allContracts, setAllContracts] = useState([])
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    paymentsApi.list().then(data => {
      const mapped = data.map(p => ({
        id: p.transaction_id || p.id,
        provider: p.provider_name || 'Provider',
        providerId: p.provider_id,
        customer: p.customer_name || 'Customer',
        service: 'Service',
        amount: p.amount,
        status: p.status === 'completed' ? 'completed' : p.status === 'pending' ? 'pending' : 'in-progress',
        date: p.created_at?.split('T')[0] || '',
        blockchainHash: '0x' + (p.transaction_id || '').replace(/\W/g, '').slice(0, 16),
      }))
      setAllContracts(mapped)
      if (contractId) {
        setActiveContract(mapped.find(c => c.id === contractId) || null)
      }
    }).catch(() => {})
  }, [contractId])

  const handleSearch = (e) => {
    e.preventDefault()
    const found = allContracts.find(c =>
      c.id === searchInput || c.blockchainHash.includes(searchInput)
    )
    setActiveContract(found || null)
  }

  const copyHash = (text) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const blockchain = activeContract ? generateBlockchainData(activeContract) : null

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="w-12 h-12 bg-brand-600 rounded-xl flex items-center justify-center">
            <Layers size={24} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Toggle Blockchain Explorer</h1>
        </div>
        <p className="text-gray-500">Verify service contracts on the Toggle blockchain</p>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="card p-4 mb-8">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by Contract ID (SC-2026-001) or blockchain hash..."
              className="input-field pl-12" />
          </div>
          <button type="submit" className="btn-primary">Search</button>
        </div>
        <div className="flex gap-2 mt-3">
          <span className="text-xs text-gray-400">Quick links:</span>
          {allContracts.map(c => (
            <button key={c.id} type="button" onClick={() => { setSearchInput(c.id); setActiveContract(c) }}
              className="text-xs text-brand-600 hover:text-brand-700 font-medium">{c.id}</button>
          ))}
        </div>
      </form>

      {!activeContract && (
        <div className="text-center py-16">
          <Shield size={64} className="mx-auto text-gray-200 mb-4" />
          <h3 className="text-lg font-semibold text-gray-400">Enter a contract ID or hash to verify</h3>
          <p className="text-gray-400 text-sm mt-1">All Toggle service contracts are recorded on-chain for transparency</p>
        </div>
      )}

      {activeContract && blockchain && (
        <div className="space-y-6">
          {/* Transaction Overview */}
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                blockchain.status === 'Success' ? 'bg-green-100' : blockchain.status === 'Pending' ? 'bg-blue-100' : 'bg-yellow-100'
              }`}>
                {blockchain.status === 'Success' ? <CheckCircle size={20} className="text-green-600" /> :
                 <Clock size={20} className={blockchain.status === 'Pending' ? 'text-blue-600' : 'text-yellow-600'} />}
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Transaction Details</h2>
                <span className={`text-sm font-medium ${
                  blockchain.status === 'Success' ? 'text-green-600' : blockchain.status === 'Pending' ? 'text-blue-600' : 'text-yellow-600'
                }`}>{blockchain.status}</span>
              </div>
              <div className="ml-auto">
                <QRCodeSVG value={JSON.stringify({ contractId: activeContract.id, hash: activeContract.blockchainHash, chain: 'toggle-chain' })}
                  size={80} level="H" fgColor="#1647b6" />
              </div>
            </div>

            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-gray-50 rounded-xl">
                <dt className="text-xs text-gray-400 mb-1">Transaction Hash</dt>
                <dd className="font-mono text-sm text-gray-800 flex items-center gap-2">
                  <span className="truncate">{blockchain.transactionHash}</span>
                  <button onClick={() => copyHash(blockchain.transactionHash)}
                    className="shrink-0 p-1 rounded hover:bg-gray-200">
                    <Copy size={14} className={copied ? 'text-green-500' : 'text-gray-400'} />
                  </button>
                </dd>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <dt className="text-xs text-gray-400 mb-1">Block Number</dt>
                <dd className="font-mono text-sm text-gray-800 flex items-center gap-2">
                  <Box size={14} className="text-brand-500" /> #{blockchain.blockNumber.toLocaleString()}
                </dd>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <dt className="text-xs text-gray-400 mb-1">From (Customer)</dt>
                <dd className="font-mono text-sm text-gray-800 truncate">{blockchain.from}</dd>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <dt className="text-xs text-gray-400 mb-1">To (Provider)</dt>
                <dd className="font-mono text-sm text-gray-800 truncate">{blockchain.to}</dd>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <dt className="text-xs text-gray-400 mb-1">Value</dt>
                <dd className="font-bold text-lg text-gray-900">${activeContract.amount}</dd>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <dt className="text-xs text-gray-400 mb-1">Confirmations</dt>
                <dd className="font-medium text-sm text-green-600">{blockchain.confirmations} confirmations</dd>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <dt className="text-xs text-gray-400 mb-1">Gas Used</dt>
                <dd className="font-mono text-sm text-gray-800">{blockchain.gasUsed.toLocaleString()} ({blockchain.gasPrice})</dd>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <dt className="text-xs text-gray-400 mb-1">Contract Address</dt>
                <dd className="font-mono text-sm text-brand-600">{blockchain.contractAddress}</dd>
              </div>
            </dl>
          </div>

          {/* Contract Info */}
          <div className="card p-6">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Link2 size={18} className="text-brand-600" /> Service Contract
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-brand-50 rounded-xl">
                <p className="text-xs text-brand-600 mb-1">Contract ID</p>
                <p className="font-bold text-brand-800">{activeContract.id}</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <p className="text-xs text-green-600 mb-1">Service</p>
                <p className="font-bold text-green-800">{activeContract.service}</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-xl">
                <p className="text-xs text-purple-600 mb-1">Provider</p>
                <p className="font-bold text-purple-800">{activeContract.provider}</p>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-xl">
                <p className="text-xs text-yellow-600 mb-1">Date</p>
                <p className="font-bold text-yellow-800">{activeContract.date}</p>
              </div>
            </div>
          </div>

          {/* Event Log */}
          <div className="card p-6">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Hash size={18} className="text-brand-600" /> Transaction Events
            </h3>
            <div className="space-y-3">
              {blockchain.events.map((evt, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      i === blockchain.events.length - 1 ? 'bg-green-100' : 'bg-brand-100'
                    }`}>
                      <span className="text-xs font-bold text-brand-700">{i + 1}</span>
                    </div>
                    {i < blockchain.events.length - 1 && <div className="w-0.5 h-6 bg-gray-200" />}
                  </div>
                  <div className="flex-1 pb-3">
                    <p className="font-semibold text-sm text-gray-900">{evt.name}</p>
                    <p className="text-xs text-gray-500">{evt.data}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{evt.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <Link to="/contracts" className="text-brand-600 font-medium hover:text-brand-700 text-sm">
              &larr; Back to Contracts
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
