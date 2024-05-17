import { useState } from 'react'
import Wallet, { AddressPurpose, BitcoinNetworkType } from 'sats-connect'

export default function App() {
  const [runeAddress, setRuneAddress] = useState<string>('')
  const [paymentAddress, setPaymentAddress] = useState<string>('')
  const [fundTxId, setFundTxId] = useState<string>('')

  console.log(runeAddress, paymentAddress)

  const handleConnect = async () => {
    const provider = await Wallet.request('getAccounts', {
      purposes: [AddressPurpose.Ordinals, AddressPurpose.Payment],
    })

    if (provider.status === 'error') {
      console.error(provider.error)
    }

    if (provider.status === 'success') {
      setRuneAddress(provider.result[0].address)
      setPaymentAddress(provider.result[1].address)
    }
  }

  console.log(fundTxId)

  const handleMint = async () => {
    const response = await Wallet.request('runes_mint', {
      destinationAddress: 'an ordinal address',
      feeRate: 47,
      repeats: 1,
      runeName: 'TEST•RSK•TEST•RSK•TEST',
      refundAddress: 'a payment address',
      network: BitcoinNetworkType.Testnet
    })

    if (response.status === 'success') {
      console.log(response)
      alert('Succesfully minted TESTRSKTESTRSKTESS. See console for details.');
    } else {
      console.error(response.error);
      alert('Error minting TESTRSKTESTRSKTESS. See console for details.');
    }
  }

  const handleEtch = async () => {
    const response = await Wallet.request('runes_etch', {
      runeName: 'ROOTSTOCK•TEST',
      premine: '10',
      divisibility: 1,
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
      alert('Error etching UNCOMMONGOODS. See console for details.')
    }
  }

  return (
    <main className="min-h-svh bg-black flex justify-center items-center">
      <div className="flex gap-5">
        <button
          onClick={handleConnect}
          className="bg-orange-600 text-black p-4"
        >
          Connect
        </button>

        <button onClick={handleEtch} className="bg-orange-600 text-black p-4">
          Etch Rune
        </button>

        <button onClick={handleMint} className="bg-orange-600 text-black p-4">
          Mint Rune
        </button>
      </div>
    </main>
  )
}
