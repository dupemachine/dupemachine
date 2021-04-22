import { Component, OnInit, } from '@angular/core';
import { NotificationService } from '../notification.service';
import { SessionService } from '../session.service';
import { take, tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.scss']
})
export class WelcomePageComponent implements OnInit {

  public sidRetrieved: boolean = false;
  public data;

  constructor(
    private notificationService: NotificationService,
    private cameraService: SessionService,
    private router: Router,
  ) { }

  ngOnInit(): void {
  }
  

  /**
   * Initialize the user session.  Use session service to make HTTP call.  Parse response object and store.
   *
   * @memberof WelcomePageComponent
   */
  initializeSession() {
    this.notificationService.showInfo('Please wait...', 'Creating User Session');
    this.cameraService
      .createSession()
      .pipe(
        take(1),
        tap(res => {
          this.data = res;
          this.sidRetrieved = true;
          this.notificationService.showSuccess('Successfully initialized', 'Yay!');
        }),
        catchError((err) => {
          this.notificationService.showError('Unable to Intiailize!', 'Uh Oh!');
          return of(err)
        })
      ).subscribe();
  }


  /**
   * per conditional check in the template, this won't be displayed until sid is retrieved
   *
   * @memberof WelcomePageComponent
   */
  routeToCameras() {
    this.router.navigate(['/camera-display']);
  }

}
