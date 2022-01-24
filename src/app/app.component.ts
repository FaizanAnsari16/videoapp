import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { interval, Observable, of,Subscription,fromEvent } from 'rxjs';
import { filter, tap, concatMap, mergeMap, takeUntil } from "rxjs/operators";
import { CallService } from './call.service';
import { BehaviorSubject } from 'rxjs';
import 'rxjs/add/operator/map';
import { Shape } from './shape';
import { ShapeService } from './shape.service';

import { Router,ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit{
  constructor(private shapeService: ShapeService,
    private route: ActivatedRoute,
    private router: Router) { }

  title: string = 'Shape editor';
  shapes: Shape[];
  currentShape = new BehaviorSubject<Shape>(null);

  findShape=(x) => x < 0 ? 1 : x + 1;

  ngOnInit() {
    // invoke the shape service
    this.shapes = this.shapeService.getShapes();
}
}
