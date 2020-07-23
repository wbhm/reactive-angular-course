import {Component, OnInit } from '@angular/core';
import { CoursesService } from '../services/courses.service';
import { Observable, EMPTY, throwError } from 'rxjs';
import { Course, sortCoursesBySeqNo } from 'app/model/course';
import { map, finalize, catchError } from 'rxjs/operators';
import { LoadingService } from 'app/loading/loading.service';
import { MessagesService } from 'app/messages/messages.service';



@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent  implements OnInit {

  beginnerCourses$: Observable<Course[]>;
  advancedCourses$: Observable<Course[]>;

  constructor(private coursesService: CoursesService,
    private loadingService: LoadingService,
    private messagesService: MessagesService) {}

  ngOnInit() {
    this.reloadCourses();
  }

  reloadCourses() {

    const courses$ = this.coursesService.loadAllCourses().pipe(
      map(courses => courses.sort(sortCoursesBySeqNo)),
      // catch and rethrow
      catchError(err => {
        const message = 'Could not load courses';
        this.messagesService.showErrors(message);
        console.log(message, err);
        return throwError(err);
      })
    );

    const loadCourses$ = this.loadingService.showLoaderUntilCompleted(courses$);

    this.beginnerCourses$ = loadCourses$.pipe(
      map(courses => courses.filter(course => course.category === 'BEGINNER'))
    );

    this.advancedCourses$ = loadCourses$.pipe(
      map(courses => courses.filter(course => course.category === 'ADVANCED'))
    );
  }

}




