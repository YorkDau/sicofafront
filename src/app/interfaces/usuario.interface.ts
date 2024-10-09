export interface UserInterface {
    usuario: string;
    perfil: string | null;
    userID: number;
    idComisaria: number;
    reset: boolean;
} 

export interface NombreUsuario {
    activo: boolean;
    apellidos:          string;
    cargo:              string;
    celular:            number;
    correoElectronico:  string;
    idComisaria:        number;
    idUsuarioSistema:   number;
    nombres:            string;
    numeroDocumento:    string;
}