import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuorumComponent } from './quorum/quorum.component';

const routes: Routes = [{ path: '', component: QuorumComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuorumRoutingModule {}
