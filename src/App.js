import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { HeaderBar } from '@dhis2/ui-widgets'
import { Provider } from '@dhis2/app-runtime'

import { setSettings } from './reducers/settings/actions'

import loadAppSettings from './helpers/settings'

import './App.css';



const App = ({url, appName, apiVersion, loadAppSettings, appSettingsLoading, appSettings}) => {

  useEffect(() => {
    loadAppSettings(url, apiVersion)
  }, [loadAppSettings, url, apiVersion])

  return (
    <Provider config={{baseUrl: url, apiVersion: apiVersion}}>
      <HeaderBar appName={appName} />
      { !appSettingsLoading && 
        <pre>{JSON.stringify(appSettings, undefined, 2)}</pre>
      }
    </Provider>
  )
}


const mapStateToProps = state => ({
  appSettingsLoading: state.settings !== null,
  appSettings: state.settings
})

const mapDispatchToProps = dispatch => {
  return {
    loadAppSettings: (url, apiVersion) => dispatch(async (dispatch) => {
      try { 
        const json = await loadAppSettings(url, apiVersion)
        dispatch(setSettings(json))
      } catch ( err ) {
        
      }
    })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
