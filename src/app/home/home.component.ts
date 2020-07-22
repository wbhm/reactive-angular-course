import {Component } from '@angular/core';
import { CoursesService } from '../services/courses.service';



@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  beginnerCourses$ = this.coursesService.beginnerCourses$;
  advancedCourses$ = this.coursesService.advancedCourses$;

  constructor(private coursesService: CoursesService) {}

}




