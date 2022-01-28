import { Component, OnInit, Input, OnDestroy,ElementRef,ViewChild } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { MatDialog } from '@angular/material/dialog';
import { interval, Observable, of,Subscription,fromEvent } from 'rxjs';
import { filter, tap, concatMap, mergeMap, takeUntil } from "rxjs/operators";
import { CallService } from '../call.service';
import { Shape } from '../shape';
import { Router } from '@angular/router';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit,OnDestroy {
  public isCallStarted$: Observable<boolean>;
  private peerId:string
  public sendingdata:Observable<any>
  name = "Angular";
  @ViewChild('localVideo') localVideo: ElementRef<HTMLVideoElement>;
    @ViewChild('remoteVideo') remoteVideo: ElementRef<HTMLVideoElement>;
    @Input() shapesToDraw: Shape[];
    mySubscription: Subscription
    constructor( private el: ElementRef,
    public dialog: MatDialog,
    private callService: CallService,
  
    private router: Router) {
      // if(this.shapeType==='pointer'){this.mySubscription=interval(1000).subscribe((x)=>this.sendData(this.shapesToDraw))}
      this.isCallStarted$ = this.callService.isCallStarted$;
      this.peerId = this.callService.initPeer()
      this.sendingdata=this.callService.dataval$
      this.sendingdata.subscribe((data)=>{        
        this.shapesToDraw=data
      })
     }
  
  shapeType = '';
  setType(type: string) { 
    
    this.shapeType = type; }

  @Input() currentShape: Subject<Shape>;

  videoToggle() {
    this.callService.toggleVideo().then((res) => (this.videostatus = res));
  }
  audiostatus: boolean;
  hoverstatus: boolean = false;
  videostatus: boolean;
  camerastatus: boolean;
  localpeerid: boolean = localStorage.getItem('peerid') ? true : false;
  
  audioToggle() {
    this.callService.toggleAudio().then((res) => (this.audiostatus = res));
  }
  cameraToggle() {
    if (this.videostatus) {
      this.callService.toggleCamera().then((res) => (this.camerastatus = res));
    }
  }
  ngOnInit(): void {
    this.callService.localStream$
      .pipe(filter((res) => !!res))
      .subscribe(
        (stream) => (this.localVideo.nativeElement.srcObject = stream)
      );
    this.callService.remoteStream$
      .pipe(filter((res) => !!res))
      .subscribe(
        (stream) => (this.remoteVideo.nativeElement.srcObject = stream)
      );
  }


  ngOnDestroy(): void {
    this.callService.destroyPeer();
  }
  public showModal(joinCall: boolean): void {
    if (!joinCall) {
      localStorage.setItem('peerid', this.peerId);
    }

    joinCall
      ? of(
          this.callService.establishMediaCall(localStorage.getItem('peerid')),
          (this.audiostatus = true),
          (this.videostatus = true)
        )
      : of(
          this.callService.enableCallAnswer(),
          (this.audiostatus = true),
          (this.videostatus = true)
        );
  }
  public endCall() {
    if (this.hasRoute('/user')) {
      localStorage.removeItem('peerid');
    } else {
      location.reload();
    }
    this.callService.closeMediaCall();
    this.videostatus = false;
    this.audiostatus = false;
    this.camerastatus = false;
  }
  hasRoute(route: string) {
    return this.router.url === route;
  }
  changehoverstatus() {
    this.hoverstatus = !this.hoverstatus;
  }
  

  // the shape being just drawn
  createdShape: Shape;

  

 buttoncnt=false
  keepDrawing(evt: MouseEvent) {
    if(this.shapeType==='pointer'){
      this.createdShape = {
        type: this.shapeType,
        x: evt.offsetX,
        y: evt.offsetY,
        w: 0,
        h: 0
      };
      if(this.shapesToDraw.filter((i)=>i.type==='pointer').length>0)
      {
     this.shapesToDraw[this.shapesToDraw.findIndex((i)=>i.type)]=this.createdShape
    }
    else
      this.shapesToDraw.push(this.createdShape)
      this.callService.senddatavalue(this.shapesToDraw)
    }

else
    {if (this.createdShape) {
      this.currentShape.next(this.createdShape);
      this.createdShape.w = evt.offsetX - this.createdShape.x;
      this.createdShape.h = evt.offsetY - this.createdShape.y;
      // console.log('first',this.currentShape);
    }
    if(evt.buttons===1){
      this.buttoncnt=true      
          }
          if(this.buttoncnt&&evt.buttons===0){
            this.sendData(this.shapesToDraw)
            this.buttoncnt=false
          }
  }
    
    
    // this.sendData(this.createdShape) 
  }
  startDrawing(evt: MouseEvent) {
    if(this.shapeType!=='pointer'){this.createdShape = {
      type: this.shapeType,
      x: evt.offsetX,
      y: evt.offsetY,
      w: 0,
      h: 0
    };
      this.shapesToDraw.push(this.createdShape);}}
    // this.sendData(this.shapesToDraw);
  
  stopDrawing(evt: MouseEvent) {
    this.createdShape = null;
  }
sendData(msg){
  this.callService.senddatavalue(msg)
}

}