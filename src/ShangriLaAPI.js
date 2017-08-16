class ShangriLaAPI {
  get url() {
    return 'http://api.moemoe.tokyo/anime/v1'
  }

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
  get url() {
    return [super.url, 'master', this.year, this.cours].join('/')
  }
}

class ShangriLaTwitterAPI extends ShangriLaAPI {
  get url() {
    return [super.url, 'twitter', this.year, this.cours].join('/')
  }
}

export default ShangriLaMasterAPI
export { ShangriLaTwitterAPI, ShangriLaCoursAPI }

