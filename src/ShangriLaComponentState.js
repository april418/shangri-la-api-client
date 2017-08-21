import ShangriLaMasterAPI, { ShangriLaCoursAPI } from './ShangriLaAPI.js'

class ShangriLaComponentState {
  constructor() {
    this.cours_api = new ShangriLaCoursAPI()
    this.master_api = new ShangriLaMasterAPI()
  }

  async fetchMasterData() {
    this.master_api.year = this.selected_cour.year
    this.master_api.cours = this.selected_cour.cours
    return await this.master_api.call()
  }

  async fetchCoursData() {
    return await this.cours_api.call()
  }

  get selected_cour() {
    return this._selected_cour || {}
  }

  set selected_cour(cour) {
    this._selected_cour = cour
  }

  clone() {
    return Object.assign(new ShangriLaComponentState(), this)
  }
}

export default ShangriLaComponentState

