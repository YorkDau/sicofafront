import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { AuthGuard } from './guards/auth.guard';
import { ReportesPdfComponent } from './shared/reportes-pdf/reportes-pdf.component';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => 
      import('./auth/auth.module').then((m) => m.AuthModule)
  },  
  {
    path: 'public',
    loadChildren: () =>
      import('./pages/public/public.module').then((pb) => pb.PublicModule),
  },
  {
    path: 'reportes/:tipoReporte/:idSolicitud',
    component: ReportesPdfComponent,
  },
  {
    path: '',
    loadChildren: () =>
      import('./pages/private/private.module').then((pr) => pr.PrivateModule),
    canLoad: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
