import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'

import { HeaderBar } from '@dhis2/ui-widgets'
import { Provider } from '@dhis2/app-runtime'

import { setSettings } from './reducers/settings/actions'

import loadAppSettings from './helpers/settings'

import AppRouter from './AppRouter'

import { ScreenCover, CircularLoader } from '@dhis2/ui-core'

import './App.css'

const App = ({
    url,
    appName,
    apiVersion,
    loadAppSettings,
    appSettingsLoading,
}) => {
    useEffect(() => {
        loadAppSettings(url, apiVersion)
    }, [loadAppSettings, url, apiVersion])

    return (
        <>
            <Provider config={{ baseUrl: url, apiVersion: apiVersion }}>
                <HeaderBar appName={appName} />
            </Provider>
            {appSettingsLoading ? (
                <AppRouter />
            ) : (
                <ScreenCover>
                    <CircularLoader />
                </ScreenCover>
            )}
        </>
    )
}

const mapStateToProps = state => ({
    appSettingsLoading: state.settings !== null,
    appSettings: state.settings,
})

const mapDispatchToProps = dispatch => {
    return {
        loadAppSettings: (url, apiVersion) =>
            dispatch(async dispatch => {
                try {
                    const json = await loadAppSettings(url, apiVersion)
                    dispatch(setSettings(json))
                } catch (err) {
                    //TODO: handle error
                }
            }),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App)
