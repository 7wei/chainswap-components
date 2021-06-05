import React, { useState, ChangeEvent, useCallback, useContext } from 'react'
import { styled } from '@material-ui/styles'
import Button from '../../components/Button/Button'
import AppBody from '../AppBody'
import CurrencyInputPanel from '../../components/CurrencyInputPanel/CurrencyInputPanel'
import ChainSelectPanel from '../../components/ChainSelectPanel/ChainSelectPanel'
import { useWalletModalToggle } from '../../state/application/hooks'
import { Box } from '@material-ui/core'
import Input from '../../components/Input/Input'
import QuotaInfo from './QuotaInfo'
import QuotaBar from './QuotaBar'
import ConfirmDepositModal from './ConfirmDepositModal'
import Stepper from '../../components/Stepper/Stepper'
import TxnSubmittedMessageBox from './TxnSubmittedMessageBox'
import MetaMask from '../../assets/images/meta_mask.svg'
import ConfirmWithdrawModal from './ConfirmWithdrawModal'
import { CurrencyList, ChainList } from '../../data/dummyData'
import Divider from '../../components/Divider/Divider'
import ClaimPopupModal from '../../components/claim/ClaimPopupModal'

import { ModalContext } from '../../context/ModalContext'

const AppHeader = styled('div')({
  fontWeight: 500,
  fontSize: 20,
  fontFamily: 'Futura PT',
  margin: '12px 0 18px 0',
  textAlign: 'center',
})

