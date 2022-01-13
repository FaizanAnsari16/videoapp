import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import Peer from 'peerjs';
import { BehaviorSubject, Subject } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
var videostatus=false
var audiostatus=false
var camerastatus=false
var host=false
@Injectable()
export class CallService {

    private peer: Peer;
    private mediaCall: Peer.MediaConnection;
  
    private localStreamBs: BehaviorSubject<MediaStream> = new BehaviorSubject(null);
    public localStream$ = this.localStreamBs.asObservable();
    private remoteStreamBs: BehaviorSubject<MediaStream> = new BehaviorSubject(null);
    public remoteStream$ = this.remoteStreamBs.asObservable();

    private isCallStartedBs = new Subject<boolean>();
    public isCallStarted$ = this.isCallStartedBs.asObservable();

    constructor(private snackBar: MatSnackBar) { }

    public initPeer(): string {
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
                let id = uuidv4();
                this.peer = new Peer(id, peerJsOptions);
                return id;
            } catch (error) {
                console.error(error);
            }
        }
    }

    public async establishMediaCall(remotePeerId: string) {
        try {
            if(host){
                videostatus=false
            }
            else {videostatus=true}
            audiostatus=true
            const stream = await navigator.mediaDevices.getUserMedia({ video: videostatus, audio: audiostatus });
            console.log('establishMediaCall')
            const connection = this.peer.connect(remotePeerId);
            connection.on('error', err => {
                console.error(err);
                this.snackBar.open(err, 'Close');
            });

            this.mediaCall = this.peer.call(remotePeerId, stream);
            if (!this.mediaCall) {
                let errorMessage = 'Unable to connect to remote peer';
                this.snackBar.open(errorMessage, 'Close');
                throw new Error(errorMessage);
            }
            this.localStreamBs.next(stream);
            this.isCallStartedBs.next(true);
            this.mediaCall.on('stream',
                (remoteStream) => {
                    this.remoteStreamBs.next(remoteStream);
                });
            this.mediaCall.on('error', err => {
                this.snackBar.open(err, 'Close');
                console.error(err);
                this.isCallStartedBs.next(false);
            });
            this.mediaCall.on('close', () => this.onCallClose());
        }
        catch (ex) {
            console.error(ex);
            this.snackBar.open(ex, 'Close');
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
                if(host){videostatus=false}
            const stream = await navigator.mediaDevices.getUserMedia({ video:videostatus, audio: audiostatus });
            this.localStreamBs.next(stream);
            this.peer.on('call', async (call) => {
    
                this.mediaCall = call;
                this.isCallStartedBs.next(true);
    
                this.mediaCall.answer(stream);
                this.mediaCall.on('stream', (remoteStream) => {
                    this.remoteStreamBs.next(remoteStream);
                });
                this.mediaCall.on('error', err => {
                    this.snackBar.open(err, 'Close');
                    this.isCallStartedBs.next(false);
                    console.error(err);
                });
                this.mediaCall.on('close', () => this.onCallClose());
            });}   
            return videostatus         
        }
        catch (ex) {
            console.error(ex);
            this.snackBar.open(ex, 'Close');
            this.isCallStartedBs.next(false);            
        }
    }
    public async toggleHost(){
        host=!host
        return host
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
                if(host){videostatus=false}

            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: camerastatus?{exact:"environment"}:"user" }, audio: audiostatus });
            this.localStreamBs.next(stream);
            this.peer.on('call', async (call) => {
    
                this.mediaCall = call;
                this.isCallStartedBs.next(true);
    
                this.mediaCall.answer(stream);
                this.mediaCall.on('stream', (remoteStream) => {
                    this.remoteStreamBs.next(remoteStream);
                });
                this.mediaCall.on('error', err => {
                    this.snackBar.open(err, 'Close');
                    this.isCallStartedBs.next(false);
                    console.error(err);
                });
                this.mediaCall.on('close', () => this.onCallClose());
            });}   
            return videostatus         
        }
        catch (ex) {
            console.error(ex);
            camerastatus=false
            this.snackBar.open(`You Don't have a rear camera in your device`, 'Close');
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
                if(host){videostatus=false}
                const stream = await navigator.mediaDevices.getUserMedia({ video:videostatus, audio: audiostatus });
            this.localStreamBs.next(stream);
            this.peer.on('call', async (call) => {
    
                this.mediaCall = call;
                this.isCallStartedBs.next(true);
    
                this.mediaCall.answer(stream);
                this.mediaCall.on('stream', (remoteStream) => {
                    this.remoteStreamBs.next(remoteStream);
                });
                this.mediaCall.on('error', err => {
                    this.snackBar.open(err, 'Close');
                    this.isCallStartedBs.next(false);
                    console.error(err);
                });
                this.mediaCall.on('close', () => this.onCallClose());
            });}            
            return audiostatus
        }
        catch (ex) {
            console.error(ex);
            this.snackBar.open(ex, 'Close');
            this.isCallStartedBs.next(false);            
            
        }
    }
    public async enableCallAnswer() {
        console.log('enableCallAnswer')
        try {
            if(host){
                videostatus=false
            }
            audiostatus=true
            const stream = await navigator.mediaDevices.getUserMedia({ video: videostatus, audio: audiostatus });
            this.localStreamBs.next(stream);
            this.peer.on('call', async (call) => {
    
                this.mediaCall = call;
                this.isCallStartedBs.next(true);
    
                this.mediaCall.answer(stream);
                this.mediaCall.on('stream', (remoteStream) => {
                    this.remoteStreamBs.next(remoteStream);
                });
                this.mediaCall.on('error', err => {
                    this.snackBar.open(err, 'Close');
                    this.isCallStartedBs.next(false);
                    console.error(err);
                });
                this.mediaCall.on('close', () => this.onCallClose());
            });            
        }
        catch (ex) {
            console.error(ex);
            this.snackBar.open(ex, 'Close');
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
        this.snackBar.open('Call Ended', 'Close');
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