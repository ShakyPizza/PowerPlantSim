import { useSimulationStore } from './store/simulationStore'

function App() {
  const { isRunning, startSimulation, stopSimulation } = useSimulationStore()

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Power Plant Simulator</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Simulation Controls</h2>
              <button
                onClick={isRunning ? stopSimulation : startSimulation}
                className={`px-4 py-2 rounded-md ${
                  isRunning
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-green-500 hover:bg-green-600'
                } text-white`}
              >
                {isRunning ? 'Stop Simulation' : 'Start Simulation'}
              </button>
            </div>
            
            {/* Placeholder for visualization components */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-medium mb-2">3D Visualization</h3>
                <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
                  <p className="text-gray-500">3D View Coming Soon</p>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-medium mb-2">Metrics Dashboard</h3>
                <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
                  <p className="text-gray-500">Metrics Coming Soon</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
