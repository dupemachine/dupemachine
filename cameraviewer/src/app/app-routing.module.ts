import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';
import { CameraDisplayComponent } from './camera-display/camera-display.component';

const routes: Routes = [
  {
    path: 'welcome-page',
    component: WelcomePageComponent
  },
  {
    path: '',
    redirectTo: '/welcome-page',
    pathMatch: 'full'
  },
  {
    path: 'camera-display',
    component: CameraDisplayComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
