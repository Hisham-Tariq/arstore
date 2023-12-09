import { NgModule } from '@angular/core';
import { ReflectionNavigationService } from './reflection-navgation.service';

@NgModule({
    providers: [
      ReflectionNavigationService
    ]
})
export class ReflectionNavigationModule
{
    /**
     * Constructor
     */
    constructor(private _reflectionNavigationService: ReflectionNavigationService)
    {
    }
}
