import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Course} from '../model/course';
import {
  debounceTime,
  distinctUntilChanged,
  startWith,
  tap,
  delay,
  map,
  concatMap,
  switchMap,
  withLatestFrom,
  concatAll, shareReplay, catchError
} from 'rxjs/operators';
import {merge, fromEvent, Observable, concat, throwError, combineLatest} from 'rxjs';
import {Lesson} from '../model/lesson';
import { CoursesService } from 'app/services/courses.service';


interface CourseData {
  course: Course;
  lessons: Lesson[];
}

@Component({
  selector: 'course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {

  courseData$: Observable<CourseData>;

  constructor(private route: ActivatedRoute,
    private coursesService: CoursesService) {

    const courseId = parseInt(this.route.snapshot.paramMap.get('courseId'));
    const course$ = this.coursesService.loadCourseById(courseId);
    const lessons$ = this.coursesService.loadAllCourseLessons(courseId);

    this.courseData$ = combineLatest([course$, lessons$]).pipe(
      map(([course, lessons]) =>  {
        return {
          course,
          lessons
        }
      }),
      tap(console.log)
    );

  }

  ngOnInit() {}


}











