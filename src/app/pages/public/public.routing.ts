import { Routes } from "@angular/router";
import { CitaComponent } from "./cita/cita.component";
import { ComisariaComponent } from "./comisaria/comisaria.component";


export const mainRoutes: Routes = [

    { path: 'comisaria', component: ComisariaComponent },
    { path: 'cita', component: CitaComponent }

]
