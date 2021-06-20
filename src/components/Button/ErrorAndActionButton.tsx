import Button from './Button'
import OutlineButton from './OutlineButton'
import { ReactComponent as SuccessIcon } from '../../assets/images/deploy_success.svg'
import { Text } from 'rebass'

export default function ErrorAndActionButton({
  error,
  pending,
  success,
  instruction,
  onAction,
  actionText,
  pendingText,
  instructionText,
  height,
  width,
}: {
  error?: string | undefined
  pending?: boolean
  success?: boolean
  instruction?: boolean
  onAction: () => void
  actionText: string
  pendingText?: string
  instructionText?: string
  height?: string
  width?: string
}) {
  return (
    <>
      {error || pending ? (
        <OutlineButton primary disabled loading={pending} height={height} width={width}>
          {pending ? pendingText || 'Waiting Confirmation' : error}
        </OutlineButton>
      ) : success ? (
        <OutlineButton disabled height={height} width={width}>
          <Text mr="55px">Success</Text>
          <SuccessIcon />
        </OutlineButton>
      ) : instruction ? (
        <OutlineButton disabled height={height} width={width} primary>
          {instructionText}
        </OutlineButton>
      ) : (
        <Button height={height} width={width} onClick={onAction}>
          {actionText}
        </Button>
      )}
    </>
  )
}
