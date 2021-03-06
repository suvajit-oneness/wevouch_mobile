import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { TicketListComponent } from "./component/ticket/ticket-list/ticket-list.component";
import { TicketDetailsComponent } from "./component/ticket/ticket-details/ticket-details.component";
import { TicketAddComponent } from "./component/ticket/ticket-add/ticket-add.component";
import { ProductListComponent } from "./component/product/product-list/product-list.component";
import { ProductAddComponent } from "./component/product/product-add/product-add.component";
import { ProductEditComponent } from "./component/product/product-edit/product-edit.component";
import { SupportComponent } from "./component/support/support.component";
import { ProfileDetailsComponent } from "./component/profile/profile-details/profile-details.component";
import { ProfileEditComponent } from "./component/profile/profile-edit/profile-edit.component";
import { PackageListComponent } from "./component/package/package-list/package-list.component";
import { AddressListComponent } from "./component/address/address-list/address-list.component";
import { AddressAddComponent } from "./component/address/address-add/address-add.component";
import { AddressEditComponent } from "./component/address/address-edit/address-edit.component";
import { SettingsComponent } from "./component/settings/settings.component";
import { LoginComponent } from "./component/auth/login/login.component";
import { RegisterComponent } from "./component/auth/register/register.component";
import { AuthCheckService } from "./service/auth-check.service";


const routes: Routes = [
  { path: '', pathMatch:'full', redirectTo: 'home'},
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: DashboardComponent, canActivate:[AuthCheckService] },
  { path: 'product', canActivate:[AuthCheckService], children: [
    { path: 'list', component: ProductListComponent },
    { path: 'add', component: ProductAddComponent },
    { path: 'edit/:productId', component: ProductEditComponent },
  ]},
  { path: 'address', canActivate:[AuthCheckService], children: [
    { path: 'list', component: AddressListComponent },
    { path: 'add', component: AddressAddComponent },
    { path: 'edit/:addressId', component: AddressEditComponent },
  ]},
  { path: 'ticket', canActivate:[AuthCheckService], children: [
    { path: 'details/:ticketId', component: TicketDetailsComponent },
    { path: 'list', component: TicketListComponent },
    { path: 'add/:productId', component: TicketAddComponent },
    { path: 'add', component: TicketAddComponent },
  ]},
  { path: 'support', canActivate:[AuthCheckService], component: SupportComponent },
  { path: 'profile', canActivate:[AuthCheckService], children: [
    { path: 'details', component: ProfileDetailsComponent },
    { path: 'edit', component: ProfileEditComponent },
  ]},
  { path: 'package', canActivate:[AuthCheckService], children: [
    { path: 'list', component: PackageListComponent },
  ]},
  { path: 'settings', component: SettingsComponent },
  { path: '**', component: DashboardComponent, pathMatch:'full', canActivate:[AuthCheckService] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }