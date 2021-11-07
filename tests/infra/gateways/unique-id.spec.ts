import { UniqueId } from '@/infra/gateways/unique-id'

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
