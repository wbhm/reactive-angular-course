import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, tap, shareReplay, catchError } from 'rxjs/operators';
import { Course, sortCoursesBySeqNo } from '../model/course';
import { CoursesService } from './courses.service';
import { LoadingComponent } from 'app/loading/loading.component';
import { LoadingService } from 'app/loading/loading.service';
import { MessagesService } from 'app/messages/messages.service';

@Injectable({
    providedIn: 'root'
})
export class CoursesStore {

    private storeSubject = new BehaviorSubject<Course[]>([]);
    courses$: Observable<Course[]> = this.storeSubject.asObservable();

    constructor(private coursesService: CoursesService,
        private loadingService: LoadingService,
        private messageService: MessagesService) {
        this.loadAllCourses();
    }

    filterByCategory(category: string ): Observable<Course[]> {
        return this .courses$.pipe(
            map(courses => courses.filter(course => course.category === category)
                .sort(sortCoursesBySeqNo)
            )
        );
    }

    private loadAllCourses() {
        const loadingCourses$ = this.coursesService.loadAllCourses().pipe(
            tap(courses => this.storeSubject.next(courses))
        );
        this.loadingService.showLoaderUntilCompleted(loadingCourses$)
        .subscribe();
    }

    saveCourse(courseId: string, changes: Partial<Course>): Observable<any> {
        console.log('saveCourse in course store');
        // update data in memory
        // get current list of courses in memory
        const courses = this.storeSubject.getValue();
        // get index of course being updated
        const index = courses.findIndex(course => course.id === courseId);
        // create new Course from old course and changes
        const newCourse: Course = {
            ...courses[index],
            ...changes
        };
        // copy courses array
        const newCourses: Course[] = courses.slice(0);
        // insert newCourse at appropriate index
        newCourses[index] = newCourse;
        // emit newCourses
        this.storeSubject.next(newCourses);
        // send changes to back end
        return this.coursesService.saveCourse(courseId, changes).pipe(
            catchError(err => {
                const message = 'Could not save course to server';
                console.log(message, err);
                this.messageService.showErrors(message);
                return throwError(err);
            })
        );
    }
}
