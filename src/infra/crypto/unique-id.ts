import { UUIDGenrator } from '@/domain/contracts/gateways'

export class UniqueId implements UUIDGenrator {
  constructor (private readonly date: Date) {}

  generate (): UUIDGenrator.Output {
    return this.date.getFullYear() + '' + (this.date.getMonth() + 1).toString().padStart(2, '0') +
    this.date.getDate().toString().padStart(2, '0') +
    this.date.getHours().toString().padStart(2, '0') +
    this.date.getMinutes().toString().padStart(2, '0') +
    this.date.getSeconds().toString().padStart(2, '0')
  }
}
