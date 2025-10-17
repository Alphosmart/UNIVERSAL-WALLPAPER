import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: null,
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserDetails: (state, action) => {
      console.log('🔄 Redux setUserDetails called with:', action.payload?.name || 'null');
      state.user = action.payload
    },
  },
})

export const { setUserDetails } = userSlice.actions

export default userSlice.reducer
