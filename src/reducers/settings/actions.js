export const SETTINGS_SET = 'SETTINGS/SET'
export const SETTINGS_CLEAR = 'SETTINGS/CLEAR'

export const setSettings = settings => ({ type: SETTINGS_SET, payload: settings })
export const clearSettings = () => ({ type: SETTINGS_CLEAR })