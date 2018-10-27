import * as React from 'react';

import { BarPlot, IBarPlot } from './BarPlot';

import './WeeksDisplay.css';

export interface IDayStats {
  date: string,
  count: number
}

interface IDaysDisplayProps {
  data: IDayStats[]
}

export const FaultsPerDay = (props: IDaysDisplayProps): JSX.Element => {
  const plotData : IBarPlot = {
    dataSets: [
      {
        conv: (v) => v > 0 ? Math.log10(v) * 35 : v,
        dataValues: props.data.map(x => x.count),
        name: "count",
        unit: "",
        yAxis: [0, 10, 100, 1000],
      },
    ],
    xAxis: props.data.map(x => x.date),
  }
  return (<div className="FaultsPerDay">
            <BarPlot id="days" title="Faults per day" data={plotData} />
          </div>);
}
