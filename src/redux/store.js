// import { Reactotron, sagaMonitor } from "./config/ReactotronConfig";
import { createStore, compose, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
// import { composeWithDevTools } from "redux-devtools-extension";
import rootSaga from './sagas';
import reducer from './reducers';
const middleWare = [];

let sagaMiddleware = null;
let store = null;

// if (__DEV__) {
//   // Setup Redux-Saga
//   sagaMiddleware = createSagaMiddleware({ sagaMonitor });
//   middleWare.push(sagaMiddleware);

//   const enhancer = composeWithDevTools({
//     // Options: https://github.com/jhen0409/react-native-#options
//   });
//   store = Reactotron.createStore(
//     reducer,
//     {},
//     enhancer(applyMiddleware(...middleWare))
//   );
// } else {
// Setup Redux-Saga
sagaMiddleware = createSagaMiddleware();
middleWare.push(sagaMiddleware);
const composeEnhancers =
  typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
    : compose;
store = createStore(
  reducer,
  {},
  composeEnhancers(applyMiddleware(...middleWare)),
);
global.manuallyDispatch = store.dispatch;
// }
// Initiate root saga.
rootSaga.map(sagaMiddleware.run);
// store.dispatch({
//   type: '@@__INIT__',
// });

if (module.hot) {
  module.hot.accept('./reducers', () => {
    store.replaceReducer(reducer);
  });
}

export default store;
