const { createSlice } = require('@reduxjs/toolkit');

const hardwareBundleVariantFormSlice = createSlice({
    name: 'hardwareBundleVariantFormSlice',
    initialState: [],
    reducers: {
        addBundleVariantInfo(state, action) {
            state.push(action.payload);
        },
        addBundleVariantPart(state, action) {
            state.push(action.payload);
        },
        // remove(state, action) {
        //     return state.filter((item) => item.id !== action.payload);
        // },
    },
});

export const { addBundleVariant, addBundleVariantPart } = hardwareBundleVariantFormSlice.actions;
export default hardwareBundleVariantFormSlice.reducer;