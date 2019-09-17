import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { AuthComponent } from './auth/auth.component';
import { UsersComponent } from './users/users.component';
import { Role } from './auth/shared/role.enum';
import { AuthGuard } from './auth/shared/auth.guard';
import { MapComponent } from './map/map.component';
import { DetailComponent } from './actual-situation/detail/detail.component';
import { Bikecounter } from './actual-situation/shared/bikecounter';
import { MapOverviewComponent } from './map/map-overview/map-overview.component';
import { LocalitiesComponent } from './localities/localities.component';
import { LocalityDetailComponent } from './localities/locality-detail/locality-detail.component';
import { SensorsSettingComponent } from './sensors-setting/sensors-setting.component';
import { UserComponent } from './users/user/user.component';
import { LogoutComponent } from './users/logout/logout.component';



const routes: Routes = [
    { path: '', redirectTo: '/main', pathMatch: 'full' },
    { path: 'main', component: MainComponent },
    { path: 'auth', component: AuthComponent },
    { path: 'map', component: MapOverviewComponent },
    { path: 'detail/:id', component: DetailComponent, canActivate: [AuthGuard], data: { bikecounter: Bikecounter} },
    { path: 'users', component: UsersComponent, canActivate: [AuthGuard],  data: { roles: [Role.admin] } },
    { path: 'logout', component: LogoutComponent, canActivate: [AuthGuard] },
    { path: 'user', component: UserComponent, canActivate: [AuthGuard] },
    { path: 'sensors', component: SensorsSettingComponent, canActivate: [AuthGuard],  data: { roles: [Role.admin, Role.service] } },
    { path: 'localities', component: LocalitiesComponent },
    { path: 'locality/:id', component: LocalityDetailComponent, canActivate: [AuthGuard], },
    { path: '**', redirectTo: '/main', pathMatch: 'full' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
