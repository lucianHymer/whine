import {
  Approval as ApprovalEvent,
  ApprovalForAll as ApprovalForAllEvent,
  ApproveWinery as ApproveWineryEvent,
  FeeWithdraw as FeeWithdrawEvent,
  Payout as PayoutEvent,
  RegisterWinery as RegisterWineryEvent,
  RoleAdminChanged as RoleAdminChangedEvent,
  RoleGranted as RoleGrantedEvent,
  RoleRevoked as RoleRevokedEvent,
  Transfer as TransferEvent
} from "../generated/Whine/Whine"
import {
  Approval,
  ApprovalForAll,
  ApproveWinery,
  FeeWithdraw,
  Payout,
  RegisterWinery,
  RoleAdminChanged,
  RoleGranted,
  RoleRevoked,
  Transfer
} from "../generated/schema"

export function handleApproval(event: ApprovalEvent): void {
  let entity = new Approval(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.owner = event.params.owner
  entity.approved = event.params.approved
  entity.tokenId = event.params.tokenId
  entity.save()
}

export function handleApprovalForAll(event: ApprovalForAllEvent): void {
  let entity = new ApprovalForAll(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.owner = event.params.owner
  entity.operator = event.params.operator
  entity.approved = event.params.approved
  entity.save()
}

export function handleApproveWinery(event: ApproveWineryEvent): void {
  let entity = new ApproveWinery(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.wallet = event.params.wallet
  entity.save()
}

export function handleFeeWithdraw(event: FeeWithdrawEvent): void {
  let entity = new FeeWithdraw(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.to = event.params.to
  entity.save()
}

export function handlePayout(event: PayoutEvent): void {
  let entity = new Payout(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.to = event.params.to
  entity.tokenId = event.params.tokenId
  entity.amount = event.params.amount
  entity.save()
}

export function handleRegisterWinery(event: RegisterWineryEvent): void {
  let entity = new RegisterWinery(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.wallet = event.params.wallet
  entity.save()
}

export function handleRoleAdminChanged(event: RoleAdminChangedEvent): void {
  let entity = new RoleAdminChanged(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.role = event.params.role
  entity.previousAdminRole = event.params.previousAdminRole
  entity.newAdminRole = event.params.newAdminRole
  entity.save()
}

export function handleRoleGranted(event: RoleGrantedEvent): void {
  let entity = new RoleGranted(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.role = event.params.role
  entity.account = event.params.account
  entity.sender = event.params.sender
  entity.save()
}

export function handleRoleRevoked(event: RoleRevokedEvent): void {
  let entity = new RoleRevoked(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.role = event.params.role
  entity.account = event.params.account
  entity.sender = event.params.sender
  entity.save()
}

export function handleTransfer(event: TransferEvent): void {
  let entity = new Transfer(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.from = event.params.from
  entity.to = event.params.to
  entity.tokenId = event.params.tokenId
  entity.save()
}
