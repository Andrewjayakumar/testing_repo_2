const chartGroups = [
  {
    name: 'Bar Charts',
    charts: [
      {
        name: 'Vertical Bar Chart',
        selector: 'bar-vertical',
        inputFormat: 'singleSeries',
        options: [
          'colorScheme', 'schemeType', 'showXAxis', 'showYAxis', 'gradient', 'barPadding',
          'showLegend', 'legendTitle', 'showXAxisLabel', 'xAxisLabel', 'showYAxisLabel', 'yAxisLabel',
          'showGridLines', 'roundDomains', 'tooltipDisabled', 'roundEdges'
        ]
      },
      {
        name: 'Horizontal Bar Chart',
        selector: 'bar-horizontal',
        inputFormat: 'singleSeries',
        options: [
          'colorScheme', 'schemeType', 'showXAxis', 'showYAxis', 'gradient', 'barPadding',
          'showLegend', 'legendTitle', 'showXAxisLabel', 'xAxisLabel', 'showYAxisLabel', 'yAxisLabel',
          'showGridLines', 'roundDomains', 'tooltipDisabled', 'roundEdges'
        ],
        defaults: {
          yAxisLabel: 'y-Axis',
          xAxisLabel: 'x-Axis',
        }
      },
      {
        name: 'Grouped Vertical Bar Chart',
        selector: 'bar-vertical-2d',
        inputFormat: 'multiSeries',
        options: [
          'colorScheme', 'schemeType', 'showXAxis', 'showYAxis', 'gradient', 'barPadding', 'groupPadding',
          'showLegend', 'legendTitle', 'showXAxisLabel', 'xAxisLabel', 'showYAxisLabel', 'yAxisLabel',
          'showGridLines', 'roundDomains', 'tooltipDisabled', 'roundEdges'
        ]
      },
      {
        name: 'Grouped Horizontal Bar Chart',
        selector: 'bar-horizontal-2d',
        inputFormat: 'multiSeries',
        options: [
          'colorScheme', 'schemeType', 'showXAxis', 'showYAxis', 'gradient', 'barPadding', 'groupPadding',
          'showLegend', 'legendTitle', 'showXAxisLabel', 'xAxisLabel', 'showYAxisLabel', 'yAxisLabel',
          'showGridLines', 'roundDomains', 'tooltipDisabled', 'roundEdges'
        ],
        defaults: {
          yAxisLabel: 'y-Axis',
          xAxisLabel: 'x-Axis',
        }
      },
      {
        name: 'Stacked Vertical Bar Chart',
        selector: 'bar-vertical-stacked',
        inputFormat: 'multiSeries',
        options: [
          'colorScheme', 'schemeType', 'showXAxis', 'showYAxis', 'gradient', 'barPadding',
          'showLegend', 'legendTitle', 'showXAxisLabel', 'xAxisLabel', 'showYAxisLabel', 'yAxisLabel',
          'showGridLines', 'roundDomains', 'tooltipDisabled'
        ]
      },
      {
        name: 'Stacked Horizontal Bar Chart',
        selector: 'bar-horizontal-stacked',
        inputFormat: 'multiSeries',
        options: [
          'colorScheme', 'schemeType', 'showXAxis', 'showYAxis', 'gradient', 'barPadding',
          'showLegend', 'legendTitle', 'showXAxisLabel', 'xAxisLabel', 'showYAxisLabel', 'yAxisLabel',
          'showGridLines', 'roundDomains', 'tooltipDisabled'
        ],
        defaults: {
          yAxisLabel: 'y-Axis',
          xAxisLabel: 'x-Axis',
        }
      },
      {
        name: 'Normalized Vertical Bar Chart',
        selector: 'bar-vertical-normalized',
        inputFormat: 'multiSeries',
        options: [
          'colorScheme', 'schemeType', 'showXAxis', 'showYAxis', 'gradient', 'barPadding',
          'showLegend', 'legendTitle', 'showXAxisLabel', 'xAxisLabel', 'showYAxisLabel', 'yAxisLabel',
          'showGridLines', 'roundDomains', 'tooltipDisabled'
        ],
        defaults: {
          yAxisLabel: 'y-Axis',
          xAxisLabel: 'Country',
        }
      },
      {
        name: 'Normalized Horizontal Bar Chart',
        selector: 'bar-horizontal-normalized',
        inputFormat: 'multiSeries',
        options: [
          'colorScheme', 'schemeType', 'showXAxis', 'showYAxis', 'gradient', 'barPadding',
          'showLegend', 'legendTitle', 'showXAxisLabel', 'xAxisLabel', 'showYAxisLabel', 'yAxisLabel',
          'showGridLines', 'roundDomains', 'tooltipDisabled'
        ],
        defaults: {
          yAxisLabel: 'y-Axis',
          xAxisLabel: 'x-Axis',
        }
      }
    ]
  },
  {
    name: 'Pie Charts',
    charts: [
      {
        name: 'Pie Chart',
        selector: 'pie-chart',
        inputFormat: 'singleSeries',
        options: [
          'colorScheme', 'gradient', 'showLegend', 'legendTitle', 'doughnut', 'arcWidth',
          'explodeSlices', 'showLabels', 'tooltipDisabled'
        ]
      },
      {
        name: 'Advanced Pie Chart',
        selector: 'advanced-pie-chart',
        inputFormat: 'singleSeries',
        options: ['colorScheme', 'gradient', 'tooltipDisabled']
      },
      {
        name: 'Pie Grid',
        selector: 'pie-grid',
        inputFormat: 'singleSeries',
        options: ['colorScheme', 'tooltipDisabled']
      }
    ]
  },
  {
    name: 'Line/Area Charts',
    charts: [
      {
        name: 'Line Chart',
        selector: 'line-chart',
        inputFormat: 'multiSeries',
        options: [
          'colorScheme', 'schemeType', 'showXAxis', 'showYAxis', 'gradient',
          'showLegend', 'legendTitle', 'showXAxisLabel', 'xAxisLabel', 'showYAxisLabel',
          'yAxisLabel', 'autoScale', 'timeline', 'showGridLines', 'curve',
          'rangeFillOpacity', 'roundDomains', 'tooltipDisabled', 'showRefLines',
          'referenceLines', 'showRefLabels'
        ],
        defaults: {
          yAxisLabel: 'y-Axis',
          xAxisLabel: 'x-Axis',
          linearScale: true
        }
      },
      {
        name: 'Polar Chart',
        selector: 'polar-chart',
        inputFormat: 'multiSeries',
        options: [
          'colorScheme', 'schemeType', 'showXAxis', 'showYAxis', 'gradient',
          'showLegend', 'legendTitle', 'showXAxisLabel', 'xAxisLabel', 'showYAxisLabel',
          'yAxisLabel', 'autoScale', 'showGridLines', 'curveClosed',
          'roundDomains', 'tooltipDisabled'
        ],
        defaults: {
          yAxisLabel: 'y-Axis',
          xAxisLabel: 'x-Axis',
          linearScale: true
        }
      },
      {
        name: 'Area Chart',
        selector: 'area-chart',
        inputFormat: 'multiSeries',
        options: [
          'colorScheme', 'schemeType', 'showXAxis', 'showYAxis', 'gradient',
          'showLegend', 'legendTitle', 'showXAxisLabel', 'xAxisLabel', 'showYAxisLabel',
          'yAxisLabel', 'autoScale', 'timeline', 'showGridLines', 'curve',
          'roundDomains', 'tooltipDisabled'
        ],
        defaults: {
          yAxisLabel: 'y-Axis',
          xAxisLabel: 'x-Axis',
          linearScale: true
        }
      },
      {
        name: 'Stacked Area Chart',
        selector: 'area-chart-stacked',
        inputFormat: 'multiSeries',
        options: [
          'colorScheme', 'schemeType', 'showXAxis', 'showYAxis', 'gradient',
          'showLegend', 'legendTitle', 'showXAxisLabel', 'xAxisLabel', 'showYAxisLabel',
          'yAxisLabel', 'autoScale', 'timeline', 'showGridLines', 'curve',
          'roundDomains', 'tooltipDisabled'
        ],
        defaults: {
          yAxisLabel: 'y-Axis',
          xAxisLabel: 'x-Axis',
          linearScale: true
        }
      },
      {
        name: 'Normalized Area Chart',
        selector: 'area-chart-normalized',
        inputFormat: 'multiSeries',
        options: [
          'colorScheme', 'schemeType', 'showXAxis', 'showYAxis', 'gradient',
          'showLegend', 'legendTitle', 'showXAxisLabel', 'xAxisLabel', 'showYAxisLabel',
          'yAxisLabel', 'autoScale', 'timeline', 'showGridLines', 'curve',
          'roundDomains', 'tooltipDisabled'
        ],
        defaults: {
          yAxisLabel: 'y-Axis',
          xAxisLabel: 'x-Axis',
          linearScale: true
        }
      },
    ]
  },
  {
    name: 'Other Charts',
    charts: [
      {
        name: 'Bubble Chart',
        selector: 'bubble-chart',
        inputFormat: 'bubble',
        options: [
          'colorScheme', 'schemeType', 'showXAxis', 'showYAxis', 'showLegend', 'legendTitle',
          'showXAxisLabel', 'xAxisLabel', 'showYAxisLabel', 'yAxisLabel', 'showGridLines',
          'roundDomains', 'autoScale', 'minRadius', 'maxRadius', 'tooltipDisabled'
        ],
        defaults: {
          xAxisLabel: 'x-Axis',
          yAxisLabel: 'Life expectancy [years]'
        }
      },
      //{
      //  name: 'Force Directed Graph',
      //  selector: 'force-directed-graph',
      //  inputFormat: 'graph',
      //  options: ['colorScheme', 'showLegend', 'legendTitle', 'tooltipDisabled']
      //},
      {
        name: 'Heat Map',
        selector: 'heat-map',
        inputFormat: 'multiSeries',
        options: [
          'colorScheme', 'showXAxis', 'showYAxis', 'gradient', 'showLegend',
          'showXAxisLabel', 'xAxisLabel', 'showYAxisLabel', 'yAxisLabel',
          'innerPadding', 'tooltipDisabled'
        ],
        defaults: {
          yAxisLabel: 'y-Axis',
          cAxisLabel: 'c-Axis'
        }
      },
      {
        name: 'Tree Map',
        selector: 'tree-map',
        inputFormat: 'singleSeries',
        options: ['colorScheme', 'tooltipDisabled', 'gradient']
      },
      {
        name: 'Number Cards',
        selector: 'number-card',
        inputFormat: 'singleSeries',
        options: ['colorScheme']
      },
      {
        name: 'Gauge',
        selector: 'gauge',
        inputFormat: 'singleSeries',
        options: [
          'showLegend', 'legendTitle', 'colorScheme', 'min', 'max', 'largeSegments', 'smallSegments', 'units',
          'angleSpan', 'startAngle', 'showAxis', 'margin', 'tooltipDisabled'
        ]
      },
      //{
      //    name: 'Tooltip Templates',
      //    selector: 'tooltip-templates',
      //    inputFormat: 'singleSeries',
      //    options: [
      //        'colorScheme', 'schemeType', 'showXAxis', 'showYAxis', 'gradient', 'barPadding',
      //        'showLegend', 'legendTitle', 'showXAxisLabel', 'xAxisLabel', 'showYAxisLabel', 'yAxisLabel',
      //        'showGridLines', 'roundDomains', 'tooltipDisabled'
      //    ]
      //},
      {
        name: 'Line Chart with Reference Lines',
        selector: 'line-reference-lines',
        inputFormat: 'multiSeries',
        options: [
          'colorScheme', 'schemeType', 'showXAxis', 'showYAxis', 'gradient',
          'showLegend', 'legendTitle', 'showXAxisLabel', 'xAxisLabel', 'showYAxisLabel',
          'yAxisLabel', 'autoScale', 'timeline', 'showGridLines', 'curve',
          'rangeFillOpacity', 'roundDomains', 'tooltipDisabled', 'showRefLines',
          'referenceLines', 'showRefLabels'
        ],
        defaults: {
          yAxisLabel: 'y-Axis',
          xAxisLabel: 'x-Axis',
          linearScale: false
        }
      },
      {
        name: 'Sparklines',
        selector: 'sparkline',
        inputFormat: 'multiSeries',
        options: [
          'curve'
        ]
      }
      //,
      //{
      //    name: 'Timeline Filter Bar Chart',
      //    selector: 'timeline-filter-bar-chart-demo',
      //    inputFormat: 'singleSeries',
      //    options: [
      //        'colorScheme', 'schemeType', 'showXAxis', 'showYAxis', 'gradient', 'showGridLines',
      //        'showXAxisLabel', 'xAxisLabel', 'showYAxisLabel', 'yAxisLabel'
      //    ]
      //}
      //  ,
      //{
      //  name: 'Linear Gauge',
      //  selector: 'linear-gauge',
      //  inputFormat: 'single',
      //  options: ['colorScheme', 'value', 'previousValue', 'min', 'max', 'units']
      //}
    ]
  }
  //  ,
  //{
  //  name: 'Other',
  //  charts: [
  //    {
  //      name: 'Combo Chart',
  //      selector: 'combo-chart',
  //      inputFormat: 'comboChart',
  //      options: [
  //        'showXAxis', 'showYAxis', 'gradient',
  //        'showLegend', 'legendTitle', 'showXAxisLabel', 'xAxisLabel', 'showYAxisLabel', 'yAxisLabel',
  //        'showGridLines', 'roundDomains', 'tooltipDisabled'
  //      ]
  //    },
  //    {
  //      name: 'Heat Map - Calendar',
  //      selector: 'calendar',
  //      inputFormat: 'calendarData',
  //      options: [
  //        'colorScheme', 'showXAxis', 'showYAxis', 'gradient', 'showLegend',
  //        'innerPadding', 'tooltipDisabled'
  //      ],
  //      defaults: {
  //        width: 1100,
  //        height: 200
  //      }
  //    },
  //    {
  //      name: 'Number Cards - Status',
  //      selector: 'status-demo',
  //      inputFormat: 'statusData',
  //      options: ['colorScheme']
  //    },
  //    {
  //      name: 'TreeMap - Interactive',
  //      selector: 'tree-map-demo',
  //      inputFormat: 'treemap',
  //      options: ['colorScheme']
  //    },
  //    {
  //      name: 'Equation Plots',
  //      selector: 'plot-demo',
  //      inputFormat: 'statusData',
  //      options: [
  //        'colorScheme', 'schemeType', 'showXAxis', 'showYAxis',
  //        'autoScale', 'showGridLines', 'gradient',
  //        'roundDomains', 'tooltipDisabled'
  //      ]
  //    },
  //    {
  //      name: 'Tooltip Templates',
  //      selector: 'tooltip-templates',
  //      inputFormat: 'singleSeries',
  //      options: [
  //        'colorScheme', 'schemeType', 'showXAxis', 'showYAxis', 'gradient', 'barPadding',
  //        'showLegend', 'legendTitle', 'showXAxisLabel', 'xAxisLabel', 'showYAxisLabel', 'yAxisLabel',
  //        'showGridLines', 'roundDomains', 'tooltipDisabled'
  //      ]
  //    },
  //    {
  //      name: 'Sparklines',
  //      selector: 'sparkline',
  //      inputFormat: 'multiSeries',
  //      options: [
  //        'curve'
  //      ]
  //    },
  //    {
  //      name: 'Line Chart with Reference Lines',
  //      selector: 'line-reference-lines',
  //      inputFormat: 'multiSeries',
  //      options: [
  //        'colorScheme', 'schemeType', 'showXAxis', 'showYAxis', 'gradient',
  //        'showLegend', 'legendTitle', 'showXAxisLabel', 'xAxisLabel', 'showYAxisLabel',
  //        'yAxisLabel', 'autoScale', 'timeline', 'showGridLines', 'curve',
  //        'rangeFillOpacity', 'roundDomains', 'tooltipDisabled', 'showRefLines',
  //        'referenceLines', 'showRefLabels'
  //      ],
  //      defaults: {
  //        yAxisLabel: 'y-Axis',
  //        xAxisLabel: 'x-Axis',
  //        linearScale: false
  //      }
  //    },
  //    {
  //      name: 'Timeline Filter Bar Chart',
  //      selector: 'timeline-filter-bar-chart-demo',
  //      inputFormat: 'singleSeries',
  //      options: [
  //        'colorScheme', 'schemeType', 'showXAxis', 'showYAxis', 'gradient', 'showGridLines',
  //        'showXAxisLabel', 'xAxisLabel', 'showYAxisLabel', 'yAxisLabel'
  //      ]
  //    }
  //  ]
  //}
];

export default chartGroups;
