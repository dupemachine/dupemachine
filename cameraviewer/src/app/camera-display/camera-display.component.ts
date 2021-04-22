import { Component, OnInit } from '@angular/core';
import { SessionService } from '../session.service';
import { Router } from '@angular/router';
import { CameraService } from '../camera.service';
import { take, tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-camera-display',
  templateUrl: './camera-display.component.html',
  styleUrls: ['./camera-display.component.scss']
})
export class CameraDisplayComponent implements OnInit {
  public sid;
  public allCams;
  public blobUrl;
  public imageArray = [];
  public delay = ms => new Promise(res => setTimeout(res, ms));

  constructor(
    private sessionService: SessionService,
    private router: Router,
    private cameraService: CameraService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.checkForSid();
  }

  /**
   * do a fetch+check for sid. we could use local storage or <Store> here, but for our purposes a service call is fine.
   * though if you refresh, you do not have the token anymore of course.  Moreover, we should check to make sure we get the sid.
   * This is a rudimentary form of bad navigation prevention, though a route guard would be a more refined approach
   *
   * @memberof CameraDisplayComponent
   */
  async checkForSid() {
    this.sid = await this.sessionService.getSid();
    if (!this.sid) {
      this.router.navigate(['']);
    } else {
      this.fetchAllCameras(this.sid);
    }
  }

  /**
   * call + subscribe to get all cams from camera service. Store the primary stream IDs and name of each cam from the response, as
   * we will use the name on each camera frame display and the prim streamID to get the actual image resource
   * pass all of these to the getFramesForEach function
   * @param {*} sid
   * @memberof CameraDisplayComponent
   */
  fetchAllCameras(sid) {
    this.cameraService.getAllCameras(sid).pipe(
      take(1),
      //takeUntil(this.ngUnsubscribe),
      tap((res: any) => {
        this.allCams = res['cameras'].map(({ primaryStream, name }) => ({primaryStream, name}));
        this.allCams.forEach(i => this.getFramesForEach(i.primaryStream.id, this.sid, i.name))
      }),
      catchError(err => {
        return of(err);
      })
    ).subscribe();
  }
  

  /**
   * get a frame of each camera stream
   * store it as an array of bloburls + names that we can use in the template
   *
   * @param {*} ids
   * @memberof CameraDisplayComponent
   */
  getFramesForEach(id, sid, name) {
    this.cameraService.getStillFrame(id, sid).pipe(
      take(1),
      tap(res => {
        const blob = new Blob([res['body']], {
          type: 'image/jpg'
        });
        this.blobUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob));
        this.imageArray.push({'blobUrl': this.blobUrl, 'name': name});
        if (this.imageArray.length === 16) this.startRefreshTimer();
      }),
      catchError(err => {
        return of(err);
      })
    ).subscribe();
  }

  async startRefreshTimer() {
    await this.delay(5000)
    this.reload(this.router.url);
  }

  async reload(url: string): Promise<boolean> {
    await this.router.navigateByUrl('', { skipLocationChange: true });
    return this.router.navigateByUrl(url);
  }

}
