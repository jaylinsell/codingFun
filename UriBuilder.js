class UriBuilder {
  constructor(url) {
    const [baseUrl, query] = url.split('?')
    const params = query.split('&').reduce((acc, param) => {
                       const [key, value] = param.split('=')
                       return { ...acc, [key]: value }
                    }, {})

    this.url = baseUrl
    this.params = query ? params : {}
  }

  build () {
    const query = Object.entries(this.params).map(([key, val]) => `${key}=${val}`).join('&')
    const url = query ? `${this.url}?${query}` : this.url

    return encodeURI(url)
  }
}
