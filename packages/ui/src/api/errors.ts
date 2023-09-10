const errors = {
  regex: /^(?<method>.+):(?<status>\d+):(?<message>.+)/i,

  get navigationErrorStub() {
    return new Error('GET:400:Bad Request')
  },

  /**
   * Creates an error object with message built from params.
   *
   * @param {string} method HTTP method
   * @param {number} status HTTP status
   * @param {string} description Message associated with the error
   */
  create(method: string, status: number, description: string) {
    return new Error(`${method}:${status}:${description}`)
  },

  getMethod(error: Error) {
    const matches = error.message.match(this.regex)

    if (matches && matches.groups) {
      return matches.groups.method
    }

    return ''
  },

  getStatus(error: Error) {
    const matches = error.message.match(this.regex)

    if (matches) {
      return parseInt(matches.groups?.status ?? '0')
    }

    return 0
  },

  getMessage(error: Error) {
    const matches = error.message.match(this.regex)

    if (matches && matches.groups) {
      return matches.groups.message.trim()
    }

    return ''
  },

  isNavigation(error: Error) {
    const method = this.getMethod(error)
    const status = this.getStatus(error)

    if (method.toUpperCase() === 'GET' && status === 404) {
      return true
    }

    return false
  },

  isServer(error: Error) {
    const status = this.getStatus(error)

    if (status >= 500) {
      return true
    }

    return false
  }
}

export { errors }
