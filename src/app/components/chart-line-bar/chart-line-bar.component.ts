import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, interval, of } from 'rxjs';

import Chart, { ChartTypeRegistry } from 'chart.js/auto';
import 'chartjs-adapter-date-fns';
import {
    ModeloGraficaConfig,
    ModeloGraficaConsulta,
    ModeloGraficaDatasetConfig,
    ModeloGraficaDatasetData,
    escala_opciones,
    intervalo_tiempo_options,
} from '../../models/ModelChartLineBar';
import { ModelDashboardConfiguration } from '../../models/ModelDashboard';
import { DashboardService } from '../../services/dashboard.service';

declare var $: any;

@Component({
    selector: 'app-chart-line-bar',
    standalone: true,
    imports: [],
    templateUrl: './chart-line-bar.component.html',
    styleUrl: './chart-line-bar.component.css',
})
export class ChartLineBarComponent implements OnInit, OnDestroy, AfterViewInit {
    //
    // VARIABLES GENERALES GRAFICA
    @Input('componente') public componente!: ModelDashboardConfiguration;

    public myChartOriginal: any = null;
    public miObservableConsDatos: any = null;
    public canvaHeight: number = 0;
    public canvaWidth: number = 0;

    // VARIABLES GENERALES GRAFICA

    // VARIABLES GRAFICA CONFIG
    public configGraficaNombre: string = '';
    public configGraficaTitulo: string = '';
    public configGraficaTipoGrafica: keyof ChartTypeRegistry = 'line';
    public configGraficaTipoEscala: escala_opciones = 'time';
    public configGraficaCantRegistros: number = 15;
    public configGraficaStacked: boolean = false;
    public configGraficaObservable: number = 60000;
    public configGraficaBackground_tipo: string = 'transparent';
    public configGraficaBackground_color: string = '#292E38';
    public configGraficaLayout_padding: number = 20;

    public configGraficaIntervaloOperacion: string = '';
    public configGraficaIntervaloTiempo: intervalo_tiempo_options = 'minute';
    public configGraficaIntervaloValor: string = '';

    public configY_label: string = 'Axis Y';
    public configY_color: string = '#FFF';
    public configY_sugg_max: number = 100;
    public configY_sugg_min: number = 0;
    public configY_begintAtZero: boolean = false;
    public configY_tick_limit: number = 11;
    public configY_fontSize: number = 12;
    public configY_grid_display: boolean = true;
    public configY_grid_color: string = '#0000001A';
    public configY_grid_offset: boolean = false;
    public configY_grid_drawticks: boolean = true;

    public configX_color: string = '#FFF';
    public configX_source: 'labels' | 'auto' | 'data' = 'auto';
    public configX_fontSize: number = 12;
    public configX_grid_display: boolean = true;
    public configX_grid_color: string = '#0000001A';
    public configX_grid_offset: boolean = false;
    public configX_grid_drawticks: boolean = true;

    public configGraficaLegend_boxSize: number = 12;
    public configGraficaLegend_fontSize: number = 12;
    public configGraficaLegend_color: string = '#FFF';

    public configGraficaTitle_fontSize: number = 12;
    public configGraficaTitle_color: string = '#FFF';

    public configGraficaTooltip_fontSize: number = 12;
    public configGraficaTooltip_color: string = '#FFF';
    // VARIABLES GRAFICA CONFIG

    // VARIABLES ARREGLOS
    public listaGraficaDatasetsConfig: ModeloGraficaDatasetConfig[] = [];
    public listaGraficaDatasetsData: ModeloGraficaDatasetData[] = [];
    public graficaConfig!: ModeloGraficaConfig;
    public listaGraficaLabels: string[] = [];
    // VARIABLES ARREGLOS

    constructor(private dashboardService: DashboardService) {}
    ngAfterViewInit(): void {}

    ngOnInit(): void {
        this.obtenerDatosGrafica();
    }

    ngOnDestroy(): void {
        if (this.myChartOriginal) {
            this.myChartOriginal.clear();
            this.myChartOriginal.destroy();
        }
        if (this.miObservableConsDatos) this.miObservableConsDatos.unsubscribe();
    }

