import { Routes } from '@angular/router';
import { DashboardsComponent } from './pages/dashboards/dashboards.component';

export const routes: Routes = [
    {
        path: ':name',
        component: DashboardsComponent,
    },
];
