import { Accordion, AccordionDetails, AccordionSummary, makeStyles, Box } from '@material-ui/core'
import { ChevronDown } from 'react-feather'
import { TYPE } from '../../theme'
import SecondaryButton from '../Button/SecondaryButton'
import Divider from '../Divider/Divider'
import { ExternalLink } from '../Link'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    borderRadius: '10px',
    backgroundColor: 'transparent',
    border: '1px solid transparent',
    '&.Mui-expanded': {
      border: '1px solid ' + theme.bgColor.bg4,
      '& .chevron': {
        transform: 'rotate(180deg)',
      },
    },
  },
  summary: {
    backgroundColor: theme.bgColor.bg3,
    borderRadius: '10px',
    padding: 0,
    overflow: 'hidden',
    '& .MuiAccordionSummary-content': {
      margin: 0,
    },
    '&.Mui-expanded': {
      minHeight: '48px',
      margin: 0,
    },
    '& .asset': {
      backgroundColor: theme.textColor.text5,
      height: '100%',
      width: '132px',
      padding: '14px 16px',
    },
  },
  details: {
    padding: 0,
  },
}))

export default function LiquidityAccordion({
  asset,
  chain,
  data,
  onDeposit,
  onWithdraw,
  onClaim,
}: {
  asset: string
  chain: number
  data: {
    'Pooled BSC': string
    'Your pool share': string
    'Your unclaimed reward': string
    APY: string
  }
  onDeposit: () => void
  onWithdraw: () => void
  onClaim: () => void
}) {
  const classes = useStyles()
  return (
    <Accordion className={classes.root}>
      <AccordionSummary className={classes.summary}>
        <Box display="flex" justifyContent="space-between" width="100%">
          <Box display="flex" alignItems="center" gridGap="21px">
            <TYPE.bold className="asset">{asset}</TYPE.bold>
            <TYPE.bold>{chain}</TYPE.bold>
          </Box>
          <Box display="flex" alignItems="center" padding="0 15px" gridGap="8px">
            <TYPE.body>Manage</TYPE.body>
            <ChevronDown className="chevron" />
          </Box>
        </Box>
      </AccordionSummary>
      <AccordionDetails className={classes.details}>
        <Box display="grid" gridGap="16px" width="100%" padding="16px 0">
          <Box display="grid" gridGap="8px" padding="5px 16px">
            {Object.keys(data).map((key) => (
              <Box display="flex" justifyContent="space-between" key={key}>
                <TYPE.smallGray>{key}</TYPE.smallGray>
                <TYPE.small>{data[key as keyof typeof data]}</TYPE.small>
              </Box>
            ))}
          </Box>
          <Divider />
          <Box display="flex" justifyContent="center">
            <ExternalLink href="">View accrued fees and analytics</ExternalLink>
          </Box>
          <Divider />
          <Box padding="5px 16px" display="grid" gridGap="16px">
            <Box display="flex" width="100%" gridGap="10px">
              <SecondaryButton onClick={onDeposit}>Deposit</SecondaryButton>
              <SecondaryButton onClick={onWithdraw}>Withdraw</SecondaryButton>
            </Box>
            <SecondaryButton onClick={onClaim}>Claim Reward</SecondaryButton>
          </Box>
        </Box>
      </AccordionDetails>
    </Accordion>
  )
}
