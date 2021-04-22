import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  public storedId;

  constructor(
    private http: HttpClient
  ) { }

  private postCreatSessionUrl = 'https://orchid.ipconfigure.com/service/sessions/user'

  /**
   * 
   * Create a new user session by POSTing /service/sessions/user with credentials liveviewer/tpain.
   * store the ID here, and use elsewhere in the app like camera-display component.
   * ID will be necessary param as our auth for most API calls per documentation
   * @param user supplied username by IPC
   * @param password supplied password by IPC
   */
  createSession() {
    let user = 'liveviewer';
    let password = 'tpain';
    
    return this.http.post(this.postCreatSessionUrl, {
      "username": user,
      "password": password,
      "expiresIn": 350000,
      "cookie": "session"
    }).pipe(
      tap(res => {
        this.storedId = res['id'];
      }),
      catchError(err => err)
    );
  }

  getSid() {
    return this.storedId;
  }
}
