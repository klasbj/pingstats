import * as React from 'react';

import './WeeksDisplay.css';

export interface IWeekStats {
  week_of: string,
  count: number,
  duration: {
    mean: number,
    stddev: number
  }
}

interface IWeeksDisplayProps {
  weekData: IWeekStats[]
}

interface IDataSet {
  name: string,
  unit: string,
  yAxis: number[], // values to show on the y axis
  dataValues: number[], // one data point per xAxis value in the plot
  conv: (v: number) => number // conversion from value to (linear y axis location)
}

interface IPlot {
  xAxis: string[],
  dataSets: IDataSet[]
}

const YAxis = ({className, dataSet, dx}: {className: string, dataSet: IDataSet, dx: number}): JSX.Element => {
  const title = dataSet.name + (dataSet.unit.length > 0 ? ` (${dataSet.unit})` : "");
  const pipYs = dataSet.yAxis.map(v => -dataSet.conv(v));
  const maxY = pipYs[pipYs.length-1];
  const pips = pipYs.map((y,i) => (<g>
    <line className="yBar" x1={dx} y1={y} x2={dx+5} y2={y} />
    <text className="piplabel" x={dx} dx={2} y={y} dy={-2}>{dataSet.yAxis[i]}</text>
    <line className="extended-pip" x1={dx} y1={y} x2={10000} y2={y} />
  </g>));

  return (<g className={className + " yBar"} style={{fontSize: "x-small", textAnchor:"middle"}}>
    <text y={dx} dy={-7} x={-maxY/2.0} style={{transform: "rotate(-90deg)"}}>{title}</text>
    <line x1={dx} y1={0} x2={dx} y2={maxY} />
    {pips}
  </g>)
};

interface ISingleValue {
  name: string,
  value: number,
  yTop: number
}

interface IBarGroupProps {
  bars: ISingleValue[],
  x: number,
  xLabel: string,
}

const BarGroup = (props: IBarGroupProps) => {
  const xMin = props.x - (props.bars.length*10.0-2.0) / 2.0;
  const bars = props.bars.map((x,i) =>
    <rect className={`axis-${i}`} key={`bar-${i}`} x={xMin + 10*i} y={x.yTop}
          width="8" height={-x.yTop} stroke="black" />);

  return (<g className="bargroup">{bars}</g>);
}

const XAxis = (props: {values: string[]}): JSX.Element => {
  const values = props.values.map((x,i) => <text key={`xlabel-${i}`} x={(i)*80} y={0} dy={10}>{x}</text>)
  return (<g style={{fontSize: "x-small", textAnchor: "middle"}}>
    <line x1="-10000" y1={0} x2="10000" y2={0} className="xbar" stroke="black" />
    {values}
  </g>);
}

const Plot = ({data}: {data: IPlot}): JSX.Element => {
  const yAxes = data.dataSets.map((v,i) => {
    const key = `axis-${i}`;
    return <YAxis key={key} className={`axis-${i}`} dataSet={v} dx={-50 -i*50}/>
  });

  const bars = data.xAxis.map((x,i) => {
    const p : IBarGroupProps = {
      bars: data.dataSets.map(v => { return {
        name: v.name,
        value: v.dataValues[i],
        yTop: -v.conv(v.dataValues[i])
      };}),
      x: 80*i,
      xLabel: x,
    };

    return <BarGroup key={`bargroup-${i}`} {...p} />
  })

  return (<svg width="1200" height="350px" viewBox="-200 -9 1000 11">
    <XAxis values={data.xAxis} />
    {yAxes}
    {bars}
  </svg>);
}

export const WeeksDisplay = (props: IWeeksDisplayProps): JSX.Element => {
  const plotData : IPlot = {
    dataSets: [
      {
        conv: (v) => Math.log10(v) * 35,
        dataValues: props.weekData.map(x => x.count),
        name: "count",
        unit: "",
        yAxis: [0, 10, 100, 1000],
      },
      {
        conv: (v) => v * 13,
        dataValues: props.weekData.map(x => x.duration !== null && x.duration.mean || 0),
        name: "average duration",
        unit: "s",
        yAxis: [0, 3, 6, 9],
      },
      {
        conv: (v) => Math.log10(v)*30,
        dataValues: props.weekData.map(x => x.duration !== null && x.duration.mean*x.count || 0),
        name: "total duration",
        unit: "s",
        yAxis: [0, 10, 100, 1000, 10000],
      },
    ],
    xAxis: props.weekData.map(x => x.week_of),
  }
  return (<Plot data={plotData} />)
}

export default WeeksDisplay;
