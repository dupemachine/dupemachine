import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

const serviceRoute = 'https://orchid.ipconfigure.com/service/'

@Injectable({
  providedIn: 'root'
})
export class CameraService {
  public cameras;

  constructor(
    private http: HttpClient
  ) { }

  /**
   * fetch cameras
   *
   * @memberof CameraService
   */
  getAllCameras(sid) {
    const cameraRoute = serviceRoute + 'cameras/?sid=' + sid;
    return this.http.get(cameraRoute).pipe(
      map(res => res),
      catchError(err => err)
    );
  }


  /**
   * get a single frame from a camera as an arraybuffer object
   *
   * @param {*} streamId
   * @param {*} sid
   * @return {*} 
   * @memberof CameraService
   */
  getStillFrame(streamId, sid) {
    const streamFrameRoute = serviceRoute + `streams/${streamId}/frame?sid=${sid}&fallback=true&time=0&width=400&height=400`
    return this.http.get(streamFrameRoute,
      { responseType: 'arraybuffer', observe: 'response' }).pipe(
        catchError(err => err)
      );
  }

}
