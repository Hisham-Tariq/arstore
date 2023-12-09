import { Injectable } from '@angular/core';
import { ReflectionDrawerComponent } from './drawer.component';

@Injectable({
    providedIn: 'root'
})
export class ReflectionDrawerService
{
    private _componentRegistry: Map<string, ReflectionDrawerComponent> = new Map<string, ReflectionDrawerComponent>();

    /**
     * Constructor
     */
    constructor()
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Register drawer component
     *
     * @param name
     * @param component
     */
    registerComponent(name: string, component: ReflectionDrawerComponent): void
    {
        this._componentRegistry.set(name, component);
    }

    /**
     * Deregister drawer component
     *
     * @param name
     */
    deregisterComponent(name: string): void
    {
        this._componentRegistry.delete(name);
    }

    /**
     * Get drawer component from the registry
     *
     * @param name
     */
    getComponent(name: string): ReflectionDrawerComponent | undefined
    {
        return this._componentRegistry.get(name);
    }
}
