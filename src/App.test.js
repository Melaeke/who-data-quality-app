import React from 'react'
import ReactDOM from 'react-dom'

import { Provider } from 'react-redux'
import { store } from './store'

import App from './App'

// Mock headerbar, as the current version requires REACT_APP_DHIS2_BASE_URL to be set
//jest.mock('@dhis2/ui-widgets/HeaderBar', () => <div />)

it('renders without crashing', () => {
    const div = document.createElement('div')
    ReactDOM.render(<App />, div)
    ReactDOM.unmountComponentAtNode(div)
})
