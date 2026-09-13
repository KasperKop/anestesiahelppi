import { decodeMemory, emptyMemory, MemoryState } from './model';
const key = 'anestesiahelppi.memory.v1';
export async function readMemory() {
  if (typeof window === 'undefined') return emptyMemory();
  return decodeMemory(window.localStorage.getItem(key));
}
export async function writeMemory(state: MemoryState) {
  window.localStorage.setItem(key, JSON.stringify(state));
}
