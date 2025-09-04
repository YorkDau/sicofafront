import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { SharedModule } from "src/app/shared/shared.module";
import { InvolucradoComponent } from "./involucrado.component";

@NgModule({
  declarations: [InvolucradoComponent],
  imports: [CommonModule, SharedModule],
  exports: [InvolucradoComponent],
})
export class InvolucradoModule { }
