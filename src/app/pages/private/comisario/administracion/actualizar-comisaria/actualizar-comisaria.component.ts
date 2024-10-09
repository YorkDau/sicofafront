import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CodigosRespuesta, Mensajes, Regex } from 'src/app/constants';
import { ResponseInterface } from 'src/app/interfaces/response.interface';
import { Modales } from '../../../../../shared/modals';
import { ComisariaInterface } from '../interfaces/actualizacion-comisaria.interface';
import { ComisariaService } from '../services/comisaria.service';

@Component({
  selector: 'app-actualizar-comisaria',
  templateUrl: './actualizar-comisaria.component.html',
  styleUrls: ['./actualizar-comisaria.component.scss'],
})
export class ActualizarComisariaComponent implements OnInit {
  form = new FormGroup({
    idComisaria: new FormControl(''),
    nombreComisaria: new FormControl('', Validators.required),
    telefono: new FormControl('', Validators.required),
    direccion: new FormControl('', Validators.required),
    correo: new FormControl('', Validators.required),
    idCiudadMunicipio: new FormControl(''),
    modalidad: new FormControl(''),
    naturaleza: new FormControl(''),
  });

  constructor(
    private comisariaService: ComisariaService,
    private modales: Modales
  ) {}

  ngOnInit(): void {
    this.cargarInformacionComisaria();
  }

  private cargarInformacionComisaria() {
    this.comisariaService.getInformacionComisaria().subscribe({
      next: (data: ResponseInterface) => {
        if (data.statusCode === CodigosRespuesta.OK) {
          const comisaria: ComisariaInterface = data.data;
          this.form.setValue(comisaria);
        }
      },
      error: () => {
        this.modales.modalInformacion(Mensajes.MENSAJE_ERROR_G);
      },
    });
  }

  actualizarComisaria() {
    if (this.form.valid) {
      this.modales
        .modalConfirmacion(
          'Estás a punto de actualizar la información de esta comisaría. Esta información se cambiará para todos los usuarios de la comisaría. ¿Estás seguro?'
        )
        .subscribe((confirmacion) => {
          if (confirmacion) {
            this.comisariaService
              .postActualizarComisaria(this.form.value)
              .subscribe((result) => {
                if (result && result.statusCode == CodigosRespuesta.OK) {
                  this.cargarInformacionComisaria();
                  this.modales.modalExito('Comisaría actualizada exitosamente');
                }
              });
          }
        });
    } else {
      this.modales.modalInformacion('Todos los campos son requeridos');
    }
  }

  /**
   * @description filtra solo números
   * @param input entrada
   */
  public inputNumber(input: HTMLInputElement, form: FormGroup, field: string) {
    let value = input.value.replace(Regex.NUMERO_G, '');
    form.get(field)?.setValue(value);
  }
}
