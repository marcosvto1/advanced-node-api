import { UUIDGenrator } from '@/domain/contracts/gateways'
import { UUIDHandler } from '@/infra/crypto'
import { mocked } from 'ts-jest/utils'

jest.mock('crypto')

class UniqueId implements UUIDGenrator {
  constructor (private readonly date: Date) {}

  generate (): UUIDGenrator.Output {
    return this.date.getFullYear() + '' + (this.date.getMonth() + 1).toString().padStart(2, '0') +
    this.date.getDate().toString().padStart(2, '0') +
    this.date.getHours().toString().padStart(2, '0') +
    this.date.getMinutes().toString().padStart(2, '0') +
    this.date.getSeconds().toString().padStart(2, '0')
  }
}

describe('UniqueId', () => {
  it('should return unique id correct value', () => {
    const sut = new UniqueId(new Date(2021, 9, 10, 10, 10, 10))

    const uuid = sut.generate()

    expect(uuid).toBe('20211010101010')
  })

  it('should return unique id correct value', () => {
    const sut = new UniqueId(new Date(2018, 2, 10, 18, 1, 0))

    const uuid = sut.generate()

    expect(uuid).toBe('20180310180100')
  })
})
