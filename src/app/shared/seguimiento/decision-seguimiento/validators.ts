import { AbstractControl, FormArray, FormControl, FormGroup, ValidationErrors, ValidatorFn } from "@angular/forms";


export const validarIncumplimiento = (): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
        const conclusion = control.get('conclusion')?.value as string;
        const incumplimiento = control.get('incumplimiento')?.value as string;
    
        if (conclusion === 'N' &&  incumplimiento === '') {
                    
            return {requiredCampoIncumplimiento: true}; 
        }
        return null;
    };
  };

export const validarFechaProrroga = (): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
        const rCumplimiento = control.get('rCumplimiento')?.value as string;
        const fechaProrroga = control.get('fechaProrroga')?.value as string;

        if(rCumplimiento === 'PRORROGA' && fechaProrroga === ''){

            return {isRequiredFechaProrroga: true}
        }
            
        return null;
    }
};

export const validarJustificacionProrroga =(): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
        const rCumplimiento = control.get('rCumplimiento')?.value as string;
        const justificacionProrroga = control.get('justificacionProrroga')?.value as string;
        
        if(rCumplimiento === 'PRORROGA' && justificacionProrroga === ''){

            return {isRequiredJustificacionProrroga: true}
        }
            
        return null;
    }
    }
