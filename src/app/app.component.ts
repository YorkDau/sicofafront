import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { forkJoin } from 'rxjs';
import { AuthService } from './auth/services/auth.service';
import { SharedService } from './services/shared.service';
import { AppState } from './store/app.reducer';
import * as privateActions from './store/private/actions/private.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'CO_1030_COMISARIA';

  constructor(
    private sharedService: SharedService,
    private authService: AuthService,
    private store: Store<AppState>
  ) {
    this.cargarDominios();
  }

  ngOnInit(): void {}

  /**
   * @description llama servicio dominios, llena state con los mismos
   */
  cargarDominios() {
    forkJoin([
      this.sharedService.getDominio('Genero'),
      this.sharedService.getDominio('Tipo_identificacion'),
      this.sharedService.getDominio('Estado_Tarea'),
      this.sharedService.getDominio('PRESOL_DENUNS'),
      this.sharedService.getDepartamentos(1),
    ]).subscribe(({ 0: gen, 1: tipoD, 2: tarea, 3: tipoE, 4: depto }) => {
      this.store.dispatch(privateActions.setListaGenero({ genero: gen.data }));
      this.store.dispatch(
        privateActions.setListaTipoDocumento({ tipo_documento: tipoD.data })
      );
      this.store.dispatch(
        privateActions.setListaEstadoTarea({ tarea: tarea.data })
      );
      this.store.dispatch(
        privateActions.setListaListaTipoEntidad({ tipo_entidad: tipoE.data })
      );
      this.store.dispatch(
        privateActions.setDepartamento({ departamento: depto.data })
      );
    });
  }
}
