import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';
import { CallService } from './call.service';

import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  public isCallStarted$: Observable<boolean>;
  private peerId: string;

  @ViewChild('localVideo') localVideo: ElementRef<HTMLVideoElement>;
  @ViewChild('remoteVideo') remoteVideo: ElementRef<HTMLVideoElement>;
  constructor(public dialog: MatDialog, private callService: CallService,private router:Router) {
    this.isCallStarted$ = this.callService.isCallStarted$;
    this.peerId = this.callService.initPeer();
  }
  videoToggle(){
     this.callService.toggleVideo().then((res)=>
    this.videostatus=res
    )
    
  }
  audiostatus:boolean
  videostatus:boolean
  camerastatus:boolean
  localpeerid:boolean=localStorage.getItem('peerid')?true:false
    audioToggle(){
    this.callService.toggleAudio().then((res)=>
    this.audiostatus=res
    )
    
  }
  cameraToggle(){
    if(this.videostatus){
    this.callService.toggleCamera().then((res)=>
    this.camerastatus=res
    )  
    }
    
    
  }
  ngOnInit(): void {
    this.callService.localStream$
      .pipe(filter(res => !!res))
      .subscribe(stream => this.localVideo.nativeElement.srcObject = stream)
    this.callService.remoteStream$
      .pipe(filter(res => !!res))
      .subscribe(stream => this.remoteVideo.nativeElement.srcObject = stream)
      
  }
  
  public startCall(){
    this.callService.enableCallAnswer()
  }
  ngOnDestroy(): void {
    this.callService.destroyPeer();
  }
  public showModal(joinCall: boolean): void {
    
        if(!joinCall){localStorage.setItem('peerid',this.peerId)}
        
          joinCall ? of(this.callService.establishMediaCall(localStorage.getItem('peerid')),this.audiostatus=true,this.videostatus=true) : of(this.callService.enableCallAnswer(),this.audiostatus=true,this.videostatus=true)
    
  }
  public endCall() {
    if(this.hasRoute('/expert')){localStorage.removeItem('peerid')}
    else {location.reload()}
    this.callService.closeMediaCall();
this.videostatus=false
this.audiostatus=false
this.camerastatus=false    
  }
  hasRoute(route:string){
    return this.router.url===route
  }
}
