import React, { useState, ChangeEvent } from 'react'
import Modal from '../../Modal/Modal'
import CurrencySearch from './CurrencySearch'
import Currency from '../../../models/currency'
import Manage from './Manage'
import Import from './Import'

const VIEWS = {
  SEARCH: 'search',
  MANAGE: 'manage',
  IMPORT: 'import',
}

interface Props {
  currencies: Currency[]
  onCurrencySelect: (currency: Currency) => void
}

export default function CurrencySearchModal(props: Props) {
  const { currencies, onCurrencySelect } = props
  const [view, setView] = useState(VIEWS.SEARCH)
  const [currency, setCurrency] = useState('')

  function onManage() {
    setView(VIEWS.MANAGE)
  }

  function onChangeCurrency(e: ChangeEvent<HTMLInputElement>) {
    setCurrency(e.target.value)
  }

  function showImportView() {
    setView(VIEWS.IMPORT)
  }

  function setImportToken() {
    alert('set Import Token')
  }

  return (
    <>
      <Modal label={'Select a token'} showIcon>
        {view === VIEWS.SEARCH ? (
          <CurrencySearch
            currencies={currencies}
            onManage={onManage}
            onChange={onChangeCurrency}
            value={currency}
            showImportView={showImportView}
            setImportToken={setImportToken}
            onCurrencySelect={onCurrencySelect}
          />
        ) : view === VIEWS.MANAGE ? (
          <Manage />
        ) : (
          <Import />
        )}
      </Modal>
    </>
  )
}