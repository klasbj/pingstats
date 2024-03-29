import * as React from 'react';

import './PieChart.css';

const ToRad = (x: number) => x * Math.PI / 180.0;

export interface IPieData {
    name: string,
    count: number
}

export interface IPieChartProps {
    data: IPieData[],
    title: string,
}

interface ILegendItem {
    fillColor: string,
    strokeColor: string,
    name: string
}

/*
<svg height="8" width="8">
            <rect x="0" y="0" width="6" height="6" style={{fill: x.fillColor, stroke: x.strokeColor}} />
        </svg>
        */

const Legend = (props: {items: ILegendItem[]}) : JSX.Element => {
    const items = props.items.map(x => <li key={x.name}>
        <div className="legend-color-box" style={{backgroundColor: x.fillColor, borderColor: x.strokeColor}} />
        {x.name}
    </li>);
    return (<ul>
        {items}
    </ul>);
}

const RadPoint = (radius: number, angle: number): string => `${radius*Math.cos(ToRad(angle))},${radius*Math.sin(ToRad(angle))}`;

const Piece = ({start,end,style} : {start: number, end: number, style: any}) => {
    const outerRadius = 95;
    const innerRadius = 10;
    const path = `M ${RadPoint(innerRadius, start)} L ${RadPoint(outerRadius, start)} ` +
        `A ${outerRadius} ${outerRadius} ${start} ${(end - start) > 180.0 ? 1 : 0} 1 ${RadPoint(outerRadius, end)} ` +
        `L ${RadPoint(innerRadius, end)} A ${innerRadius} ${innerRadius} ${end} ${(end - start) > 180.0 ? 1 : 0} 0 ${RadPoint(innerRadius, start)} z`;
    return <path d={path} style={style} />;
}

export const PieChart = (props: IPieChartProps) => {
    // transform data to percent
    const total = props.data.reduce((p,c) => p + c.count, 0);
    const percented = props.data.map(x => Object.assign({}, x, {count: x.count / total}));

    const colorStep = 360 / percented.length;

    const pieces : JSX.Element[] = [];
    const legendItems : ILegendItem[] = [];
    let angle = 0;

    percented.forEach((v,i) => {
        const startAngle = angle;
        const endAngle = (i === percented.length-1) ? 360 : (angle + v.count * 360);
        angle = endAngle;
        const fillColor = `hsl(${colorStep * i}, 80%, 60%)`;
        const strokeColor = "white"; // `hsl(${colorStep * i}, 80%, 40%)`;

        pieces.push(<Piece key={v.name} start={startAngle-90} end={endAngle-90} style={{fill: fillColor, stroke: strokeColor}} />);
        legendItems.push({name: v.name, fillColor, strokeColor});
    });

    return (
    <div className="piechart">
        <h3>{props.title}</h3>
        <div className="image">
            <svg viewBox="-100 -100 200 200">
                {pieces}
                <text x="-190" y="0" style={{fontSize:"smaller"}}>helo</text>
            </svg>
        </div>
        <div className="legend">
            <Legend items={legendItems} />
        </div>
    </div>)
}

export default PieChart;