import './App.css';
import { useRecoilState } from 'recoil';
import { useEffect } from 'react';
import { my_assets, do_refresh } from './atoms';
import { useInterval } from './hooks';
import _ from 'lodash';
import { formatPercent } from './utils';

const ContentArea = () => {
  const [refresh, setRefresh] = useRecoilState(do_refresh)
  const [assetsData, setAssetsData] = useRecoilState(my_assets);

  useEffect(() => {
    if (!refresh) {
      return;
    }

    setRefresh(false);

    const adata = { ...assetsData };
    let i = 0;

    const updateAssetsData = () => ++i === _.size(assetsData) && setAssetsData(adata);

    _.each(assetsData, (ob, key) => {
      const url = `https://data.messari.io/api/v1/assets/${key}/metrics/market-data`;

      fetch(url)
        .then((res) => {
          return res.ok ? res.json() : Promise.reject({ status: res.status, message: res.statusText });
        })
        .then((data) => {
          const d = data.data;
          adata[key] = { ...d, up: d.market_data.price_usd >= assetsData[key]?.market_data.price_usd };

          updateAssetsData();
        })
        .catch((err) => {
          console.log(err);
          updateAssetsData();
        });
    })
  }, [assetsData, refresh, setAssetsData, setRefresh])

  const doRefresh = () => setRefresh(true);

  useInterval(doRefresh, 10000);

  return assetsData &&
    <div style={{ background: '#234', fontFamily: 'Roboto Mono', fontSize: '16px', height: '100vh', display: 'grid', placeContent: 'start center', padding: '10px 0' }} onClick={doRefresh}>
      {_.map(assetsData, (ob) => {
        if (!ob) {
          return null;
        }

        const data = ob.market_data;
        const last1 = data.percent_change_usd_last_1_hour;
        const last24 = data.percent_change_usd_last_24_hours;

        return (
          <div key={ob.symbol} style={{ padding: '5px', display: 'grid', grid: 'auto / 60px 100px 80px 80px', gridAutoFlow: 'column', color: '#B8AF8F' }}>
            <span>{ob.symbol}</span>
            <span style={{ color: ob.up > 0 ? '#56BF8B' : '#F4425A', justifySelf: 'end' }}>{data.price_usd.toFixed(4)}</span>
            <span style={{ color: last1 > 0 ? '#56BF8B' : '#F4425A', justifySelf: 'end' }}>{formatPercent(last1 / 100)}</span>
            <span style={{ color: last24 > 0 ? '#56BF8B' : '#F4425A', justifySelf: 'end' }}>{formatPercent(last24 / 100)}</span>
          </div>
        )
      })}
    </div>;

}

export default ContentArea;
