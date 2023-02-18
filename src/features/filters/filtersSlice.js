
const initialState = {
    status: 'All',
    colors: []
}




function filtersReducer(state = initialState, action){
    switch(action.type){

        case 'filters/statusFilterChanged': {
            return {
              // Again, one less level of nesting to copy
              ...state,
              status: action.payload
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

export default filtersReducer