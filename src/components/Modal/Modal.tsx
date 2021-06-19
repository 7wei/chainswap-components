import React from 'react'
import { Dialog, makeStyles, Theme, Box, IconButton } from '@material-ui/core'
import { createStyles } from '@material-ui/styles'
import CloseIcon from '@material-ui/icons/Close'
import useModal from '../../hooks/useModal'
import { TYPE } from '../../theme/index'
import { useOnClickOutside } from 'hooks/useOnClickOutside'
import { useRef } from 'react'
import { ReactComponent as ArrowLeft } from 'assets/images/arrow_left.svg'

interface Props {
  children?: React.ReactNode
  title?: string
  closeIcon?: boolean
  width?: string
  onReturnClick?: () => void
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    paper: {
      width: (props: Props) => props.width || 480,
      background: theme.bgColor.bg1,
      border: '1px solid rgba(255, 255, 255, 0.2)',
      boxSizing: 'border-box',
      borderRadius: 20,
      overflowX: 'hidden',
      position: 'absolute',
      top: `calc(${theme.height.header} + 80px)`,
    },
    backdrop: {
      backgroundColor: 'rgba(0,0,0,.8)',
    },
    closeIconContainer: {
      padding: 0,
      '&:hover $closeIcon': {
        color: theme.textColor.text1,
      },
    },
    closeIcon: {
      color: theme.textColor.text3,
    },
  })
)

export default function Modal(props: Props) {
  const { children, title, closeIcon, onReturnClick } = props
  const classes = useStyles(props)
  const { isOpen, hideModal } = useModal()
  const node = useRef<any>()
  useOnClickOutside(node, hideModal)

  return (
    <>
      <Dialog
        open={isOpen}
        className={classes.root}
        PaperProps={{ className: classes.paper, ref: node }}
        BackdropProps={{ className: classes.backdrop }}
      >
        {(onReturnClick || closeIcon || title) && (
          <Box display="flex" justifyContent="space-between" alignItems="center" padding="20px 30px">
            {onReturnClick ? (
              <IconButton onClick={onReturnClick}>
                <ArrowLeft />
              </IconButton>
            ) : (
              <Box width="24px" />
            )}
            {title && <TYPE.mediumHeader textAlign="center">{title}</TYPE.mediumHeader>}
            {closeIcon ? (
              <IconButton className={classes.closeIconContainer} onClick={hideModal}>
                <CloseIcon className={classes.closeIcon} />
              </IconButton>
            ) : (
              <Box width="24px" />
            )}
          </Box>
        )}
        {children}
      </Dialog>
    </>
  )
}
