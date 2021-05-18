const { createClient } = require('contentful-management')

class ContentfulService {
  constructor ({ space, environment, managementToken }) {
    this.client = createClient({ accessToken: managementToken })
    this.space = space
    this.environment = environment
  }

  async initEnv () {
    const space = await this.client.getSpace(this.space)
    this.env = await space.getEnvironment(this.environment)
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

  async numberOfLinks (entryId) {
    const response = await this.env.getEntries({ links_to_entry: entryId })
    return response.items.length
  }

  async getContentTypeSchema (contentType) {
    try {
      const space = await this.client.getSpace(this.space)
      const environment = await space.getEnvironment(this.environment)
      const response = await environment.getContentType(contentType)
      return response.fields
    } catch (err) {
      throw new Error(`Failed to retrieve content types: ${err.message}`)
    }
  }

  async getContentTypeEntries ({ contentType }) {
    let responseCount
    let entries = []
    const limit = 1000
    do {
      const response = await this.env.getEntries({ skip: entries.length, content_type: contentType, limit })
      entries = [...entries, ...response.items]
      responseCount = response.items.length
    } while (responseCount === limit)
    return entries
  }
}

module.exports = ContentfulService
