import { useState, useCallback, useMemo } from 'react'
import { Box, makeStyles } from '@material-ui/core'
import { OutlinedCard } from 'components/Card'
import AppBody from 'pages/AppBody'
import Divider from 'components/Divider/Divider'
import { HideOnMobile, ShowOnMobile, TYPE } from 'theme'
import Slider from 'components/Slider'
import SmallButton from 'components/Button/SmallButton'
import Currency from 'models/currency'
import ChainSelect from 'components/ChainSelect/ChainSelect'
import { ChainList } from 'data/dummyData'
import Chain from 'models/chain'
import Image from 'components/Image/Image'
import { LiquidityError } from './LiquidityForm'
import ErrorAndActionButton from 'components/Button/ErrorAndActionButton'
import useModal from 'hooks/useModal'
import TxnSubmittedMessageBox from 'pages/Swap/TxnSubmittedMessageBox'
import useBreakpoint from 'hooks/useBreakpoint'

const useStyles = makeStyles((theme) => ({
  card: {
    [theme.breakpoints.down('sm')]: {
      padding: 0,
    },
  },
}))

export default function WithdrawLiquidity({
  onReturnClick,
  currency,
}: {
  onReturnClick: () => void
  currency: Currency | null
}) {
  const { matches } = useBreakpoint()
  const [amount, setAmount] = useState(0)
  const [pending, setPending] = useState(false)
  const [chain, setChain] = useState<Chain | null>(null)
  const { showModal } = useModal()
  const classes = useStyles()

  const error = useMemo(() => {
    if (!amount) {
      return LiquidityError.AMOUNT
    }
    if (!chain) {
      return LiquidityError.CHAIN
    }
  }, [amount, chain])

  const handleAmountSlide = useCallback((e, val) => {
    setAmount(val)
  }, [])
  const handleAmountClick = useCallback((val) => () => setAmount(val), [])
  const handleChainSelect = useCallback((e) => {
    setChain(ChainList.find((chain) => chain.symbol === e.target.value) ?? null)
  }, [])
  const handleWithdraw = useCallback(() => {
    setPending(true)
    setTimeout(() => {
      setPending(false)
      showModal(<TxnSubmittedMessageBox action={() => {}} />)
    }, 1000)
  }, [showModal])

  return (
    <AppBody title="Withdraw" onReturnClick={onReturnClick}>
      <Box padding={`0 ${matches ? 20 : 40}px 40px`} display="grid" gridGap="24px">
        <OutlinedCard classname={classes.card} color={matches ? 'transparent' : undefined}>
          <Box padding={matches ? 0 : '16px 20px'} display="grid" gridGap={20}>
            <Box display="grid" gridGap={matches ? 18 : 5}>
              <TYPE.mediumGray fontWeight={500}>Amount</TYPE.mediumGray>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <TYPE.bold fontSize={36}>{(amount * 100).toFixed(0)}%</TYPE.bold>
                <HideOnMobile breakpoint="sm">
                  <PersentageButtons onClick={handleAmountClick} matches={matches} />
                </HideOnMobile>
                <ShowOnMobile breakpoint="sm">
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <TYPE.bold>-</TYPE.bold>
                    <Box display="flex" alignItems="center" gridGap={8}>
                      {currency?.logo && (
                        <Image src={currency?.logo ?? ''} alt="logo" style={{ height: 24, width: 24 }} />
                      )}
                      <TYPE.bold>{currency?.symbol}</TYPE.bold>
                    </Box>
                  </Box>
                </ShowOnMobile>
              </Box>

              <Slider value={amount} onChange={handleAmountSlide} step={0.05} />
              <ShowOnMobile breakpoint="sm">
                <PersentageButtons onClick={handleAmountClick} matches={matches} />
              </ShowOnMobile>
            </Box>
            <HideOnMobile breakpoint="sm">
              <Divider extension={20} />
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <TYPE.bold>-</TYPE.bold>
                <Box display="flex" alignItems="center" gridGap={8}>
                  {currency?.logo && <Image src={currency?.logo ?? ''} alt="logo" style={{ height: 24, width: 24 }} />}
                  <TYPE.bold>{currency?.symbol}</TYPE.bold>
                </Box>
              </Box>
            </HideOnMobile>
          </Box>
        </OutlinedCard>
        <ChainSelect
          label="Chain"
          chainList={ChainList}
          selectedChain={chain}
          onChange={handleChainSelect}
          width="100%"
          active={error === LiquidityError.CHAIN}
        />
        <ErrorAndActionButton onAction={handleWithdraw} actionText="Withdraw" pending={pending} error={error} />
        {amount !== 0 && chain && (
          <>
            <Divider extension={40} />
            <OutlinedCard>
              <Box padding="16px 20px" display="grid" gridGap={18}>
                <TYPE.medium fontWeight={600}>Your Position</TYPE.medium>
                <Box display="flex" justifyContent="space-between">
                  <TYPE.gray fontWeight={600}>
                    <Box display="flex" alignItems="center" gridGap="8px">
                      <Image src={currency?.logo ?? ''} alt="logo" /> {currency?.symbol}
                    </Box>
                  </TYPE.gray>
                  <TYPE.body fontWeight={600}>176.5</TYPE.body>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <TYPE.smallGray>Your pool share</TYPE.smallGray>
                  <TYPE.small>0.003%</TYPE.small>
                </Box>
              </Box>
            </OutlinedCard>
          </>
        )}
      </Box>
    </AppBody>
  )
}

function PersentageButtons({ onClick, matches }: { onClick: (number: Number) => () => void; matches: boolean }) {
  return (
    <Box display="flex" gridGap={8} justifyContent={matches ? 'space-between' : undefined}>
      <SmallButton onClick={onClick(0.25)}>25%</SmallButton>
      <SmallButton onClick={onClick(0.5)}>50%</SmallButton>
      <SmallButton onClick={onClick(0.75)}>75%</SmallButton>
      <SmallButton onClick={onClick(1)}>Max</SmallButton>
    </Box>
  )
}
