import {useState} from 'react';

export function useHistory(...states) {
  const [history, setHistory] = useState(states);
  
  const current = history[history.length - 1];

  function appendMergeState(state, mergeableState=current) {
    setHistory(history.concat({...mergeableState, ...state}));
  }

  function appendState(state) {
    setHistory(history.concat([state]));
  }

  function rewindState(index, appendRewindKey=true) {
    const state = history[index];

    appendRewindKey
      ? appendMergeState({rewind: index}, state)
      : appendState(state);
  }

  function resetState() {
    setHistory(states);
  }

  return {
    history, current,
    appendState, appendMergeState,
    rewindState, resetState,
  }
}