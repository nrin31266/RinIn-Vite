import { createSlice } from "@reduxjs/toolkit"

interface ProfileSlideState{
    status: {
        
    }
    error: {
        
    }
}


const initialState : ProfileSlideState = {
    status:{
        
    },
    error: {}
}



const profileSlide = createSlice({
    initialState: initialState,
    name: "profile",
    reducers: {

    },
    extraReducers: (builder)=>{
        
    }
})

export default profileSlide.reducer;
