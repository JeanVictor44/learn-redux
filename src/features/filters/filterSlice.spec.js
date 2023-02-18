import filtersReducer from "./filtersSlice";

test('added a color to filter colors', () => {
    const initialState = {
        status: 'All',
        colors:[]
    }
    const action = {type: 'filters/colorFilterChanged', payload: {color: 'red', changeType: 'added'}}
    const result = filtersReducer(initialState, action)
    expect(result.colors[0]).toBe('red')
})