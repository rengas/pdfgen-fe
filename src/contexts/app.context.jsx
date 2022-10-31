import * as React from 'react'

const AppContext = React.createContext()

function appReducer(appState, action) {
  switch (action.type) {
    case 'TOGGLE_PROFILE_STATUS':
      return {...appState, profileStatus: !appState.profileStatus};
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}

function AppProvider({children}) {
  const [appState, dispatch] = React.useReducer(appReducer, {profileStatus: false})
  // NOTE: you *might* need to memoize this value
  // Learn more in http://kcd.im/optimize-context
  const value = {appState, dispatch}
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

function useApp() {
    const context = React.useContext(AppContext)
    if (context === undefined) {
      throw new Error('useCount must be used within a CountProvider')
    }
    return context
}

export {AppProvider, useApp};