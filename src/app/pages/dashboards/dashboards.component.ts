import { Component, ElementRef, ViewChild } from '@angular/core';
import { ModelDashboardConfiguration, ModelDashboardGrid, ModelDashboardProperty } from '../../models/ModelDashboard';
import { ActivatedRoute } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';
import { ChartLineBarComponent } from '../../components/chart-line-bar/chart-line-bar.component';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-dashboards',
    standalone: true,
    imports: [CommonModule, ChartLineBarComponent],
    templateUrl: './dashboards.component.html',
    styleUrl: './dashboards.component.css',
})
export class DashboardsComponent {
    // VARIABLES PARAMETROS GENERAL
    public parametro_grafica_height: string = '325';
    public parametro_tamano_small: number = 400;
    public parametro_tamano_mediun: number = 800;
    public parametro_tamano_large: number = 1200;
    public parametro_tamano_xlarge: number = 1500;
    // VARIABLES PARAMETROS GENERAL

    // VARIABLES CALCULOS
    public calculo_tamano: 'small' | 'medium' | 'large' | 'xlarge' = 'small';
    // VARIABLES CALCULOS

    public nombre: string = '';
    public listaComponenteCuadricula: ModelDashboardGrid[] = [];
    public listaEnvioComponente: ModelDashboardConfiguration[] = [];

    @ViewChild('layout') layout!: ElementRef<HTMLDivElement>;

    constructor(private route: ActivatedRoute, private dashboardService: DashboardService) {}

    ngOnInit() {
        this.nombre = this.route.snapshot.paramMap.get('nombre') || 'prueba';
    }

    ngAfterViewInit() {
        this.obtenerComponentes();
    }

    obtenerComponentes() {
        this.dashboardService.dashboardGrid(this.nombre).subscribe((resp) => {
            this.listaComponenteCuadricula = resp.response.grids;
            this.parametro_grafica_height = resp.response.parameters.chart_height;
            this.parametro_tamano_small = +resp.response.parameters.size_small;
            this.parametro_tamano_mediun = +resp.response.parameters.size_mediun;
            this.parametro_tamano_large = +resp.response.parameters.size_large;
            this.parametro_tamano_xlarge = +resp.response.parameters.size_xlarge;

            this.calculosPrincipales();
        });
    }

    calculosPrincipales() {
        let valorWidthContendor: number = this.layout.nativeElement.offsetWidth;
        let columnasTotal: number = 12;
        let valorColumna: number = valorWidthContendor / columnasTotal;
        let temporal: ModelDashboardConfiguration[] = [];
        let temporal2: ModelDashboardProperty;

        let anchoNumero: number = 0;
        let anchoCalculo: number = 0;
        let anchoSpan: number = 0;
        let altoNumero: number = 0;
        let altoCalculo: number = 0;
        let altoSpan: number = 0;

        // Calcular el tipo de tamano
        if (valorWidthContendor > this.parametro_tamano_small) {
            this.calculo_tamano = 'small';
        }
        if (valorWidthContendor > this.parametro_tamano_mediun) {
            this.calculo_tamano = 'medium';
        }
        if (valorWidthContendor > this.parametro_tamano_large) {
            this.calculo_tamano = 'large';
        }
        if (valorWidthContendor > this.parametro_tamano_xlarge) {
            this.calculo_tamano = 'xlarge';
        }
        // Calcular el tipo de tamano

        this.listaComponenteCuadricula.forEach((element) => {
            switch (this.calculo_tamano) {
                case 'small':
                    altoNumero = +element.size_small.split('x')[0];
                    anchoNumero = +element.size_small.split('x')[1];
                    break;
                case 'medium':
                    altoNumero = +element.size_medium.split('x')[0];
                    anchoNumero = +element.size_medium.split('x')[1];
                    break;

                case 'large':
                    altoNumero = +element.size_large.split('x')[0];
                    anchoNumero = +element.size_large.split('x')[1];
                    break;

                case 'xlarge':
                    altoNumero = +element.size_xlarge.split('x')[0];
                    anchoNumero = +element.size_xlarge.split('x')[1];
                    break;
            }

            anchoCalculo = Math.floor(valorColumna * anchoNumero);
            altoCalculo = Math.floor(+this.parametro_grafica_height * altoNumero);

            temporal2 = {
                property_alto: altoCalculo,
                property_ancho: anchoCalculo,
                span_alto: `span ${altoNumero}`,
                span_ancho: `span ${anchoNumero}`,
            };

            temporal.push({ configuration: element, properties: temporal2 });
        });

        this.listaEnvioComponente = temporal;
    }
}
