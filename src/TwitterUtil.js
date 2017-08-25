class TwitterUtil {
  static get url() {
    return 'https://twitter.com'
  }

  static getAccountURL(account) {
    return `${this.url}/${account}`
  }

  static getHashTagURL(tag) {
    return `${this.url}/hashtag/${tag}`
  }
}

export default TwitterUtil

