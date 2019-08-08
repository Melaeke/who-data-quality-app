
import { SETTINGS_SET, SETTINGS_CLEAR } from './actions'

const initialState = null

const settingsReducer = (state = initialState, action) => {
    const { type, payload } = action

    switch ( type )
    {
        case SETTINGS_SET:
            return { ...payload }
        case SETTINGS_CLEAR:
            return null
        default:
            return state
    }
}

export default settingsReducer