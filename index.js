// state
// action
// reducer 
// store

const { default: axios } = require('axios')
const {createStore, applyMiddleware} = require('redux')
const thunk = require('redux-thunk').default

const GET_TODOS_REQUEST = 'GET_TODOS_REQUEST'
const GET_TODOS_SUCCESS = 'GET_TODOS_SUCCESS'
const GET_TODOS_FAILED = 'GET_TODOS_FAILED'
const TODOS_URL = 'https://jsonplaceholder.typicode.com/todos'

//state
const initialState = {
    todos:[],
    isLoading: false,
    error : null
}


//action creator
const getTodosRequest = () =>{
    return{
        type: GET_TODOS_REQUEST
    }
}
const getTodosSuccess = (todos) =>{
    return{
        type: GET_TODOS_SUCCESS,
        payload: todos
    }
}
const getTodosFailed = (error) =>{
    return{
        type: GET_TODOS_FAILED,
        error: error
    }
}


//reducer
const todosReducer = (state=initialState , action) =>{
    switch (action.type) {
        case GET_TODOS_REQUEST:
            return {
                ...state,
                isLoading: true
            }
        case GET_TODOS_SUCCESS:
            return {
                ...state,
                isLoading: false,
                todos:[...state.todos,...action.payload]
            }
        case GET_TODOS_FAILED:
            return {
                ...state,
                isLoading: false,
                error: action.payload
            }
    
        default:
            return state;
    }
}


const fetchData = () =>{    // always return function
    return (dispatch) =>{
        dispatch(getTodosRequest())
        axios.get(TODOS_URL)
        .then(res =>{
            const todos = res.data 
            const todosTitle = todos.map((todo) => todo.title)
            dispatch(getTodosSuccess(todosTitle))
        })
        .catch(err =>{
            dispatch(getTodosFailed(err.message))
        })
    }
}

//store
const store = createStore(todosReducer, applyMiddleware(thunk))

store.subscribe(()=>{
    console.log(store.getState())
})

store.dispatch(fetchData()) 