import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";



export const validarFechaMayor = (): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
        const fechaInicial = control.get('fechaInicial')?.value as Date;
        const fechaFinal = control.get('fechaFinal')?.value as Date;

        if(fechaInicial > fechaFinal){
            return {fechaInialMayorAFinal: true}
        } else  {
            return null
        }

    }
}

export const validarDocumento = (): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
        const tipoDocumento = control.get('tipoDocumento')?.value as string;
        const numeroDocumento = control.get('numeroDocumento')?.value as string;

        if (tipoDocumento != '' && numeroDocumento === ''){
            return {requioredNumeroDocumento: true}
        } else if( numeroDocumento != '' && tipoDocumento === ''){
            return {requiredTipoDocumento: true}
        }
        return null
    }
}