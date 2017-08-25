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
}

class ShangriLaSelectorChangedAction extends Action {
  constructor(value) {
    super(SHANGRILA_ACTIONS.SELECTOR_CHANGED, value)
  }
}

class ShangriLaActionCreator {
  static selectorChanged(value) {
    return new ShangriLaSelectorChangedAction(value)
  }
}

export default ShangriLaActionCreator

