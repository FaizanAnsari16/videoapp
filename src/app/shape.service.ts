import { Injectable } from '@angular/core';
import { Shape } from './shape';

@Injectable()
export class ShapeService {

  private shapes:Shape[]=[
    {type:'ellipse', x:0, y:0, w:0, h:0},
    {type:'line', x:0, y:0, w:0, h:0},
    {type:'rectangle', x:0, y:0, w:0, h:0},
    {type:'canvas',x:0,y:0,w:0,h:0}
  ];
  getShapes(){return this.shapes;}
}