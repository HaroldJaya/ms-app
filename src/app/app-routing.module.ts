import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DisplayMediaComponent } from './components/display-media/display-media.component';

export const DISPLAY_ROUTE = "display-media";

const routes: Routes = [
  {
    path: DISPLAY_ROUTE, component: DisplayMediaComponent
  },
  {
    path: "**", redirectTo: "display-media"
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
