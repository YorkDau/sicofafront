export class ValidarCampos {
  /**
   * @description valida los campos booleanos indefinidos
   * @param value valor del campo
   * @returns false si es indefinido
   */
  static validarBooleanos(value: any): boolean {
    return value ? true : false;
  }

  /**
   * @description valida los campos string indefinidos
   * @param value valor del campo
   * @returns vacío si es indefinido
   */
  static validarString(value: any): string {
    return !value ? '' : value;
  }

  /**
   * @description valida los campos number indefinidos
   * @param value valor del campo
   * @returns 0 si es indefinido
   */
  static validarNumber(value: any): number {
    return value ? value : 0;
  }
}
