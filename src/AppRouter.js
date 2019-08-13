import React from 'react'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'

import Menu from './components/menu'

import About from './components/about'
import Dashboard from './components/dashboard'

const AppRouter = () => (
    <>
        <Menu />
        <Router>
            <Route path="/" exact component={Dashboard} />
            <Route path="/about/" component={About} />
        </Router>
    </>
)

export default AppRouter
