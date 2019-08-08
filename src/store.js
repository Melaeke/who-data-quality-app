import { createStore, applyMiddleware, combineReducers, compose } from 'redux'
import thunk from 'redux-thunk'

import { settingsReducer } from './reducers'


const rootReducer = combineReducers({
    settings: settingsReducer
})

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default createStore(
    rootReducer, 
    composeEnhancers(applyMiddleware(thunk))
)