import React, { ChangeEvent } from 'react'
import { InputBase, Theme } from '@material-ui/core'
import { createStyles, makeStyles } from '@material-ui/styles'
import InputLabel from '../InputLabel/InputLabel'

interface Props {
  placeholder?: string
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  label?: string
  type?: string
  style?: React.CSSProperties
  disabled?: boolean
  focused?: boolean
  outlined?: boolean
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      fontSize: 16,
      color: '#FFFFFF',
      fontFamily: 'Roboto',
      fontWeight: 400,
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
      height: 48,
      paddingLeft: 20,
      borderRadius: 14,
      border: (props: { outlined?: boolean }) => `1px solid ${props.outlined ? 'rgba(255,255,255,.4)' : 'transparent'}`,
    },
    focused: {
      border: '1px solid',
      borderColor: theme.palette.primary.main,
    },
    input: {
      '&::-webkit-outer-spin-button': {
        '-webkit-appearance': 'none',
      },
      '&::-webkit-inner-spin-button': {
        '-webkit-appearance': 'none',
      },
    },
    disabled: {
      color: 'rgba(255,255,255,0.24)',
      cursor: 'not-allowed',
      backgroundColor: theme.gray.dark,
    },
  })
)

export default function Input(props: Props) {
  const classes = useStyles(props)
  const { focused, ...restProps } = props

  return (
    <>
      {props.label && <InputLabel>{props.label}</InputLabel>}
      <InputBase
        fullWidth={true}
        {...restProps}
        classes={{ ...classes }}
        inputRef={(input) => input && props.focused && input.focus()}
      />
    </>
  )
}
