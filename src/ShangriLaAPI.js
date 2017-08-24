class ShangriLaAPI {
  get url() {
    return 'http://api.moemoe.tokyo/anime/v1'
  }

  async call() {
    return await fetch(this.url).then(
      (response) => response.json()
    )
  }
}

class ShangriLaCoursAPI extends ShangriLaAPI {
  get url() {
    return [super.url, 'master', 'cours'].join('/')
  }
}

class ShangriLaMasterAPI extends ShangriLaAPI {
  get today() {
    return new Date()
  }

  get year() {
    return this._year || this.today.getFullYear()
  }

  set year(value) {
    this._year = value
  }

  get cours() {
    return this._cours || Math.ceil((this.today.getMonth() + 1) / 3)
  }

  set cours(value) {
    this._cours = value
  }

  get url() {
    return [super.url, 'master', this.year, this.cours].join('/')
  }
}

class ShangriLaTwitterAPI extends ShangriLaAPI {
  get url() {
    return [super.url, 'twitter', 'follower'].join('/')
  }

  generateURLParameters(params) {
    const p = Object.keys(params).map((key) => `${key}=${params[key]}`)
    return p.length > 0 ? '?' + p.join('&') : ''
  }

  async getStatus(params) {
    const url = [this.url, 'status'].join('/') + this.generateURLParameters(params)
    return await fetch(url).then(
      (response) => response.json()
    )
  }

  async getHistory(params) {
    const url = [this.url, 'history'].join('/') + this.generateURLParameters(params)
    return await fetch(url).then(
      (response) => response.json()
    )
  }

  async getHistoryDaily(params) {
    const url = [this.url, 'history', 'daily'].join('/') + this.generateURLParameters(params)
    return await fetch(url).then(
      (response) => response.json()
    )
  }
}

export default ShangriLaMasterAPI
export { ShangriLaTwitterAPI, ShangriLaCoursAPI }

