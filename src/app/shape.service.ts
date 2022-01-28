import { Injectable } from '@angular/core';
import { Shape } from './shape';

@Injectable()
export class ShapeService {

  private shapes:Shape[]=[
   
  ];
  getShapes(){return this.shapes;}
}