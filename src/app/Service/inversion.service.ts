import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Inversion } from "../Models/inversion";

@Injectable({ providedIn: 'root' })
export class InversionService {
    private URLBackend: string = "http://localhost:8080/inversiones/calcularInversion";
    public ListaInversiones: Inversion[] = [];

    constructor(private httpClient: HttpClient) {

    }

    EnviandoInversion(DatosInversion: any) {
        return this.httpClient.post(`${this.URLBackend}`, DatosInversion);
    }

}