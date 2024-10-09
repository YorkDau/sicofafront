import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuorumRoutingModule } from './quorum-routing.module';
import { SharedModule } from '../../../shared/shared.module';
import { QuorumComponent } from './quorum/quorum.component';

@NgModule({
  declarations: [QuorumComponent],
  imports: [CommonModule, QuorumRoutingModule, SharedModule],
})
export class QuorumModule {}
