import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';
import { CallService } from './call.service';
import { CallInfoDialogComponents, DialogData } from './dialog/callinfo-dialog.component';

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
  constructor(public dialog: MatDialog, private callService: CallService) {
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
  statusvalues:boolean=false
  public startCall(){
    this.callService.enableCallAnswer()
  }
  ngOnDestroy(): void {
    this.callService.destroyPeer();
  }
  changestats(){
    this.callService.toggleHost().then(res=>this.statusvalues=res)
  }
  public showModal(joinCall: boolean): void {
    let dialogData: DialogData = joinCall ? ({ peerId: null, joinCall: true }) : ({ peerId: this.peerId, joinCall: false });
    const dialogRef = this.dialog.open(CallInfoDialogComponents, {
      width: '250px',
      data: dialogData
    });

    dialogRef.afterClosed()
      .pipe(
        switchMap(peerId => 
          joinCall ? of(this.callService.establishMediaCall(peerId),this.audiostatus=true,this.videostatus=true) : of(this.callService.enableCallAnswer(),this.audiostatus=true,this.videostatus=true)
        ),
      )
      .subscribe(_  => { });
  }
  public endCall() {
    this.callService.closeMediaCall();
this.videostatus=false
this.audiostatus=false
this.camerastatus=false    
  }
}
