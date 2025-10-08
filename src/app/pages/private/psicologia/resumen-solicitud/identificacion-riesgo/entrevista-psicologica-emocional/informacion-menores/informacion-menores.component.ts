import { Component, EventEmitter, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Subject } from "rxjs";
import { DominiosEvaluacionOrientacion, Mensajes } from "src/app/constants";
import { Respuesta, RespuestaEntrevistaRedes } from "src/app/pages/private/interfaces/psicologia.interface";
import { EntrevistaPsicologicaEmocionalService } from "../../../../services/entrevista-psicologica-emocional.service";
import { Modales } from "src/app/shared/modals";

@Component({
    selector: 'app-informacion-menores',
    templateUrl: './informacion-menores.component.html',
    styleUrls: ['./informacion-menores.component.scss']
})
export class InformacionMenoresComponent {

    public respuestas: Respuesta[] = [];

    @Output() siguientePaso: EventEmitter<'Cancelar' | 'Anterior' | 'Siguiente'> =
        new EventEmitter<'Cancelar' | 'Anterior' | 'Siguiente'>();
    private tarea = JSON.parse(sessionStorage.getItem('info')!);
    public form: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        private entrevistaService: EntrevistaPsicologicaEmocionalService,
        private modales: Modales,
    ) {
        this.form = this.formBuilder.group({
            hayMenores: [false, [Validators.required]],
            valoracionInicialPsicologica: ['', [Validators.required, Validators.maxLength(10000)]],
            valoracionEntornoFamiliar: ['', [Validators.required, Validators.maxLength(10000)]],
        });
    }

    ngAfterViewInit(): void {
        this.getInitialData();
    }

    /**
     * Consulta la información de descripcion por tipoDominio
     * @returns
     */
    public async getInitialData() {
        this.entrevistaService
            .getEvaluacionMenores(this.tarea.idSolicitud)
            .subscribe({
                next: (result) => {
                    if (result && result.statusCode == 200 && result.data) {
                        const { hayMenores, valoracionPsicologica, valoracionEntornoFamiliar } = result.data;
                        this.form.patchValue({
                            hayMenores,
                            valoracionInicialPsicologica: valoracionPsicologica,
                            valoracionEntornoFamiliar: valoracionEntornoFamiliar
                        });
                    }
                },
            });
    }

    public actualizar() {
        let subject = new Subject<boolean>();
        if (this.tarea.idSolicitud) {
            const body = {
                idSolicitudServicio: this.tarea.idSolicitud,
                hayMenores: this.form.get('hayMenores')?.value,
                valoracionPsicologica: this.form.get('valoracionInicialPsicologica')?.value,
                valoracionEntornoFamiliar: this.form.get('valoracionEntornoFamiliar')?.value,
            };
            this.entrevistaService.actualizarInfoMenores(body).subscribe({
                next: (result) => {
                    if (result && result.statusCode == 200) {
                        subject.next(true);
                    }
                },
                error: () => {
                    subject.next(false);
                },
            });
        }
        return subject.asObservable();
    }

    guardar(evento: 'Siguiente' | 'Anterior') {
        //this.showOnSubmitIsRequired = false;
        this.siguientePaso.emit(evento);
        this.actualizar().subscribe((result) => {
            if (result) {
                this.siguientePaso.emit(evento);
            } else {
                this.modales.modalInformacion(Mensajes.MENSAJE_ERROR_G);
            }
        });
    }

    cancelar() {
        this.siguientePaso.emit('Cancelar');
    }
}
