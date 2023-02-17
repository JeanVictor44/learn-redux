const initialState = {
    todos: [
        {id: 0, text: 'Learn React', completed: true },
        {id: 1, text: 'Learn Redux', completed: false, color: 'purple'},
        {id: 2, text: 'Build something fun!', completed: false, color: 'blue'}
    ],
    filters: {
        status: 'All',
        colors: []
    }   
}

function nextTodoId(todos) {
    const maxId = todos.reduce((maxId, todo) => Math.max(maxId, todo.id),-1)
    return maxId + 1
}

export default function appReducer(state = initialState, action){
    switch(action.type){
        case 'todos/todoAdded': 
            return {
                ...state,
                todos: [
                    ...state.todos,
                    {
                        id: nextTodoId(state.todos),
                        text: action.payload,
                        completed: false
                    }
                ]
            }
        case 'todos/todoToggled': 
            return {
                ...state,
                todos: state.todos.filter((todo) => {
                    if(todo.id !== action.payload){
                        return todo
                    }
                    return {
                        ...todo,
                        completed:!todo.completed
                    }
                })
            }
        
        case 'filters/statusFilterChanged':
            return {
                ...state.filters,
                status: action.payload
            } 
        default: 
            return state 
    }
}