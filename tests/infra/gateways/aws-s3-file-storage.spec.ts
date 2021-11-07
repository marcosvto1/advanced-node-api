import { config } from 'aws-sdk'

class AwsS3FileStorage {
  constructor (
    private readonly accessKey: string, secret: string
  ) {
    config.update({
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secret
      }
    })
  }
}

jest.mock('aws-sdk')

describe('AwsS3FileStorage', () => {
  it('should config aws credentials on creation', () => {
    const accessKey = ''
    const secret = ''

    const sut = new AwsS3FileStorage(accessKey, secret)

    expect(sut).toBeDefined()
    expect(config.update).toHaveBeenCalledWith({
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secret
      }
    })
    expect(config.update).toHaveBeenCalledTimes(1)
  })
})
