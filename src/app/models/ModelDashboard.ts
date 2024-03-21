export interface ModelDashboardResponseGrid {
    grids: ModelDashboardGrid[];
    parameters: ModelDashboardParameters;
}

export interface ModelDashboardConfiguration {
    configuration: ModelDashboardGrid;
    properties: ModelDashboardProperty;
}

export interface ModelDashboardGrid {
    id: string;
    name: string;
    type: string;
    component_id: string;
    order: number;
    size_xlarge: string;
    size_large: string;
    size_medium: string;
    size_small: string;
}

export interface ModelDashboardParameters {
    chart_height: string;
    size_large: string;
    size_mediun: string;
    size_small: string;
    size_xlarge: string;
}

export interface ModelDashboardProperty {
    property_ancho: number;
    property_alto: number;
    span_alto: string;
    span_ancho: string;
}
