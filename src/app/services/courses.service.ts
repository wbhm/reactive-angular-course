import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {interval, noop, Observable, of, throwError, timer} from 'rxjs';
import {catchError, delay, delayWhen, filter, finalize, map, retryWhen, shareReplay, tap} from 'rxjs/operators';
import {Course, sortCoursesBySeqNo} from '../model/course';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  // private courses$: Observable<Course[]>;

  constructor(private http: HttpClient) { }

  loadAllCourses(): Observable<Course[]> {
    return this.http.get<Course[]>('/api/courses')
    .pipe(
      map(response => response['payload']),
      // tap(data => console.log(JSON.stringify(data))),
      shareReplay(1)
    );

  }

  saveCourse(courseId: string, changes: Partial<Course>): Observable<any> {
    return this.http.put(`/api/course/${courseId}`, changes).pipe(
      shareReplay()
    );
  }

  private handleError() {

  }
}
