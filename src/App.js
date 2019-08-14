import React, { useEffect, useState } from 'react'

import { CssReset } from '@dhis2/ui-core'
import { HeaderBar } from '@dhis2/ui-widgets'
import { Provider as DataProvider } from '@dhis2/app-runtime'

import styles from './App.module.css'

import DataQualityTool from './DataQualityTool'

import './App.css'

const App = () => {
    return (
        <DataProvider
            config={{
                baseUrl: process.env.REACT_APP_DHIS2_BASE_URL,
                apiVersion: '',
            }}
        >
            <div className={styles.wrapper}>
                <HeaderBar appName="WHO Data Quality Tool" />
                <DataQualityTool />
            </div>
            <CssReset />
        </DataProvider>
    )
}

export default App
