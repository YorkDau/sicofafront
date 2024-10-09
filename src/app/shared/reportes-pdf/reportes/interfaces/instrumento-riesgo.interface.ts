import { ValoracionRiesgo } from '../../../../pages/private/interfaces/psicologia.interface';
import { DescripcionHechosDTO } from '../../../../pages/private/psicologia/interfaces/descripcion-hechos.interface';
import {
  FormTipoViolenciaInterface,
  InvolucradoDTO,
} from '../../../../pages/private/psicologia/interfaces/involucrado.interface';
import { DatosInstitucionesDTO } from './datos-institucionales.interface';

export class ReporteInstrumentoRiesgoInterface {
  public institucional!: DatosInstitucionesDTO;
  public victima!: InvolucradoDTO;
  public agresor!: InvolucradoDTO;
  public descripcionHechos!: DescripcionHechosDTO;
  public tiposViolencia!: FormTipoViolenciaInterface[];
  public valoracion!: ValoracionRiesgo;
  public nombre_psicologo = 'Jorge Sanchez';
  public cargo_psicolo = 'Psicólogo';
}
