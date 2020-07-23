import {Component, OnInit } from '@angular/core';
import { Observable, EMPTY, throwError } from 'rxjs';
import { Course, sortCoursesBySeqNo } from 'app/model/course';
import { map, finalize, catchError } from 'rxjs/operators';
import { CoursesStore } from '../services/courses.store';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent  implements OnInit {

  beginnerCourses$: Observable<Course[]>;
  advancedCourses$: Observable<Course[]>;

  constructor(
    private coursesStore: CoursesStore) {}

  ngOnInit() {
    this.reloadCourses();
  }

  reloadCourses() {
    this.beginnerCourses$ = this.coursesStore.filterByCategory('BEGINNER');
    this.advancedCourses$ = this.coursesStore.filterByCategory('ADVANCED');
  }

}




