import { createStore } from "redux";
import { includeMeaningOfLife, sayHiOnDispatch } from "./exampleAddons/enhancers";
import rootReducer from "./reducer";


const store = createStore(rootReducer,sayHiOnDispatch)

export default store