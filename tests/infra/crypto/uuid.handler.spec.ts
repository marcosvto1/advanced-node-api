import { UUIDGenrator } from '@/domain/contracts/gateways'
import { randomUUID } from 'crypto'
import { mocked } from 'ts-jest/utils'

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

  it('should return correct uuid', () => {
    mocked(randomUUID).mockReturnValueOnce('any_uuid')
    const sut = new UUIDHandler()

    const uuid = sut.generate()

    expect(uuid).toBe('any_uuid')
  })
})
