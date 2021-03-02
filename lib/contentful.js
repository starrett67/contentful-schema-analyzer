const { createClient } = require('contentful-management')

class ContentfulService {
  constructor ({ space, environment, managementToken }) {
    this.client = createClient({ accessToken: managementToken })
    this.space = space
    this.environment = environment
  }

  async loadContentTypes () {
    try {
      const space = await this.client.getSpace(this.space)
      const environment = await space.getEnvironment(this.environment)
      const response = await environment.getContentTypes()
      return response.items
    } catch (err) {
      throw new Error(`Failed to retrieve content types: ${err.message}`)
    }
  }
}

module.exports = ContentfulService
