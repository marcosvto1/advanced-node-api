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
  let sut: UUIDHandler

  beforeEach(() => {
    sut = new UUIDHandler()
  })

  beforeAll(() => {
    mocked(randomUUID).mockReturnValue('any_uuid')
  })

  it('should call uuid', () => {
    sut.generate()

    expect(randomUUID).toHaveBeenCalledTimes(1)
  })

  it('should return correct uuid', () => {
    const uuid = sut.generate()

    expect(uuid).toBe('any_uuid')
  })
})
