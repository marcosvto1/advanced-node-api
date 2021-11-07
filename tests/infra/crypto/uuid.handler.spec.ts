import { UUIDHandler } from '@/infra/crypto'
import { randomUUID } from 'crypto'
import { mocked } from 'ts-jest/utils'

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