    obtenerDatosGrafica() {
        let body: ModeloGraficaConsulta = {
            idGrafica: this.componente.configuration.id,
            cantRegistros: 30,
            consultaFecha: 'N/A',
        };

        this.canvaHeight = this.componente.properties.property_alto;
        this.canvaWidth = this.componente.properties.property_ancho;

        console.log(this.canvaWidth);

        this.dashboardService.charts(body).subscribe((resp) => {
            this.listaGraficaDatasetsData = resp.response.datasetsData;
            this.listaGraficaDatasetsConfig = resp.response.datasetsConfig;
            this.graficaConfig = resp.response.graficaConfig;
            this.listaGraficaLabels = resp.response.datasetsLabels;

            this.configGraficaNombre = this.graficaConfig.nombre;
            this.configGraficaTitulo = this.graficaConfig.titulo;
            this.configGraficaTipoGrafica = this.graficaConfig.tipo_grafica;
            this.configGraficaTipoEscala = this.graficaConfig.tipo_escala;
            this.configGraficaCantRegistros = this.graficaConfig.cant_registros;
            this.configGraficaStacked = this.graficaConfig.stacked == 'true';
            this.configGraficaObservable = this.graficaConfig.observable;
            this.configGraficaBackground_tipo = this.graficaConfig.background_tipo;
            this.configGraficaBackground_color = this.graficaConfig.background_color;
            this.configGraficaLayout_padding = this.graficaConfig.layout_padding;

            this.configGraficaIntervaloOperacion = this.graficaConfig.intervalo_operacion;
            this.configGraficaIntervaloTiempo = this.graficaConfig.intervalo_tiempo;
            this.configGraficaIntervaloValor = this.graficaConfig.intervalo_valor;

            this.configY_label = this.graficaConfig.y_label;
            this.configY_color = this.graficaConfig.y_color;
            this.configY_sugg_max = this.graficaConfig.y_sugg_max;
            this.configY_sugg_min = this.graficaConfig.y_sugg_min;
            this.configY_begintAtZero = this.graficaConfig.y_beginAtZero == 'true';
            this.configY_tick_limit = this.graficaConfig.y_tick_limit;
            this.configY_fontSize = this.graficaConfig.y_fontSize;
            this.configY_grid_display = this.graficaConfig.y_grid_display == 'true';
            this.configY_grid_color = this.graficaConfig.y_grid_color;
            this.configY_grid_offset = this.graficaConfig.y_grid_offset == 'true';
            this.configY_grid_drawticks = this.graficaConfig.y_grid_drawticks == 'true';

            this.configX_color = this.graficaConfig.x_color;
            this.configX_source = this.graficaConfig.x_source;
            this.configX_fontSize = this.graficaConfig.x_fontSize;
            this.configX_grid_display = this.graficaConfig.x_grid_display == 'true';
            this.configX_grid_color = this.graficaConfig.x_grid_color;
            this.configX_grid_offset = this.graficaConfig.x_grid_offset == 'true';
            this.configX_grid_drawticks = this.graficaConfig.x_grid_drawticks == 'true';

            this.configGraficaLegend_boxSize = this.graficaConfig.legend_boxSize;
            this.configGraficaLegend_fontSize = this.graficaConfig.legend_fontSize;
            this.configGraficaLegend_color = this.graficaConfig.legend_color;

            this.configGraficaTitle_fontSize = this.graficaConfig.title_fontSize;
            this.configGraficaTitle_color = this.graficaConfig.title_color;

            this.configGraficaTooltip_fontSize = this.graficaConfig.tooltip_fontSize;
            this.configGraficaTooltip_color = this.graficaConfig.tooltip_color;

            if (this.myChartOriginal == null) {
                //First run

                this.DibujaGrafica().subscribe((resp) => {
                    this.actualizaInfoGrafica();
                });

                this.miObservableConsDatos = interval(this.configGraficaObservable).subscribe((resp) => {
                    this.obtenerDatosGrafica();
                });
            } else {
                this.actualizaInfoGrafica();
            }
        });
    }

    obtenerDatasetData(indice: number) {
        let temporal: ModeloGraficaDatasetData[] = [];
        temporal = this.listaGraficaDatasetsData.filter((e) => e.dataPosicion == indice);
        return temporal.map((e) => e.dataCantidad);
    }

