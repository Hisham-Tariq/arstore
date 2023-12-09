import { animate, state, style, transition, trigger } from '@angular/animations';
import { ReflectionAnimationDurations, ReflectionAnimationCurves } from './defaults';

// -----------------------------------------------------------------------------------------------------
// @ Expand / collapse
// -----------------------------------------------------------------------------------------------------
const rotate180 = trigger('rotate180',
  [
    state('false',
      style({
        transform: 'rotate(0deg)'
      })
    ),

    state('true',
      style({
        transform: 'rotate(540deg)'
      })
    ),

    // // Prevent the transition if the state is false
    // transition('void <=> false, collapsed <=> false, expanded <=> false', []),

    // Transition
    transition('true <=> false',
      animate('{{timings}}'),
      {
        params: {
          timings: `${ReflectionAnimationDurations.entering} ${ReflectionAnimationCurves.sharp}`
        }
      }
    )
  ]
);

export { rotate180 };
