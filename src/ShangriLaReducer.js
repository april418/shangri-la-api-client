class ShangriLaReducer {
  reduce(state, action) {
    const new_state = state.clone()
    const name = action.type.replace(/^./, (matched) => matched.toUpperCase())
    return this[`reduce${name}Action`](new_state, action.value)
  }

  reduceSelectorChangedAction(state, value) {
    state.selected_cour = value
    return state
  }

  reduceMasterDataLoadedAction(state, value) {
    state.master_data = value
    return state
  }

  reduceCoursDataLoadedAction(state, value) {
    state.cours_data = value
    return state
  }
}

export default ShangriLaReducer

