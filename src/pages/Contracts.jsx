import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { Shield, ExternalLink, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { mockContracts } from '../data/mockData'

const statusConfig = {
  completed: { icon: CheckCircle, color: 'text-green-600 bg-green-50', label: 'Completed' },
  'in-progress': { icon: Clock, color: 'text-blue-600 bg-blue-50', label: 'In Progress' },
  pending: { icon: AlertCircle, color: 'text-yellow-600 bg-yellow-50', label: 'Pending' },
}

export default function Contracts() {
  const [selectedContract, setSelectedContract] = useState(null)

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Service Contracts</h1>
        <p className="text-gray-500 flex items-center gap-2 mt-1">
          <Shield size={16} className="text-brand-600" />
          All contracts are tracked and verified on the blockchain via QR codes
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {mockContracts.map(contract => {
            const status = statusConfig[contract.status]
            const StatusIcon = status.icon
            return (
              <div key={contract.id}
                onClick={() => setSelectedContract(contract)}
                className={`card p-5 cursor-pointer transition-all ${
                  selectedContract?.id === contract.id ? 'ring-2 ring-brand-500' : ''
                }`}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{contract.service}</h3>
                    <p className="text-sm text-gray-500">{contract.provider}</p>
                  </div>
                  <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>
                    <StatusIcon size={14} /> {status.label}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Contract: {contract.id}</span>
                  <span className="font-semibold text-gray-900">${contract.amount}</span>
                </div>
                <div className="flex items-center justify-between mt-2 text-sm">
                  <span className="text-gray-400">{contract.date}</span>
                  <span className="font-mono text-xs text-brand-600">{contract.blockchainHash}</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* QR Code Panel */}
        <div className="card p-6 h-fit sticky top-24">
          {selectedContract ? (
            <div className="text-center">
              <h3 className="font-bold text-gray-900 mb-1">Blockchain Verification</h3>
              <p className="text-xs text-gray-500 mb-4">Scan to verify contract on-chain</p>
              <div className="inline-block p-4 bg-white border-2 border-gray-100 rounded-2xl mb-4">
                <QRCodeSVG
                  value={JSON.stringify({
                    contractId: selectedContract.id,
                    provider: selectedContract.provider,
                    service: selectedContract.service,
                    amount: selectedContract.amount,
                    hash: selectedContract.blockchainHash,
                    chain: 'toogle-chain',
                    timestamp: selectedContract.date
                  })}
                  size={180} level="H" fgColor="#1647b6" />
              </div>
              <div className="text-left space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Contract</span><span className="font-mono font-medium">{selectedContract.id}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Amount</span><span className="font-medium">${selectedContract.amount}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Hash</span><span className="font-mono text-xs text-brand-600">{selectedContract.blockchainHash}</span></div>
              </div>
              <button className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-brand-600 bg-brand-50 rounded-xl hover:bg-brand-100 transition-colors">
                <ExternalLink size={14} /> View on Blockchain Explorer
              </button>
            </div>
          ) : (
            <div className="text-center py-8">
              <Shield size={40} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500 text-sm">Select a contract to view its QR code and blockchain verification</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
