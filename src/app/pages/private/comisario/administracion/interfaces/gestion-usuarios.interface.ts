export interface usuariosInterface {
    apellidos: string;
    cargo: string;
    celular: number;
    correoElectronico: string;
    idComisaria: number;
    idUsuarioSistema: number;
    nombres: string;
    numeroDocumento: string;
    perfiles: any[];
    tipoDocumento: number;
    activo: boolean;
    telefonoFijo: number;
    direccion: string;
}

export interface perfilesInterface {
    idPerfil: number;
    nombrePerfil: string;
}

export interface crearUsuarioInterfce{
    nombres: string;
    apellidos: string;
    correoElectronico: string;
    telefonoFijo: string; 
    celular: string; 
    numeroDocumento: string;
    tipoDocumento: number;
    perfiles: number[];
    idComisaria?: number;
}
export interface modificarUsuarioInterfce{
    idUsuarioSistema: number;
    nombres: string;
    apellidos: string;
    correoElectronico: string;
    telefonoFijo: string; 
    celular: string; 
    numeroDocumento: string;
    tipoDocumento: number;
    perfiles: number[];
    activo: boolean;
    idComisaria?: number;
}
