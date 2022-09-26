import { concat, Observable, share, take, tap } from 'rxjs';

export const tapOnce = <T>(fn: (value: T) => void) => {
  return (source$: Observable<T>) => {
    const sharedSource$ = source$.pipe(share());
    const tapped$ = sharedSource$.pipe(take(1), tap(fn));
    return concat(tapped$, sharedSource$);
  };
};
