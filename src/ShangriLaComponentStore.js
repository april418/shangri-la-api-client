import ShangriLaReducer from './ShangriLaReducer.js'
import ShangriLaComponentState from './ShangriLaComponentState.js'

class ShangriLaComponentStore {
  constructor(reducer, state) {
    this._reducer = reducer || new ShangriLaReducer()
    this._state = state || new ShangriLaComponentState()
    this._listeners = []
  }

  get state() {
    return this._state
  }

  dispatch(action) {
    this._state = this._reducer.reduce(this.state, action)
    this._listeners.map(
      (listener) => listener(action)
    )
  }

  subscribe(listener) {
    this._listeners.push(listener)
  }
}

export default ShangriLaComponentStore

