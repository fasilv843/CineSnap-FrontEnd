// hydration.reducer.ts
import { type ActionReducer, INIT, UPDATE } from '@ngrx/store'
import { type RootState } from './app.state'

export const hydrationMetaReducer = (
  reducer: ActionReducer<RootState>
): ActionReducer<RootState> => {
  return (state, action) => {
    if (action.type === INIT || action.type === UPDATE) {
      const storageValue = localStorage.getItem('state')
      if (storageValue != null) {
        try {
          return JSON.parse(storageValue)
        } catch {
          localStorage.removeItem('state')
        }
      }
    }
    const nextState = reducer(state, action)
    localStorage.setItem('state', JSON.stringify(nextState))
    return nextState
  }
}
