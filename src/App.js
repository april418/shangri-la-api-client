import React, { Component } from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import AppBar from 'material-ui/AppBar'
import ShangriLaRootComponent from './ShangriLaComponents.js'

class App extends Component {
  render() {
    return (
      <MuiThemeProvider>
        <div>
          <AppBar title='ShangriLa Anime API' showMenuIconButton={false} />
          <ShangriLaRootComponent />
        </div>
      </MuiThemeProvider>
    )
  }
}

export default App

