import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'

import store from './store'

import Menu from './components/menu'

import About from './components/about'
import Dashboard from './components/dashboard'



const DataQualityTool = () => {
  return (
    <Provider store={store}>
        <Menu />
        <Router>
            <Route path="/" exact component={Dashboard} />
            <Route path="/about/" component={About} />
        </Router>
    </Provider>
  )
}

export default DataQualityTool