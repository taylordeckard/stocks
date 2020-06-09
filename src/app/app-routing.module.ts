import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { StatsModule } from './stats/stats.module';

const routes = [
  {
    path: 'stats',
    loadChildren: () => StatsModule,
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'stats',
  }
];

@NgModule({
  exports: [RouterModule],
  imports: [
    RouterModule.forRoot(routes),
  ],
})
export class AppRoutingModule { }
