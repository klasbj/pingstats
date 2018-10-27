import * as React from 'react';

import './BarPlot.css';

interface IDataSet {
  name: string,
  unit: string,
  yAxis: number[], // values to show on the y axis
  dataValues: number[], // one data point per xAxis value in the plot
  conv: (v: number) => number // conversion from value to (linear y axis location)
}

export interface IBarPlot {
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
  const fullWidth = 30;
  const spacing = 2;
  const barWidth = (fullWidth - spacing * (props.bars.length - 1)) / props.bars.length;
  const xMin = props.x - fullWidth/2;
  const bars = props.bars.map((x,i) =>
    <rect className={`axis-${i}`} key={`bar-${x.name}`} x={xMin + (barWidth+spacing)*i} y={x.yTop}
          width={barWidth} height={-x.yTop} stroke="black" />);

  return (<g className="bargroup">{bars}</g>);
}

const XAxis = (props: {values: string[]}): JSX.Element => {
  const values = props.values.map((x,i) => <text key={x} x={(i)*60} y={0} dy={10}>{x}</text>)
  return (<g style={{fontSize: "x-small", textAnchor: "middle"}}>
    <line x1="-10000" y1={0} x2="10000" y2={0} className="xbar" stroke="black" />
    {values}
  </g>);
}

interface IBarPlotProps {
  data: IBarPlot,
  title?: string,
  width?: number,
  height?: number
}

export const BarPlot = ({data, width=1200, height=250, title}: IBarPlotProps): JSX.Element => {
  const yAxes = data.dataSets.map((v,i) => {
    const key = `axis-${v.name}`;
    return <YAxis key={key} className={`axis-${i}`} dataSet={v} dx={-50 -i*50}/>
  });

  const bars = data.xAxis.map((x,i) => {
    const p : IBarGroupProps = {
      bars: data.dataSets.map(v => { return {
        name: v.name,
        value: v.dataValues[i],
        yTop: -v.conv(v.dataValues[i])
      };}),
      x: 60*i,
      xLabel: x,
    };

    return <BarGroup key={`bargroup-${x}`} {...p} />
  })

  return (<div className="BarPlot">
    {title && <h3>{title}</h3>}
    <svg width={width} height={height} viewBox="-170 -65 800 11">
      <XAxis values={data.xAxis} />
      {yAxes}
      {bars}
    </svg>
  </div>);
}