import { Component, OnInit, Input } from '@angular/core';
import { Lesson } from 'app/model/lesson';

@Component({
  selector: 'lesson',
  templateUrl: './lesson.component.html',
  styleUrls: ['./lesson.component.css']
})
export class LessonComponent  {

  @Input()
  lesson: Lesson;

  constructor() {}

}
