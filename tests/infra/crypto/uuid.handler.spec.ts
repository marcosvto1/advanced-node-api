import { UUIDGenrator } from '@/domain/contracts/gateways'
import { randomUUID } from 'crypto'

class UUIDHandler implements UUIDGenrator {
  generate (): UUIDGenrator.Output {
    return randomUUID()
  }
}

jest.mock('crypto')

describe('UUIDHanlder', () => {
  it('should call uuid', () => {
    const sut = new UUIDHandler()

    sut.generate()

    expect(randomUUID).toHaveBeenCalledTimes(1)
  })
})
