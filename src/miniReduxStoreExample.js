// preloadedState -> opcional -> Estado carregado fora do store que é passado como estado inicial da aplicação


// ex: Estados vindo do localStorage
function filtersReducer(state, action){
    switch(action.type){

        case 'filters/statusFilterChanged': {
            return {
              // Again, one less level of nesting to copy
              ...state,
              filters: action.payload
            }
          }
        
        case 'filters/colorFilterChanged': {
            if(action.payload.changeType === 'added'){
                return {
                    ...state,
                    colors:[...state.colors, action.payload.color]
                }
            }else if(action.payload.changeType === 'remove'){
                return {
                    ...state,
                    colors: state.colors.filter((color) => color !== action.payload.color)
                }
        
            }else {
                return state
            }
        }
        default: 
            return state
    }
}


function createStore(reducer, preloadedState, enhancers){
    // createStore possui o estado dentro dele começando com o preloadedState
    let state = preloadedState
    
    // Listeners: todas as funções que são executadas no momento que o dispatch é feito
    // Ou seja: aqui fica todas as funções que são executadas depois que o estado da aplicação muda
    // As funções são registrada aqui através do subscribe
    const listeners = []
    
    
    // função para retornar o estado atual
    function getState(){
        // O getState retorna o estado exato dentro da memória, incluindo a referência da memória
        // qualquer variável externa que pegue esse state e altere alguma propriedade do state pela variável
        // estará alterando o state aqui dentro também, visto que compartilham o mesmo endereço de memória
        // NÃO MODIFIQUE O ESTADO DEPOIS DE ARMAZENAR ELE EXTERNAMENTE, POIS ELES IRÃO COMPARTILHAR O MESMO ENDEREÇO DE MEMÓRIA
        // A ALTERAÇÃO NA VARIÁVEL EXTERNA ALTERA TAMBÉM O ESTADO INTERNO 
        return state
    }

    // Subscribe adiciona uma função que será executada sempre que o estado da aplicação alterar
    function subscribe(listener){

        // Adicionando a função para a lista de funções ouvintes da alteração de estado
        listeners.push(listener)

        // Retornando uma função que remove a função de escuta dos ouvintes
        // Quando o unsubscribe é utilizado a função é removida dos ouvintes e portanto não será mais executada a cada atualização de estado
        return function unsubscribe(){
            const index = listeners.indexOf(listener)
            listeners.splice(index, 1)
        }
    }

    // utiliza o reducer com a ação passada
    // executa todas as funções ouvintes que agora poderão ter acesso ao estado atualizado
    function dispatch(action){
        state = reducer(state,action)
        listeners.forEach((listener) => listener())
    }

    // dispara um evento com um type aleatório para inicializar o estado da aplicação caso nenhum estado seja fornecido
    dispatch({type:'@@redux/INIT'})

    if(enhancers){
        return enhancers(createStore)(reducer,preloadedState)
    }
    return {getState, subscribe, dispatch}
}


function compose(...enhancers){
    
    return function (createStore){
        return (reducer,preloadedState) => {
            const lastEhancer = enhancers.reduceRight((acc, enhancer) => (createStore) => (reducer, preloadedState) => enhancer(createStore)(reducer,preloadedState,acc))
            return lastEhancer(createStore)(reducer, preloadedState)
        }
    }
}


function sayHiOnDispatch2(createStore) {
    return function (reducer, preloadedState, enhancers){
        const store = createStore(reducer, preloadedState,enhancers)
        
        function newDispatch(action){
            const result = store.dispatch(action)
            console.log('HI!')
            return result
        }
        return {...store, dispatch: newDispatch}
    }
}

function sayGoodByeInSubscribe(createStore) {
    return function (reducer, preloadedState, enhancers){
        const store = createStore(reducer, preloadedState,enhancers)
        
        function newSubscribe(listener){
            store.subscribe(listener)
            console.log('goodBye!')
        }
        return {...store, subscribe: newSubscribe}
    }
}

function formatStateReturn(createStore){
    return (reducer, preloadedState, enhancers) => {
        const store = createStore(reducer,preloadedState, enhancers)
        function getStateFormatted(){
            return {
                ...store.getState(),
                filters:{
                    status:`status -> ${store.getState().filters.status}`
                }
            }
        }
        return {...store, getState:getStateFormatted }
    }
}

const composeEnhancers = compose(sayHiOnDispatch2,formatStateReturn,sayGoodByeInSubscribe)

const store = createStore(filtersReducer, undefined, composeEnhancers)
store.subscribe(() => console.log(store.getState()))
store.dispatch({type: 'filters/statusFilterChanged', payload: {
    status: 'All'
}})

store.dispatch({type: 'filters/statusFilterChanged', payload: {
    status: 'None'
}})

// O STORE TEM ACESSO AO STATE POR QUE AS FUNÇÕES CRIADAS DENTRO DELA FAZEM UMA CLOSURE -> FECHAMENTO 
const state = store.getState()
// NUNCA FAZER ISSO, POIS A VARIÁVEL STATE DENTRO DO STORE TAMBÉM É MODIFICADO
state.filters.status = 'kkkkkkk'

console.log(store.getState())


