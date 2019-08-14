import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import styles from './DataQualityTool.module.css'

import store from './store'

import Menu from './components/menu'

import About from './components/about'
import Dashboard from './components/dashboard'

const DataQualityTool = () => {
    return (
        <Provider store={store}>
            <div className={styles.appWrapper}>
                <Menu className={styles.sidebarMenu} />
                <div className={styles.appContent}>
                    <Router>
                        <Route path="/" exact component={Dashboard} />
                        <Route path="/about/" component={About} />
                    </Router>
                </div>
            </div>
        </Provider>
    )
}

export default DataQualityTool
