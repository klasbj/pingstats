import * as React from 'react';
import './App.css';
import PieChart from './DataDisplay/PieChart';
import { IWeekStats, WeeksDisplay } from './DataDisplay/WeeksDisplay';
import './Fetcher';
import { Fetcher } from './Fetcher';

interface IDayStats {
  date: string,
  count: number
}

interface IHourStats {
  hour: number,
  count: number
}

interface ITodayStats {
  time: string,
  count: number
}

interface IStats {
  per_week: IWeekStats[],
  per_day: IDayStats[],
  per_hour: IHourStats[],
  today: ITodayStats
}


class App extends React.Component {
  public render() {
    return (
      <div className="App">
        <Fetcher<IStats> src="stats.json">
          {(data, loading, error) => {
            if (loading) {
              return <p>Loading...</p>;
            }
            
            if (data === null || error !== null) {
              return <p>Error: {error || "Unknown error"}</p>;
            }

            return (<div>
              <p>Status at {new Date(data.today.time).toLocaleString("sv-SE", {timeZoneName: "short"})}</p>
              <div>
                <WeeksDisplay weekData={data.per_week} />
              </div>
              <div style={{width: "200px", height: "200px"}}>
                <PieChart data={data.per_hour.map(x => ({name: x.hour.toString(), count: x.count }))} />
              </div>

            </div>);
          }}
        </Fetcher>
      </div>
    );
  }
}

export default App;
