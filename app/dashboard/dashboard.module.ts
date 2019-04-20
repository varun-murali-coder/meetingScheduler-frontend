import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { RouterModule, Routes } from '@angular/router';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { DlDateTimeDateModule, DlDateTimePickerModule } from 'angular-bootstrap-datetimepicker';
import { DashServiceService } from '../dash-service.service';
import { DetailsComponent } from './details/details.component';
import { SharedModule } from '../shared/shared.module';
import { AdminsControlComponent } from './admins-control/admins-control.component';
import { SocketService } from '../socket.service';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ServerInternalErrorComponent } from './server-internal-error/server-internal-error.component';





@NgModule({
  declarations: [AdminDashboardComponent, UserDashboardComponent, DetailsComponent, AdminsControlComponent, PageNotFoundComponent, ServerInternalErrorComponent],
  imports: [
    CommonModule,
    FormsModule,
    BrowserAnimationsModule,
    SharedModule,
    ToastrModule.forRoot(),
    DlDateTimeDateModule,  // <--- Determines the data type of the model
    DlDateTimePickerModule,
    RouterModule.forChild([
      { path: 'user-dashboard', component: UserDashboardComponent },
      { path: 'admin-dashboard', component: AdminDashboardComponent },
      { path: 'details', component: DetailsComponent },
      {path:'admin-control/:userId',component:AdminsControlComponent},
      { path: '404', component: PageNotFoundComponent },
      { path: '500', component: ServerInternalErrorComponent },



      

    ]),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    })
  ],
  providers:[DashServiceService,SocketService]
})
export class DashboardModule { }