    actualizaInfoGrafica() {
        let temporal: any[] = [];
        if (this.myChartOriginal) {
            this.myChartOriginal.config.data.datasets.length = 0;
            this.myChartOriginal.data.labels = this.listaGraficaLabels;

            for (let i = 0; i < this.listaGraficaDatasetsConfig.length; i++) {
                console.log(this.listaGraficaDatasetsConfig[i].point_radius, 'point_radius');
                let newDataset: any = {
                    data: this.obtenerDatasetData(this.listaGraficaDatasetsConfig[i].dataset_posicion),
                    label: this.listaGraficaDatasetsConfig[i].dataset_label,
                    pointRadius: this.listaGraficaDatasetsConfig[i].point_radius,
                    pointBorderWidth: this.listaGraficaDatasetsConfig[i].point_border_width,
                    pointHoverRadius: this.listaGraficaDatasetsConfig[i].point_hover_radius,
                    pointHoverBorderWidth: this.listaGraficaDatasetsConfig[i].point_hover_border_width,
                    pointHoverBackgroundColor: this.listaGraficaDatasetsConfig[i].point_hover_background_color,
                    fill: this.listaGraficaDatasetsConfig[i].fill == 'true',
                    type: this.listaGraficaDatasetsConfig[i].tipo,
                    borderWidth: this.listaGraficaDatasetsConfig[i].borde_tamano,
                    stack: this.listaGraficaDatasetsConfig[i].stack,
                    borderColor: this.listaGraficaDatasetsConfig[i].borde_color,
                    backgroundColor: this.listaGraficaDatasetsConfig[i].fondo_color,
                    drawActiveElementsOnTop: false,
                    tension: 0.3,
                    barPercentage: 1,
                    categoryPercentage: 0.8,
                };

                if (this.configGraficaStacked) {
                    newDataset['stack'] = this.listaGraficaDatasetsConfig[i].stack;
                }

                temporal.push(newDataset);
            }

            this.myChartOriginal.data.datasets.push(...temporal);
            this.myChartOriginal.data.labels = this.listaGraficaLabels;
        }
        this.myChartOriginal.update();
    }

    DibujaGrafica(): Observable<boolean> {
        let canvas = <HTMLCanvasElement>document.getElementById(this.componente.configuration.component_id);
        let ctx = canvas.getContext('2d');

        // let canvasContainer = <HTMLElement>document.getElementById('containerGrafica');
        // let valorFinal = '275';

        // if (canvasContainer) valorFinal = `${canvasContainer.clientHeight}px`;

        canvas.style.width = `${this.canvaWidth}px`;
        canvas.style.height = `${this.canvaHeight}px`;

        let chartTemporal = new Chart(ctx!, {
            type: this.configGraficaTipoGrafica,
            data: {
                labels: [],
                datasets: [],
            },
            options: {
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                responsive: true,
                maintainAspectRatio: false,
                resizeDelay: 1000,
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom',
                        labels: {
                            color: this.configGraficaLegend_color,
                            boxWidth: this.configGraficaLegend_boxSize,
                            font: {
                                size: this.configGraficaLegend_fontSize,
                            },
                        },
                    },
                    title: {
                        display: true,
                        text: this.configGraficaTitulo,
                        color: this.configGraficaTitle_color,
                        font: {
                            size: this.configGraficaTitle_fontSize,
                        },
                    },
                    tooltip: {
                        mode: 'index',
                        yAlign: 'center',
                        titleAlign: 'center',
                        titleColor: this.configGraficaTooltip_color,
                        titleFont: {
                            size: this.configGraficaTooltip_fontSize,
                        },
                        bodyColor: this.configGraficaTooltip_color,
                        bodyFont: {
                            size: this.configGraficaTooltip_fontSize,
                        },
                        footerColor: this.configGraficaTooltip_color,
                        footerFont: {
                            size: this.configGraficaTooltip_fontSize,
                        },
                    },
                },
                layout: {
                    padding: this.configGraficaLayout_padding,
                },
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: this.configGraficaIntervaloTiempo,
                            isoWeekday: 1,
                            minUnit: 'minute',
                        },
                        ticks: {
                            font: {
                                size: this.configX_fontSize,
                            },
                            color: this.configX_color,
                            source: this.configX_source,
                        },
                        grid: {
                            display: this.configX_grid_display,
                            color: this.configX_grid_color,
                            offset: this.configX_grid_offset,
                            drawTicks: this.configX_grid_drawticks,
                        },
                        stacked: this.configGraficaStacked,
                    },
                    y: {
                        suggestedMax: this.configY_sugg_max,
                        suggestedMin: this.configY_sugg_min,
                        beginAtZero: this.configY_begintAtZero,
                        stacked: this.configGraficaStacked,
                        grid: {
                            display: this.configY_grid_display,
                            color: this.configY_grid_color,
                            offset: this.configY_grid_offset,
                            drawTicks: this.configY_grid_drawticks,
                        },
                        ticks: {
                            font: {
                                size: this.configY_fontSize,
                            },
                            color: this.configY_color,
                            maxTicksLimit: this.configY_tick_limit,
                        },
                        title: {
                            display: true,
                            color: this.configY_color,
                            text: this.configY_label,
                        },
                    },
                },
            },
            plugins: [
                {
                    id: 'background',
                    beforeDraw: (chart, args, options) => {
                        const { ctx } = chart;
                        ctx.save();
                        ctx.fillStyle = this.configGraficaBackground_color;
                        ctx.globalCompositeOperation = 'destination-over';
                        ctx.fillRect(0, 0, chart.width, chart.height);
                        ctx.restore();
                    },
                },
            ],
        });

        this.myChartOriginal = chartTemporal;

        return of(true);
    }
}
