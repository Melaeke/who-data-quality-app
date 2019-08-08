import settingsReducer from './'

import { SETTINGS_SET, SETTINGS_CLEAR } from './actions'

describe('Settings reducer', () => {
    it('SETTINGS_SET store settings to state', () => {
        const settings = { foo: 'bar' }
        expect(
            settingsReducer(null, { type: SETTINGS_SET, payload: settings })
        ).toEqual(settings)
    })

    it('SETTINGS_CLEAR should reset the settings', () => {
        expect(
            settingsReducer(null, { type: SETTINGS_CLEAR })
        ).toEqual(null)
    })

    
})