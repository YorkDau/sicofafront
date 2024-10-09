export interface IUsuario {
  nombres: string;
  apellidos: string;
  correoElectronico: string;
  telefonoFijo: string;
  celular: string;
  numeroDocumento: string;
  tipoDocumento: number;
  perfiles: Array<number>;
  idcomisaria: number;
}
