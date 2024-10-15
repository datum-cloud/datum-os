'use client'

import { MoreHorizontal, Trash2 } from 'lucide-react'
import { type UseQueryExecute } from 'urql'

import { useDeletePersonalAccessTokenMutation } from '@repo/codegen/src/schema'
import { TOAST_DURATION } from '@repo/constants'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@repo/ui/dropdown-menu'
import { useToast } from '@repo/ui/use-toast'

import { pageStyles } from '../page.styles'

type TokenActionProps = {
  tokenId: string
  refetchTokens: UseQueryExecute
}

const ICON_SIZE = 12

export const TokenAction = ({ tokenId, refetchTokens }: TokenActionProps) => {
  const { actionIcon } = pageStyles()
  const { toast } = useToast()
  const [_, deleteToken] = useDeletePersonalAccessTokenMutation()

  const handleDeleteToken = async () => {
    const response = await deleteToken({ deletePersonalAccessTokenId: tokenId })

    if (response.error) {
      toast({
        title: 'There was a problem deleting this token, please try again',
        variant: 'destructive',
        duration: TOAST_DURATION,
      })
    }

    if (response.data) {
      toast({
        title: 'Token deleted successfully',
        variant: 'success',
        duration: TOAST_DURATION,
      })
      refetchTokens({
        requestPolicy: 'network-only',
      })
    }
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <MoreHorizontal className={actionIcon()} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-10">
        <DropdownMenuGroup>
          <DropdownMenuItem onSelect={handleDeleteToken}>
            <Trash2 width={ICON_SIZE} /> Delete token
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
