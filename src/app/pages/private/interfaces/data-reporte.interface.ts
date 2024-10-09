export interface DataReporteInterface {
    nombreVictima:              string;
    tipoDocumentoVictima:       string;
    numeroDocumentoVictima:     string;
    lugarExpedicionVictima:     string;
    direccionResidenciaVictima: string;
    barrioVictima:              string;
    telefonoVictima:            string;
    correoElectronicoVictima:   string;
    localidadVictima:           string;
    edadVictima:                number;
    generoVictima:              string;
    informacionFamiliarVictima: string;
    nombreAgresor:              string;
    numeroDocumentoAgresor:     string;
    tipoDocumentoAgresor:       string;
    generoAgresor:              string;
    edadAgresor:                number;
    direcionResidenciaAgresor:  string;
    barrioAgresor:              string;
    telefonoAgresor:            string;
    correoElectronicoAgresor:   string;
    relatoHechos:               string;
    ciudadRemision:             string;
    direccionComisaria:         string;
    telefonoComisaria:          string;
    correoComisaria:            string;
    nombreComisaria:            string;
}

export interface DataReporteByID{
    item1:                      string;
    item2:                      string;
}