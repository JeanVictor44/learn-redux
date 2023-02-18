export function sayHiOnDispatch(createStore){
  return function(rootReducer, preloadedState, enhancers){
    const store = createStore(rootReducer, preloadedState, enhancers)
    function newDispatch(action){
      const result = store.dispatch(action)
      console.log('hi')

      return result
    }

    return {...store, dispatch: newDispatch}
  }
}

export const includeMeaningOfLife = (createStore) => {
  return (rootReducer, preloadedState, enhancers) => {
    const store = createStore(rootReducer, preloadedState, enhancers)

    function newGetState() {
      return {
        ...store.getState(),
        meaningOfLife: 42,
      }
    }

    return { ...store, getState: newGetState }
  }
}
