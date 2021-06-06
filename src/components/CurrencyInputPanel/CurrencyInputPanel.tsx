import React, { useState, useCallback, ChangeEvent, useContext } from 'react'
import { styled } from '@material-ui/styles'
import CurrencySearchModal from '../SearchModal/CurrencySearchModal'
import Input from '../Input/Input'
import OutlineButton from '../Button/OutlineButton'
import Currency from '../../models/currency'
import InputLabel from '../InputLabel/InputLabel'
import SelectButton from '../Button/SelectButton'
import { ModalContext } from '../../context/ModalContext'

interface Props {
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  selectedCurrency: Currency | null
  options: Currency[]
  onMax: () => void
  disabled: boolean
  onCurrencySelect: (currency: Currency) => void
}

const LabelRow = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
})

const Hint = styled('div')({
  color: '#FFFFFF',
  opacity: 0.4,
  fontWeight: 400,
  fontSize: 12,
})

const InputRow = styled('div')({
  position: 'relative',
  width: '100%',
  height: '48px',
  display: 'flex',
  justifyContent: 'flex-end',
})

const StyledInput = styled(Input)({
  position: 'absolute',
})

const ButtonWrapper = styled('div')({
  position: 'absolute',
  right: '160px',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
})

export default function CurrencyInputPanel(props: Props) {
  const { selectedCurrency, options, onMax, value, disabled, onCurrencySelect } = props
  const { showModal } = useContext(ModalContext)

  const showCurrencySearch = () => {
    showModal({
      component: CurrencySearchModal,
      modalProps: {
        currencies: options,
        onCurrencySelect: onCurrencySelect,
      },
    })
  }

  return (
    <div>
      <LabelRow>
        <InputLabel>Amount</InputLabel>
        {selectedCurrency && (
          <Hint>
            your balance: ${selectedCurrency.balance} ${selectedCurrency.symbol}
          </Hint>
        )}
      </LabelRow>
      <InputRow>
        <StyledInput
          placeholder={'Enter amount to swap'}
          value={value.toString()}
          onChange={props.onChange}
          type={'number'}
          disabled={disabled}
        />
        {selectedCurrency && (
          <ButtonWrapper>
            <OutlineButton width="64px" height="28px" onClick={onMax}>
              Max
            </OutlineButton>
          </ButtonWrapper>
        )}
        <SelectButton width={'160px'} onClick={showCurrencySearch} disabled={disabled}>
          Select Token
        </SelectButton>
      </InputRow>
    </div>
  )
}
