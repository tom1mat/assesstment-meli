import { combineReducers } from "redux";

const reducer = ( state, action ) =>{
    switch(action.type){
        case "START_SESSION":
            return true;
        default: return state;
    }
}

export default reducer;//combineReducers({
//    reducer,
