import {Injectable} from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, concatMap, finalize } from 'rxjs/operators';

@Injectable()
export class LoadingService {

    private loadingSubject = new BehaviorSubject<boolean>(false);

    loading$: Observable<boolean> = this.loadingSubject.asObservable();

    showLoaderUntilCompleted<T>(obj$: Observable<T>): Observable<T> {
        return of(null).pipe(
            // set loading$ to true upon obj$ subscription and complete immediately
            tap( () => this.loading(true)),
            // combine loading$ and obj$
            concatMap( () => obj$ ),
            // set loading$ to false  when both complete
            finalize( () => this.loading(false))
        )
    }

    loading(value: boolean) {
        this.loadingSubject.next(value);
    }
}
