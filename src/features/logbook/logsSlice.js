import { useSelector } from 'react-redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import client from '../../services/apiClient.js'
import { showToast } from "../../features/toasts/toasts"
import AdifImportResult from "./AdifImportResult"

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

const checkImportTask = createAsyncThunk(
	'logs/check-import', 
    async ( task_id, { rejectWithValue, getState, dispatch } ) => {
        try {
            const data = await client({
                url: `/tasks/${task_id}`,
                method: 'GET',
                token: 'skip',
                suppressErrorMessage: true
            })
            if (data.status === 'PENDING') {
                scheduleCheckImportTask({ task_id, dispatch })
            } else {
                const task = getState().logs.importTasks[task_id]
                if (task.background) {
                    showToast( <AdifImportResult
                                    filename={task.filename}
                                    {...data}/>,
                        data.status === 'SUCCESS' ? 'success' : 'error'  )
                } 
            }
            return data
        } catch (e) {
            return rejectWithValue(e)
        }
    }
)

const scheduleCheckImportTask = ({ task_id, dispatch }) => {
    setTimeout( () => dispatch(checkImportTask(task_id)), 30000)
}

export const adifUpload = createAsyncThunk(
	'logs/upload-adif', 
    async ( { log_id, file, onUploadProgress, signal, callback }, { rejectWithValue, getState, dispatch } ) => {
        const formData = new FormData()
        formData.append('log_id', log_id)
        formData.append('file', file)
        try {
            const data = await client({
                url: `/qso/logs/${log_id}/adif/`,
                method: 'PUT',
                onUploadProgress,
                signal,
                getState,
                args: formData,
                suppressErrorMessage: true
            })
            scheduleCheckImportTask({ task_id: data.id, dispatch })
            callback?.(data.id)
            return {...data, log_id, filename: file.name }
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
    importTasks: {}
  },
  reducers: {
    modifyQsoCount: ( state, { payload }) => {
      const affectedLogIndex = state.logs.findIndex( item => item.id === payload.logId )
      state.logs[affectedLogIndex].qso_count += payload.value
    },
    deleteImportTask: ( state, { payload }) => {
      delete state.importTasks[payload.importTaskId]
    },
    setImportTaskBackground: ( state, { payload } ) => {
      state.importTasks[payload.importTaskId].background = true
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
      state.importTasks[payload.id] = payload
    },
    [adifUpload.rejected]: (state) => {
      state.uploading = 'rejected'
    },
    // adif import status check
    [checkImportTask.pending]: (state) => {
    },
    [checkImportTask.fulfilled]: (state, { payload }) => {
      if (payload.status !== 'PENDING') {
        const importTask = state.importTasks[payload.id]
        if (payload.status === 'SUCCESS') {
            const idx = state.logs.findIndex( log => log.id === importTask.log_id )
            state.logs[idx] = { ...state.logs[idx], qso_count: state.logs[idx].qso_count + payload.result.new }
        }
        if (importTask.background) {
          delete state.importTasks[payload.task_id]
        } else {
          importTask.message = payload.message
          importTask.status = payload.status
          importTask.result = payload.result
        }
      }
    },
    [checkImportTask.rejected]: (state) => {
    }
   
  
  },
})
export default logsSlice.reducer

export const { modifyQsoCount, deleteImportTask, setImportTaskBackground } = logsSlice.actions

export const useLogs = () => {
    const logs = useSelector((state) => state.logs.logs)
    const error = useSelector((state) => state.logs.error)
    const isLoading = useSelector((state) => state.logs.loading === 'loading')
    const loading = useSelector((state) => state.logs.loading )
    const uploading = useSelector((state) => state.logs.uploading )
    const useImportTask = (taskId) => useSelector((state) => state.logs.importTasks[taskId] )

    return { logs, error, isLoading, loading, uploading, useImportTask }
}

