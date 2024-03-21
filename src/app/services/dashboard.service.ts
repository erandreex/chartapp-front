import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { ModelResponse } from '../models/ModelResponse';
import { ModelDashboardResponseGrid } from '../models/ModelDashboard';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ModeloGraficaConsulta, ModeloRespuestaGraficaConsulta } from '../models/ModelChartLineBar';

@Injectable({
    providedIn: 'root',
})
export class DashboardService {
    private baseUrl: string = environment.baseUrl;

    constructor(private http: HttpClient) {}

    dashboardGrid(nombre: string): Observable<ModelResponse<ModelDashboardResponseGrid>> {
        const url = `${this.baseUrl}/dashboard/cuadricula/${nombre}`;

        return this.http.get<ModelResponse<ModelDashboardResponseGrid>>(url).pipe(
            map((resp) => resp),
            catchError((err) => of(err))
        );
    }

    charts(body: ModeloGraficaConsulta): Observable<ModelResponse<ModeloRespuestaGraficaConsulta>> {
        const url = `${this.baseUrl}/dashboard/consulta/grafica`;

        return this.http.post<ModelResponse<ModeloRespuestaGraficaConsulta>>(url, body).pipe(
            map((resp) => resp),
            catchError((err) => of(err))
        );
    }
}
