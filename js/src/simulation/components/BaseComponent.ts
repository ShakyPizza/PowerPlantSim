/**
 * Interface defining the basic structure of a simulation component.
 * @template T - The type of the component's output data
 */
export interface Component<T extends Record<string, number> = Record<string, number>> {
    /**
     * Process the component's inputs and return the calculated outputs.
     * @param inputs - Input parameters for the component
     * @returns The calculated output values
     */
    process(inputs: Record<string, number>): T;
}

/**
 * Abstract base class for all simulation components.
 * Provides common functionality for state management and component identification.
 * @template T - The type of the component's output data
 */
export abstract class BaseComponent<T extends Record<string, number>> implements Component<T> {
    /** Internal state storage for the component */
    protected state: Record<string, number> = {};

    /**
     * Create a new base component.
     * @param name - The name of the component for identification
     */
    constructor(protected readonly name: string) {}

    /**
     * Process the component's inputs and return the calculated outputs.
     * Must be implemented by derived classes.
     * @param inputs - Input parameters for the component
     * @returns The calculated output values
     */
    abstract process(inputs: Record<string, number>): T;

    /**
     * Get a state value by key.
     * @param key - The key of the state value to retrieve
     * @returns The state value, or 0 if not found
     */
    protected getState(key: string): number {
        return this.state[key] ?? 0;
    }

    /**
     * Set a state value by key.
     * @param key - The key of the state value to set
     * @param value - The value to set
     */
    protected setState(key: string, value: number): void {
        this.state[key] = value;
    }

    /**
     * Get the name of the component.
     * @returns The component's name
     */
    getName(): string {
        return this.name;
    }
} 