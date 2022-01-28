import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import Peer from 'peerjs';
import { BehaviorSubject, Subject } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { Router } from '@angular/router';
var videostatus=false
var audiostatus=false
var camerastatus=false
  
@Injectable()
export class CallService {

    private peer: Peer;
    private mediaCall: Peer.MediaConnection;
    public connection$
    private localStreamBs: BehaviorSubject<MediaStream> = new BehaviorSubject(null);
    public localStream$ = this.localStreamBs.asObservable();
    private remoteStreamBs: BehaviorSubject<MediaStream> = new BehaviorSubject(null);
    public remoteStream$ = this.remoteStreamBs.asObservable();
    public datavalues
    private isCallStartedBs = new Subject<boolean>();
    public isCallStarted$ = this.isCallStartedBs.asObservable();
    private dataval=new Subject<any>()
    public dataval$=this.dataval.asObservable()
    constructor(private snackBar: MatSnackBar,private router:Router) {
        
     }
hasRoute(route:string){
    return this.router.url===route
  }

  public initPeer() {
        console.log('initpeer')
        if (!this.peer || this.peer.disconnected) {
            const peerJsOptions: Peer.PeerJSOption = {
                debug: 3,
                config: {
                    iceServers: [
                        {
                            urls: [
                                'stun:stun1.l.google.com:19302',
                                'stun:stun2.l.google.com:19302',
                            ],
                        }]
                }
            };
            try {
                let id:string = uuidv4();
                
                this.peer = new Peer(id, peerJsOptions);
                this.peer.on('connection',(con)=>{
                    con.on('data',(data)=>{
                    this.dataval.next(data)
                    })
                })
                return id
            } catch (error) {
                console.error(error);
            }
        }
    }
public senddatavalue(msg){
    
    this.connection$.send(msg)
    this.connection$.on('data',(data)=>{
        this.dataval.next(data)
    })
    // this.peer.on('connection',(con)=>{
    //     con.on('data',(data)=>{
    //     this.dataval.next(data)
    //     })
    // })
}
public async establishMediaCall(remotePeerId: string) {
    try {
        videostatus=true
        audiostatus=true
        const stream = await navigator.mediaDevices.getUserMedia({ video:videostatus?
            { facingMode: camerastatus?{exact:"environment"}:"user" }:videostatus
            , audio: audiostatus });
        console.log('establishMediaCall')
        const connection = this.peer.connect(remotePeerId);
        this.connection$=connection
        // connection.on('open',()=>{
        //     connection.send('values')
        // })
        connection.on('error', err => {
            console.error(err);
            this.snackBar.open(err, 'Close',{
                duration:1000
            });
        });

        this.mediaCall = this.peer.call(remotePeerId, stream);
        if (!this.mediaCall) {
            let errorMessage = 'Unable to connect to remote peer';
            this.snackBar.open(errorMessage, 'Close',{
        duration:1000
    });
            throw new Error(errorMessage);
        }
        this.localStreamBs.next(stream);
        this.isCallStartedBs.next(true);
        this.mediaCall.on('stream',
            (remoteStream) => {
                this.remoteStreamBs.next(remoteStream);
            });
        this.mediaCall.on('error', err => {
            this.snackBar.open(err, 'Close',{
        duration:1000
    });
            console.error(err);
            this.isCallStartedBs.next(false);
        });
        this.mediaCall.on('close', () => this.onCallClose());
    }
    catch (ex) {
        console.error(ex);
        this.snackBar.open(ex, 'Close',{
        duration:1000
    });
        this.isCallStartedBs.next(false);
    }
}
    
public async toggleVideo() {
    console.log('object',videostatus)
        try {
            if(videostatus){
                videostatus=false
            }
            else videostatus=true
            if(videostatus===false&&audiostatus===false){
             this.localStreamBs?.value.getTracks().forEach(track => {
            track.stop();
        });
            }
            else
            {
                
            const stream = await navigator.mediaDevices.getUserMedia({ video:this.hasRoute('/expert')?false: videostatus?
                { facingMode: camerastatus?{exact:"environment"}:"user" }:videostatus, audio: audiostatus });
            this.localStreamBs.next(stream);
            this.peer.on('call', async (call) => {
    
                this.mediaCall = call;
                this.isCallStartedBs.next(true);
    
                this.mediaCall.answer(stream);
                this.mediaCall.on('stream', (remoteStream) => {
                    this.remoteStreamBs.next(remoteStream);
                });
                this.mediaCall.on('error', err => {
                    this.snackBar.open(err, 'Close',{
            duration:1000
        });
                    this.isCallStartedBs.next(false);
                    console.error(err);
                });
                this.mediaCall.on('close', () => this.onCallClose());
            });}   
            return videostatus         
        }
        catch (ex) {
            console.error(ex);
            this.snackBar.open(ex, 'Close',{
            duration:1000
        });
            this.isCallStartedBs.next(false);            
        }
    }
    
