import { Injectable } from '@angular/core';

@Injectable()
export class StatusService {
userstatus?:string
  constructor() { }
  public statuscheck(val){
this.userstatus=val
  }
  public getstatus(){
    return this.userstatus
  }
}
