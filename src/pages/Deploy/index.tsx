import React, { useState, ChangeEvent, useCallback } from 'react'
import AppBody from '../AppBody'
import DeployOptions from './DeployOptions'
import AddToken from './AddToken'
import Mapping from './Mapping'
import Bridge from './Bridge'
import useModal from '../../hooks/useModal'
import Chain from '../../models/chain'
import { ChainList } from 'data/dummyData'

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

enum DEPLOY_STATE {
  OPTIONS = 'options',
  ADD = 'add',
  MAPPING = 'mapping',
  BRIDGE = 'bridge',
}

export type DeployStatusType = {
  confirmed: boolean
  deploying: boolean
  deployed: boolean
}

type DeployStatus = {
  deploying?: boolean
  deployed?: boolean
}

export type ChainState = Chain & DeployStatus

export default function Deploy() {
  const [state, setState] = useState(DEPLOY_STATE.OPTIONS)
  const [address, setAddress] = useState('')
  const [chainId, setChainId] = useState('')
  const [deployStatus, setDeployStatus] = useState<DeployStatusType>({
    confirmed: false,
    deploying: false,
    deployed: false,
  })
  const [selectedChains, setSelectedChains] = useState<ChainState[]>([])

  const { showModal, hideModal } = useModal()

  const toMapping = useCallback(() => {
    setState(DEPLOY_STATE.MAPPING)
    hideModal()
  }, [setState, hideModal])

  const onChainSelect = useCallback((e: ChangeEvent<{ value: string[] }>) => {
    const symbols: string[] = e.target.value
    const selectedItems = []

    for (let i = 0; i < symbols.length; i += 1) {
      const chain = ChainList.find((chain) => chain.symbol === symbols[i])
      if (chain) {
        selectedItems.push(chain)
      }
    }
    setSelectedChains(selectedItems)
  }, [])

  const toBridge = useCallback(() => {
    hideModal()
    setState(DEPLOY_STATE.BRIDGE)
  }, [hideModal])

  return (
    <AppBody>
      {state === DEPLOY_STATE.OPTIONS && (
        <DeployOptions onClickExistingToken={() => setState(DEPLOY_STATE.ADD)} onClickNewToken={() => {}} />
      )}
      {state === DEPLOY_STATE.ADD && <AddToken />}
      {state === DEPLOY_STATE.MAPPING && (
        <Mapping
          data={dummyData.mainchainInfo}
          chainList={ChainList}
          onChainSelect={onChainSelect}
          selectedChains={selectedChains}
          onNext={toBridge}
        />
      )}
      {state === DEPLOY_STATE.BRIDGE && <Bridge />}
    </AppBody>
  )
}
