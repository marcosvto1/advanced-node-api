import { UserProfile } from '@/domain/entities'

describe('UserProfile', () => {
  let sut: UserProfile

  beforeEach(() => {
    sut = new UserProfile('any_id')
  })

  it('should create with empty initials when pictureUrl only is provided', () => {
    sut.setPicture({ pictureUrl: 'any_url', name: 'any_name' })
    expect(sut).toEqual({
      id: 'any_id',
      pictureUrl: 'any_url',
      initials: undefined
    })
  })

  it('should create with empty initials when pictureUrl only is provided', () => {
    sut.setPicture({ pictureUrl: 'any_url' })
    expect(sut).toEqual({
      id: 'any_id',
      pictureUrl: 'any_url',
      initials: undefined
    })
  })

  it('should create initials with first letter of first and last name', () => {
    sut.setPicture({ name: 'Marcos Vinicius Tomaz de Olveira' })
    expect(sut).toEqual({
      id: 'any_id',
      pictureUrl: undefined,
      initials: 'MO'
    })
  })

  it('should create initials with first two letter of first name', () => {
    sut.setPicture({ name: 'Marcos' })
    expect(sut).toEqual({
      id: 'any_id',
      pictureUrl: undefined,
      initials: 'MA'
    })
  })

  it('should create initials with first letter', () => {
    sut.setPicture({ name: 'M' })
    expect(sut).toEqual({
      id: 'any_id',
      pictureUrl: undefined,
      initials: 'M'
    })
  })

  it('should create with empty initials when name and pictureUrl are not provided', () => {
    sut.setPicture({})
    expect(sut).toEqual({
      id: 'any_id',
      pictureUrl: undefined,
      initials: undefined
    })
  })
})