    public async toggleCamera() {
        try {
            if(camerastatus){
                camerastatus=false
            }
            else camerastatus=true
            if(videostatus===false&&audiostatus===false){
             this.localStreamBs?.value.getTracks().forEach(track => {
            track.stop();
        });
            }
            else
            {
                

            const stream = await navigator.mediaDevices.getUserMedia({ 
                video:this.hasRoute('/expert')?false: videostatus?
                { facingMode: camerastatus?{exact:"environment"}:"user" }:videostatus
                , audio: audiostatus });
            this.localStreamBs.next(stream);
            this.peer.on('call', async (call) => {
    
                this.mediaCall = call;
                this.isCallStartedBs.next(true);
    
                this.mediaCall.answer(stream);
                this.mediaCall.on('stream', (remoteStream) => {
                    this.remoteStreamBs.next(remoteStream);
                });
                this.mediaCall.on('error', err => {
                    this.snackBar.open(err, 'Close',{
            duration:1000
        });
                    this.isCallStartedBs.next(false);
                    console.error(err);
                });
                this.mediaCall.on('close', () => this.onCallClose());
            });}   
            return camerastatus        
        }
        catch (ex) {
            console.error(ex);
            camerastatus=false
            this.snackBar.open(`You Don't have a rear camera in your device`, 'Close',{
            duration:1000
        });
            // this.isCallStartedBs.next(false);            
        }
    }
    public async toggleAudio() {
        console.log('a',audiostatus)
        try {
            if(audiostatus){
                audiostatus=false
            }
            else audiostatus=true
            if(videostatus===false&&audiostatus===false){
             this.localStreamBs?.value.getTracks().forEach(track => {
            track.stop();
        });
            }
            else{
                
                const stream = await navigator.mediaDevices.getUserMedia({ video:this.hasRoute('/expert')?false: videostatus?
                { facingMode: camerastatus?{exact:"environment"}:"user" }:videostatus, audio: audiostatus });
            this.localStreamBs.next(stream);
            this.peer.on('call', async (call) => {
    
                this.mediaCall = call;
                this.isCallStartedBs.next(true);
    
                this.mediaCall.answer(stream);
                this.mediaCall.on('stream', (remoteStream) => {
                    this.remoteStreamBs.next(remoteStream);
                });
                this.mediaCall.on('error', err => {
                    this.snackBar.open(err, 'Close',{
            duration:1000
        });
                    this.isCallStartedBs.next(false);
                    console.error(err);
                });
                this.mediaCall.on('close', () => this.onCallClose());
            });}            
            return audiostatus
        }
        catch (ex) {
            console.error(ex);
            this.snackBar.open(ex, 'Close',{
            duration:1000
        });
            this.isCallStartedBs.next(false);            
            
        }
    }
    public async enableCallAnswer() {
        console.log('enableCallAnswer')
        try {
            audiostatus=true
            videostatus=true
            const stream = await navigator.mediaDevices.getUserMedia({ video: videostatus?
                { facingMode: camerastatus?{exact:"environment"}:"user" }:videostatus, audio: audiostatus });
            this.localStreamBs.next(stream);
            this.peer.on('call', async (call) => {
                
                this.mediaCall = call;
                this.isCallStartedBs.next(true);
    
                this.mediaCall.answer(stream);
                this.mediaCall.on('stream', (remoteStream) => {
                    this.remoteStreamBs.next(remoteStream);
                });
                this.mediaCall.on('error', err => {
                    this.snackBar.open(err, 'Close',{
            duration:1000
        });
                    this.isCallStartedBs.next(false);
                    console.error(err);
                });
                this.mediaCall.on('close', () => this.onCallClose());
            });            
        }
        catch (ex) {
            console.error(ex);
            this.snackBar.open(ex, 'Close',{
            duration:1000
        });
            this.isCallStartedBs.next(false);            
        }
    }

    private onCallClose() {
        
        console.log('onCallClose')
        videostatus=false
        audiostatus=false
        camerastatus=false
        this.remoteStreamBs?.value.getTracks().forEach(track => {
            track.stop();
        });
        this.localStreamBs?.value.getTracks().forEach(track => {
            track.stop();
        });
        this.snackBar.open('Call Ended', 'Close',{
            duration:1000
        });
    }

    public closeMediaCall() {
        this.localStreamBs?.value.getTracks().forEach(track => {
            track.stop();})
        console.log('closeMediaCall')
        this.mediaCall?.close();
        if (!this.mediaCall) {
            this.onCallClose()
        }
        this.isCallStartedBs.next(false);
    }

    public destroyPeer() {
        videostatus=false
        audiostatus=false
        camerastatus=false
        
        console.log('destroypeer')
        this.mediaCall?.close();
        this.peer?.disconnect();
        this.peer?.destroy();
    }

}