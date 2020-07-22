import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {interval, noop, Observable, of, throwError, timer} from 'rxjs';
import {catchError, delay, delayWhen, filter, finalize, map, retryWhen, shareReplay, tap} from 'rxjs/operators';
import {Course, sortCoursesBySeqNo} from '../model/course';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  courses$: Observable<Course[]> = this.http.get<Course[]>('/api/courses')
  .pipe(
    map(response => response['payload'].sort(sortCoursesBySeqNo)),
    // tap(data => console.log(JSON.stringify(data))),
    shareReplay(1)
  );

  beginnerCourses$ = this.courses$.pipe(
    map(courses => courses.filter( course => course.category === 'BEGINNER'))
  );

  advancedCourses$ = this.courses$.pipe(
    map(courses => courses.filter( course => course.category === 'ADVANCED'))
  );

  constructor(private http: HttpClient) { }

  private handleError() {
    
  }
}
