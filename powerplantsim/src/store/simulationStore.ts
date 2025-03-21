import { create } from 'zustand'

interface SimulationState {
  isRunning: boolean
  time: number
  speed: number
  temperature: number
  pressure: number
  powerOutput: number
  efficiency: number
  startSimulation: () => void
  stopSimulation: () => void
  setSpeed: (speed: number) => void
  updateMetrics: (metrics: Partial<SimulationState>) => void
}

export const useSimulationStore = create<SimulationState>((set) => ({
  isRunning: false,
  time: 0,
  speed: 1,
  temperature: 25,
  pressure: 1,
  powerOutput: 0,
  efficiency: 0,
  
  startSimulation: () => set({ isRunning: true }),
  stopSimulation: () => set({ isRunning: false }),
  
  setSpeed: (speed: number) => set({ speed }),
  
  updateMetrics: (metrics) => set((state) => ({
    ...state,
    ...metrics,
  })),
})) 