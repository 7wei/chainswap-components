import React, { ChangeEvent, useState, useCallback } from 'react'
import { TYPE } from 'theme/index'
import { Box } from '@material-ui/core'
import Input from 'components/Input/Input'
import DeployBody from './DeployBody'
import InfoCard from 'components/deploy/InfoCard'
import InputLabel from 'components/InputLabel/InputLabel'
import useModal from 'hooks/useModal'
import AddTokenMessageBox from './AddTokenMessageBox'
import ErrorAndActionButton from 'components/Button/ErrorAndActionButton'
import { useMemo } from 'react'

const dummyData = {
  tokenInfo: {
    'Token name': 'ETH',
    'Token symby': 'XXXXX',
    'Token decimals': 'XXXXX',
    'Total supply': 'XXXXX',
  },
  mainchainInfo: {
    'Token contract address': 'XXXXXXXXXXXXXXX',
    'Mappable contract address': 'XXXXXXXXXXXXXXX',
    'Mainchain ID': 'XXX',
  },
}

enum AddTokenInstruction {
  ENTER_ADDRESS = 'Enter Token Contract Address',
  ENTER_CHAIN_ID = 'Enter the Chain ID',
}

interface Props {
  onNext: () => void
}

export default function AddToken(props: Props) {
  const { onNext } = props
  const [address, setAddress] = useState('')
  const [chainId, setChainId] = useState('')
  const [{ confirmed, deploying }, setDeployStatus] = useState<{
    confirmed: boolean
    deploying: boolean
    deployed: boolean
  }>({
    confirmed: false,
    deploying: false,
    deployed: false,
  })
  const { showModal } = useModal()

  const onChangeAddress = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value)
  }, [])

  const onChangeChainId = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setChainId(e.target.value)
  }, [])

  const toggleConfirm = useCallback(() => {
    setDeployStatus({
      confirmed: !confirmed,
      deploying: false,
      deployed: false,
    })
  }, [confirmed])

  const onDeploy = useCallback(() => {
    setDeployStatus({
      confirmed: true,
      deploying: true,
      deployed: false,
    })
    setTimeout(() => {
      setDeployStatus({
        deploying: false,
        confirmed: true,
        deployed: true,
      })
      showModal(<AddTokenMessageBox data={dummyData.mainchainInfo} action={onNext} />)
    }, 500)
  }, [setDeployStatus, showModal])

  const getInstruction = useMemo(() => {
    if (!address) {
      return AddTokenInstruction.ENTER_ADDRESS
    }
    if (!chainId) {
      return AddTokenInstruction.ENTER_CHAIN_ID
    }
  }, [address, chainId])

  return (
    <>
      <DeployBody header={'Add an Existing Token'} activeStep={0}>
        <Box mb="24px">
          <Input
            label="Token Contract Address"
            value={address}
            onChange={onChangeAddress}
            placeholder={'Enter the token contract address'}
          />
        </Box>
        <Box mb="24px">
          <Box display="flex" alignItems="center">
            <InputLabel infoIcon>Mainchain ID</InputLabel>
          </Box>

          <Input value={chainId} onChange={onChangeChainId} placeholder={'Enter the chain ID of your existing token'} />
        </Box>
        {chainId && (
          <>
            <InfoCard
              data={dummyData.tokenInfo}
              confirmed={confirmed}
              toggleConfirm={toggleConfirm}
              confirmText={'I confirm the token information before deploying'}
            />
            <Box margin={'20px 0'}>
              <TYPE.mediumGray>Please confirm the token information before deploying</TYPE.mediumGray>
            </Box>
          </>
        )}

        <ErrorAndActionButton
          instruction={!address || !chainId}
          onAction={onNext}
          pending={deploying}
          pendingText={'Loading'}
          actionText={'Next Step'}
          instructionText={getInstruction}
        />
      </DeployBody>
    </>
  )
}
