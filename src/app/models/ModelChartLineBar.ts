import { ChartTypeRegistry } from 'chart.js';

export interface ModeloGraficaConfig {
    id: string;
    nombre: string;
    titulo: string;
    tipo_grafica: keyof ChartTypeRegistry;
    tipo_escala: escala_opciones;
    cant_registros: number;
    intervalo_operacion: string;
    intervalo_tiempo: intervalo_tiempo_options;
    intervalo_valor: string;
    y_label: string;
    y_color: string;
    y_sugg_max: number;
    y_sugg_min: number;
    y_beginAtZero: string;
    y_tick_limit: number;
    y_fontSize: number;
    y_grid_display: string;
    y_grid_color: string;
    y_grid_offset: string;
    y_grid_drawticks: string;
    x_color: string;
    x_source: 'labels' | 'auto' | 'data';
    x_fontSize: number;
    x_grid_display: string;
    x_grid_color: string;
    x_grid_offset: string;
    x_grid_drawticks: string;
    stacked: string;
    background_tipo: string;
    background_color: string;
    observable: number;
    legend_boxSize: number;
    legend_fontSize: number;
    legend_color: string;
    title_fontSize: number;
    title_color: string;
    tooltip_fontSize: number;
    tooltip_color: string;
    layout_padding: number;
}

export type intervalo_tiempo_options =
    | 'millisecond'
    | 'second'
    | 'minute'
    | 'hour'
    | 'day'
    | 'week'
    | 'month'
    | 'quarter'
    | 'year';

export type escala_opciones =
    | 'time'
    | 'linear'
    | 'logarithmic'
    | 'category'
    | 'timeseries'
    | 'radialLinear'
    | undefined;

export interface ModeloGraficaDatasetConfig {
    grafica_id: string;
    dataset_id: string;
    dataset_posicion: number;
    proc_nombre: string;
    proc_tipo: string;
    proc_operacion: string;
    rutina: string;
    dataset_label: string;
    tipo: string;
    fondo_color: string;
    borde_color: string;
    borde_tamano: string;
    point_radius: number;
    point_border_width: number;
    point_hover_radius: number;
    point_hover_border_width: number;
    point_hover_background_color: string;
    stack: number;
    fill: string;
}

export interface ModeloGraficaDatasetData {
    dataRutina: string;
    dataFecha: string;
    dataCantidad: number;
    dataPosicion: number;
}

export interface ModeloRespuestaGraficaConsulta {
    graficaConfig: ModeloGraficaConfig;
    datasetsConfig: ModeloGraficaDatasetConfig[];
    datasetsData: ModeloGraficaDatasetData[];
    datasetsLabels: string[];
}

export interface ModeloGraficaConsulta {
    idGrafica: string;
    cantRegistros: number;
    consultaFecha: string;
}
