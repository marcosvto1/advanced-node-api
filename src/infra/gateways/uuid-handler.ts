import { UUIDGenrator } from '@/domain/contracts/gateways'
import { randomUUID } from 'crypto'

export class UUIDHandler implements UUIDGenrator {
  generate (): UUIDGenrator.Output {
    return randomUUID()
  }
}
