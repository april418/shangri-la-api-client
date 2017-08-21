class Action {
  constructor(type, value) {
    this._type = type
    this._value = value
  }

  get type() {
    return this._type
  }

  get value() {
    return this._value
  }
}

const SHANGRILA_ACTIONS = {
  SELECTOR_CHANGED: 'selectorChanged',
  MASTER_DATA_LOADED: 'masterDataLoaded',
  COURS_DATA_LOADED: 'coursDataLoaded'
}

class ShangriLaSelectorChangedAction extends Action {
  constructor(value) {
    super(SHANGRILA_ACTIONS.SELECTOR_CHANGED, value)
  }
}

class ShangriLaMasterDataLoadedAction extends Action {
  constructor(value) {
    super(SHANGRILA_ACTIONS.MASTER_DATA_LOADED, value)
  }
}

class ShangriLaCoursDataLoadedAction extends Action {
  constructor(value) {
    super(SHANGRILA_ACTIONS.COURS_DATA_LOADED, value)
  }
}

class ShangriLaActionCreator {
  static selectorChanged(value) {
    return new ShangriLaSelectorChangedAction(value)
  }

  static masterDataLoaded(value) {
    return new ShangriLaMasterDataLoadedAction(value)
  }

  static coursDataLoaded(value) {
    return new ShangriLaCoursDataLoadedAction(value)
  }
}

export default ShangriLaActionCreator

