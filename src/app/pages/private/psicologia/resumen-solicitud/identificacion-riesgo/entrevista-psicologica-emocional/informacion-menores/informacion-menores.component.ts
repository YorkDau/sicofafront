import { Component, EventEmitter, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
    selector: 'app-informacion-menores',
    templateUrl: './informacion-menores.component.html',
    styleUrls: ['./informacion-menores.component.scss']
})
export class InformacionMenoresComponent {
    @Output() siguientePaso: EventEmitter<'Cancelar' | 'Anterior' | 'Siguiente'> =
    new EventEmitter<'Cancelar' | 'Anterior' | 'Siguiente'>();
    public form: FormGroup;

    constructor(private formBuilder: FormBuilder,) {
        this.form = this.formBuilder.group({
            hayMenores: [false, [Validators.required]],
            valoracionInicialPsicologica: ['', [Validators.required, Validators.maxLength(10000)]],
            valoracionEntornoFamiliar: ['', [Validators.required, Validators.maxLength(10000)]],
        });
    }

    guardar(evento: 'Siguiente' | 'Anterior') {
        //this.showOnSubmitIsRequired = false;
        this.siguientePaso.emit(evento);
    }

    cancelar() {
        this.siguientePaso.emit('Cancelar');
    }
}