export default function Swap() {
  const [account, setAccount] = useState(true)
  const [amount, setAmount] = useState('')
  const [address, setAddress] = useState('0x72ef586A2c515B605A873ad9a8FBdFD43Df77123')
  const [from, setFrom] = useState(ChainList[0])
  const [to, setTo] = useState(ChainList[1])
  const [depositEnabled, setDepositEnabled] = useState(false)
  const [withdrawEnabled, setWithdrawEnabled] = useState(false)
  const [quota, setQuota] = useState(800)
  const [currency, setCurrency] = useState(CurrencyList[0])

  const { showModal, hideModal } = useContext(ModalContext)

  // swap state
  const [{ attemptingDeposit, attemptingWithdraw, depositCompleted, withdrawCompleted }, setSwapState] = useState<{
    attemptingDeposit: boolean
    attemptingWithdraw: boolean
    depositCompleted: boolean
    withdrawCompleted: boolean
  }>({
    attemptingDeposit: false,
    attemptingWithdraw: false,
    depositCompleted: false,
    withdrawCompleted: false,
  })

  // toggle wallet when disconnected
  const toggleWalletModal = useWalletModalToggle()

  const onChangeAmount = (e: ChangeEvent<HTMLInputElement>) => {
    let currentAmount = e.currentTarget.value

    setAmount(e.currentTarget.value)
    checkDeposit(currentAmount, address)
  }

  const onChangeAddress = (e: ChangeEvent<HTMLInputElement>) => {
    let currentAddress = e.currentTarget.value

    setAddress(currentAddress)
    checkDeposit(amount, currentAddress)
  }

  const checkDeposit = (amount: string, address: string) => {
    if (amount && address) {
      setDepositEnabled(true)
      return
    }
    setDepositEnabled(false)
  }

  const getPercentage = () => {
    return ((quota - parseFloat(amount)) / quota) * 100
  }

  function onChangeTo(e: any) {
    const chain = ChainList.filter((el) => el.symbol === e.target.value)[0]
    setTo(chain)
  }

  function onChangeFrom(e: any) {
    const chain = ChainList.filter((el) => el.symbol === e.target.value)[0]
    setFrom(chain)
  }

  function onMax() {
    const maxAmount = quota.toString()
    setAmount(maxAmount)
  }

  const onConfirmDeposit = useCallback(() => {
    hideModal()
    setDepositEnabled(false)
    setSwapState({
      attemptingDeposit: true,
      attemptingWithdraw: false,
      depositCompleted: true,
      withdrawCompleted: false,
    })

    setTimeout(function () {
      showModal({
        component: TxnSubmittedMessageBox,
        modalProps: {
          onDismiss: hideModal,
          currency: currency,
          wallet: { logo: MetaMask, name: 'MetaMask' },
        },
      })
      setSwapState({
        attemptingDeposit: false,
        attemptingWithdraw: false,
        depositCompleted: true,
        withdrawCompleted: false,
      })
      setWithdrawEnabled(true)
    }, 1500)
  }, [])

  function showConfirmDepositModal() {
    showModal({
      component: ConfirmDepositModal,
      modalProps: {
        onDismiss: hideModal,
        onConfirm: onConfirmDeposit,
        from: from,
        to: to,
        walletLogo: MetaMask,
        address: address,
        value: amount,
        selectedCurrency: currency,
      },
    })
  }

  const onConfirmWithdraw = useCallback(() => {
    hideModal()
    setWithdrawEnabled(false)
    setSwapState({
      attemptingDeposit: false,
      attemptingWithdraw: true,
      depositCompleted: true,
      withdrawCompleted: false,
    })

    setTimeout(function () {
      setSwapState({
        attemptingDeposit: false,
        attemptingWithdraw: false,
        depositCompleted: true,
        withdrawCompleted: true,
      })
      setDepositEnabled(false)
      setWithdrawEnabled(false)
    }, 1500)

    alert('complete withdraw')
  }, [])

  function showConfirmWithdrawModal() {
    showModal({
      component: ConfirmWithdrawModal,
      modalProps: {
        onDismiss: hideModal,
        onConfirm: onConfirmWithdraw,
        from: from,
        to: to,
        walletLogo: MetaMask,
        address: address,
        value: amount,
        selectedCurrency: currency,
      },
    })
  }

  return (
    <>
      <AppBody>
        <AppHeader>Cross Chain Bridge</AppHeader>

        <Box display="grid" gridGap="20px" padding="0 32px">
          <CurrencyInputPanel
            onChange={onChangeAmount}
            value={amount}
            selectedCurrency={currency}
            options={CurrencyList}
            onMax={onMax}
          />
          <ChainSelectPanel
            from={from}
            to={to}
            chainList={ChainList}
            onChangeTo={onChangeTo}
            onChangeFrom={onChangeFrom}
          />
          {account && (
            <Box>
              <Input
                label={'Destination Chain Wallet Address'}
                value={address}
                placeholder={'Enter address to swap'}
                onChange={onChangeAddress}
              />
            </Box>
          )}
        </Box>

        {account && (
          <>
            <Box display="grid" gridGap="16px" padding="28px 32px 0 32px">
              <Box display="flex" justifyContent="space-between">
                <Button width={'216px'} disabled={!depositEnabled} onClick={showConfirmDepositModal}>
                  {attemptingDeposit ? <>Depositing</> : <>Deposit in {from.symbol} Chain</>}
                </Button>
                <Button width={'216px'} disabled={!withdrawEnabled} onClick={showConfirmWithdrawModal}>
                  {attemptingWithdraw ? <>Withdrawing</> : <>Withdraw from {to.symbol} Chain</>}
                </Button>
              </Box>
              <Box display="flex" justifyContent="center">
                <Stepper />
              </Box>
            </Box>
            <Divider orientation={'horizontal'} margin={'24px 0 22px 0'} />
            <Box display="grid" gridGap="12px" padding="0 32px 28px 32px">
              <QuotaInfo quota={quota} currency={currency.symbol} percentage={getPercentage()} />
              <QuotaBar percentage={getPercentage()} />
            </Box>
          </>
        )}

        {!account && (
          <Box padding="27px 32px 31px">
            <Button onClick={toggleWalletModal}>Connect Wallet</Button>
          </Box>
        )}
      </AppBody>
      <ClaimPopupModal />
    </>
  )
}
