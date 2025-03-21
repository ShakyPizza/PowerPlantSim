import { Component } from '../types';

export abstract class BaseComponent<T extends Record<string, number> = Record<string, number>> implements Component<T> {
    protected name: string;
    protected state: Record<string, number>;

    constructor(name: string) {
        this.name = name;
        this.state = {};
    }

    abstract process(inputs: Record<string, number>): T;

    protected getState(key: string): number {
        return this.state[key] ?? 0;
    }

    protected setState(key: string, value: number): void {
        this.state[key] = value;
    }

    getName(): string {
        return this.name;
    }
} 