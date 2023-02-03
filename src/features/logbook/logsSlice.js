import { useSelector } from 'react-redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import client from '../../services/apiClient.js'


export const logsFetch = createAsyncThunk(
	'logs/fetch', 
    async ( user_id, { rejectWithValue, getState } ) => {
        user_id = user_id || getState().auth.user?.id
        if (user_id) {
            try {
                const data = await client({
                    url: `/qso/logs/`,
                    method: 'GET',
                    params: { user_id },
                    getState,
                    suppressErrorMessage: true
                })
                return data
            } catch (e) {
                return rejectWithValue(e)
            }
        }
    }
)

export const logUpdate = createAsyncThunk(
	'logs/update', 
    async ( { log_id, log_update }, { rejectWithValue, getState } ) => {
        try {
            const  data = await client({
                url: `/qso/logs/${log_id}`,
                method: 'PUT',
                getState,
                args: { log_update }
            })
            return data
        } catch (e) {
            return rejectWithValue(e)
        }
    }
)

export const adifUpload = createAsyncThunk(
	'logs/upload-adif', 
    async ( { log_id, file, onUploadProgress }, { rejectWithValue, getState } ) => {
        const formData = new FormData()
        formData.append('log_id', log_id)
        formData.append('file', file)
        try {
            const data = await client({
                url: `/qso/logs/${log_id}/adif`,
                method: 'PUT',
                getState,
                args: formData
            })
            return {...data, log_id }
        } catch (e) {
            return rejectWithValue(e)
        }
    }
)



export const logCreate = createAsyncThunk(
	'logs/create', 
    async ( new_log, { rejectWithValue, getState } ) => {
        try {
            const data = await client({
                url: `/qso/logs/`,
                method: 'POST',
                getState,
                args: { new_log }
            })
            return data
        } catch (e) {
            return rejectWithValue(e)
        }
    }
)

export const logDelete = createAsyncThunk(
	'logs/delete', 
    async ( log_id, { rejectWithValue, getState } ) => {
        try {
            await client({
          		url: `/qso/logs/${log_id}`,
                method: 'DELETE',
                getState
            })
            return log_id
        } catch (e) {
            return rejectWithValue(e)
        }
    }
)

const extraReducerRejected = (state, { payload }) => {
  state.loading = 'failed'
  state.error = payload
}

const extraReducerPending = (state) => {
  state.loading = 'loading'
  state.error = null
}

const logsSlice = createSlice({
  name: 'logs',
  initialState: {
    loading: 'idle',
    uploading: 'idle',
    error: null,
    logs: [],
    importTasks: []
  },
  reducers: {
    modifyQsoCount: ( state, { payload }) => {
      const logs = [...state.logs]
      const affectedLogIndex = logs.findIndex( item => item.id === payload.logId )
      logs[affectedLogIndex] = { 
          ...logs[affectedLogIndex], 
          qso_count: logs[affectedLogIndex].qso_count + payload.value
      }
      return { ...state, logs }
    }
  },
  extraReducers: {
    // fetch user's logs
    [logsFetch.pending]: extraReducerPending,
    [logsFetch.fulfilled]: (state, { payload }) => {
      state.loading = 'succeeded'
      state.logs = payload
    },
    [logsFetch.rejected]: extraReducerRejected,
    //update log
    [logUpdate.pending]: extraReducerPending,
    [logUpdate.fulfilled]: (state, { payload }) => {
      state.isLoading = 'succeeded'
      const idx = state.logs.findIndex( log => log.id === payload.id )
      const { qso_count } = state.logs[idx]
      state.logs[idx] = { ...payload, qso_count }
    },
    [logUpdate.rejected]: extraReducerRejected,
    //create log
    [logCreate.pending]: extraReducerPending,
    [logCreate.fulfilled]: (state, { payload }) => {
      state.isLoading = 'succeeded'
      state.logs.push(payload)
    },
    [logCreate.rejected]: extraReducerRejected,
    //delete log
    [logDelete.pending]: extraReducerPending,
    [logDelete.fulfilled]: (state, { payload }) => {
      state.logs = state.logs.filter( log => log.id !== payload )
      state.isLoading = 'succeeded'
    },
    [logDelete.rejected]: extraReducerRejected,
     // adif upload
    [adifUpload.pending]: (state) => {
      state.uploading = 'loading'
    },
    [adifUpload.fulfilled]: (state, { payload }) => {
      state.uploading = 'succeeded'
      state.importTasks.push(payload)
    },
    [adifUpload.rejected]: (state) => {
      state.uploading = 'rejected'
    }
   
  },
})
export default logsSlice.reducer

export const { modifyQsoCount } = logsSlice.actions

export const useLogs = () => {
    const logs = useSelector((state) => state.logs.logs)
    const error = useSelector((state) => state.logs.error)
    const isLoading = useSelector((state) => state.logs.loading === 'loading')
    const loading = useSelector((state) => state.logs.loading )
    const uploading = useSelector((state) => state.logs.uploading )

    return { logs, error, isLoading, loading, uploading }
}

