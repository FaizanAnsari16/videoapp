import { Component, OnInit, Input, OnDestroy, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
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
export class CanvasComponent implements OnInit,OnDestroy,AfterViewInit {
  public isCallStarted$: Observable<boolean>;
  private peerId: string;
  name = "Angular";
  @ViewChild('localVideo') localVideo: ElementRef<HTMLVideoElement>;
    @ViewChild('remoteVideo') remoteVideo: ElementRef<HTMLVideoElement>;
  constructor( private el: ElementRef,
    public dialog: MatDialog,
    private callService: CallService,
    private router: Router) {
      this.isCallStarted$ = this.callService.isCallStarted$;
      this.peerId = this.callService.initPeer();
     }
  @Input() shapesToDraw: Shape[];
  shapeType = '';
  setType(type: string) { 
    this.hoverstatus=false
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
        (stream) => (this.localVideo.nativeElement.srcObject = stream,console.log('a'))
      );
    this.callService.remoteStream$
      .pipe(filter((res) => !!res))
      .subscribe(
        (stream) => (this.remoteVideo.nativeElement.srcObject = stream)
      );
  }

  public startCall() {
    this.callService.enableCallAnswer();
  }
ngAfterViewInit() {
  console.log('aa',this.remoteVideo.nativeElement.videoWidth)
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
    if (this.hasRoute('/expert')) {
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
    if(!this.hoverstatus){
      this.setType('')
    }
    this.hoverstatus = !this.hoverstatus;
    
  }
  

  // the shape being just drawn
  createdShape: Shape;

  startDrawing(evt: MouseEvent) {
    this.createdShape = {
      type: this.shapeType,
      x: evt.offsetX,
      y: evt.offsetY,
      w: 0,
      h: 0
    };
    this.shapesToDraw.push(this.createdShape);
  }w


  keepDrawing(evt: MouseEvent) {
    if (this.createdShape) {
      this.currentShape.next(this.createdShape);
      this.createdShape.w = evt.offsetX - this.createdShape.x;
      this.createdShape.h = evt.offsetY - this.createdShape.y;
    }
  }

  stopDrawing(evt: MouseEvent) {
    this.createdShape = null;
  }

}