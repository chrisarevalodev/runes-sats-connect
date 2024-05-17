import { useState } from 'react'
import Wallet, { AddressPurpose, BitcoinNetworkType } from 'sats-connect'

export default function App() {
  const [runeAddress, setRuneAddress] = useState<string>('')
  const [paymentAddress, setPaymentAddress] = useState<string>('')
  const [fundTxId, setFundTxId] = useState<string>('')
  const [totalCost, setTotalCost] = useState<number>(0)
  const [totalSize, setTotalSize] = useState<number>(0)
  const [walletConnected, setWalletConnected] = useState<boolean>(false)

  const handleConnect = async () => {
    const provider = await Wallet.request('getAccounts', {
      purposes: [AddressPurpose.Ordinals, AddressPurpose.Payment],
    })

    if (provider.status === 'error') {
      console.error(provider.error)
    }

    if (provider.status === 'success') {
      console.log(provider.result);
      setRuneAddress(provider.result[0].address)
      setPaymentAddress(provider.result[1].address)
      setWalletConnected(true);
    }
  }

  console.log(fundTxId)

  const handleMint = async () => {
    const response = await Wallet.request('runes_mint', {
      destinationAddress: runeAddress,
      feeRate: 47,
      repeats: 1,
      runeName: 'TEST•RSK•TEST•RSK•TEST',
      refundAddress: paymentAddress,
      network: BitcoinNetworkType.Testnet
    })

    if (response.status === 'success') {
      console.log(response)
      alert('Succesfully minted ROOTSTOCK•TEST. See console for details.');
    } else {
      console.error(response.error);
      alert('Error minting ROOTSTOCK•TEST. See console for details.');
    }
  }

  const handleEstimateMint = async () => {
    const response = await Wallet.request('runes_estimateMint', {
      destinationAddress: runeAddress,
      feeRate: 47,
      repeats: 1,
      runeName: 'TEST•RSK•TEST•RSK•TEST',
      network: BitcoinNetworkType.Testnet
    })

    if (response.status === 'success') {
      setTotalCost(response.result.totalCost);
      setTotalSize(response.result.totalSize);
      alert(`Total Cost: ${totalCost}. Total Size: ${totalSize}.`)
    } else {
      console.error(response.error);
      alert('Error Fetching Estimate. See console for details.');
    }
  }

  const handleEtch = async () => {
    const response = await Wallet.request('runes_etch', {
      runeName: 'ROOTSTOCK•TEST',
      premine: '10',
      divisibility: 0,
      isMintable: true,
      feeRate: 47,
      destinationAddress: runeAddress,
      refundAddress: paymentAddress,
      network: BitcoinNetworkType.Testnet,
    })

    if (response.status === 'success') {
      setFundTxId(response.result.fundTransactionId)
    } else {
      console.error(response.error)
      alert('Error etching ROOTSTOCK•TEST. See console for details.')
    }
  }
  const handleEstimateEtch = async () => {
    const response = await Wallet.request('runes_estimateEtch', {
      runeName: 'ROOTSTOCK•TEST',
      premine: '10',
      divisibility: 1,
      isMintable: true,
      feeRate: 47,
      destinationAddress: runeAddress,
      network: BitcoinNetworkType.Testnet,
    })

    if (response.status === 'success') {
      setTotalCost(response.result.totalCost);
      setTotalSize(response.result.totalSize);
      alert(`Total Cost: ${totalCost}. Total Size: ${totalSize}.`)
    } else {
      console.error(response.error);
      alert('Error Fetching Estimate. See console for details.');
    }
  }

  return (
    <main className="min-h-svh bg-black flex justify-center items-center">
        {!walletConnected && (
          <div className="flex gap-1">
            <button
              onClick={handleConnect}
              className="bg-orange-600 text-black p-4"
              disabled={walletConnected}
            >
              Connect
            </button>
          </div>
        )}

          {walletConnected && (
          <div className="flex-col">
            <div className="flex justify-center items-center m-4">
              <button
                onClick={handleConnect}
                className="bg-pink-400 text-black  p-4"
              >
                Select a different account
              </button>
            </div>

            <div className="text-gray-300 m-6">
              <div className="p-2">
                Payment Address: {paymentAddress}
                <span className=' bg-teal-400 text-black rounded-2xl m-2 p-2'>Payment</span>
              </div>
              <div className="p-2">
                Rune Address: {runeAddress}
                <span className=' bg-teal-400 text-black rounded-2xl m-2 p-2'>Ordinals</span>
              </div>
            </div>

            <div className="flex justify-center items-center gap-6 m-4">
              <button onClick={handleEtch} className="bg-orange-600 text-black p-4">
                Etch Rune
              </button>
              <button onClick={handleEstimateEtch} className="bg-yellow-400  p-4">
                Estimate
              </button>
            </div>
            
            <div className="flex justify-center items-center gap-6 m-4">
              <button onClick={handleMint} className="bg-orange-600 text-black p-4">
                Mint Rune
              </button>
              <button onClick={handleEstimateMint} className="bg-yellow-400 text-black p-4">
                Estimate
              </button>
            </div>
          </div>
        )}
    </main>
  )
}
