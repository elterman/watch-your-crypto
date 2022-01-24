import './App.css';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useEffect } from 'react';
import { do_refresh, my_symbols, assets_data } from './atoms';
import _ from 'lodash';
import { formatPercent } from './utils';

const ContentArea = () => {
  const [refresh, setRefresh] = useRecoilState(do_refresh)
  const [assetsData, setAssetsData] = useRecoilState(assets_data);
  const symbols = useRecoilValue(my_symbols)

  useEffect(() => {
    if (!refresh) {
      return;
    }

    setRefresh(false);

    const doFetch = (i = 0, adata = {}) => {
      const symbol = symbols[i];
      const url = `https://data.messari.io/api/v1/assets/${symbol}/metrics/market-data`;

      fetch(url)
        .then((res) => {
          return res.ok ? res.json() : Promise.reject({ status: res.status, message: res.statusText });
        })
        .then((data) => {
          const d = data.data;
          adata[symbol] = { data: d, up: d.market_data.price_usd >= assetsData[symbol]?.market_data.price_usd };

          let ms = 100;

          if (i === symbols.length - 1) {
            setAssetsData(adata);

            i = -1;
            adata = {};
            ms = 5000;
          }

          setTimeout(() => doFetch(++i, adata), ms);
        })
        .catch((err) => {
          alert(err.status);
        });
    }

    doFetch();
  }, [assetsData, refresh, setAssetsData, setRefresh, symbols])

  return <div style={{ background: '#123', fontFamily: 'Roboto Mono', fontSize: '18px', height: '100vh', display: 'grid', placeContent: 'start center', overflow: 'hidden' }}>
    {_.map(assetsData, (ob) => {
      const data = ob.data.market_data;
      const last1 = data.percent_change_usd_last_1_hour;
      const last24 = data.percent_change_usd_last_24_hours;

      return (
        <div key={ob.data.symbol} style={{ padding: '5px', display: 'grid', grid: 'auto / 55px 110px 80px 80px', gridAutoFlow: 'column', color: '#B8AF8F' }}>
          <span>{ob.data.symbol}</span>
          <span style={{ color: ob.up > 0 ? '#56BF8B' : '#F4425A', justifySelf: 'end' }}>{data.price_usd.toFixed(4)}</span>
          <span style={{ color: last1 > 0 ? '#56BF8B' : '#F4425A', justifySelf: 'end' }}>{formatPercent(last1 / 100)}</span>
          <span style={{ color: last24 > 0 ? '#56BF8B' : '#F4425A', justifySelf: 'end' }}>{formatPercent(last24 / 100)}</span>
        </div>
      )
    })}
    <a href="https://messari.io/" style={{ textDecoration: 'none', color: '#fff4', fontSize: '14px' }}>Powered by Messari</a>
  </div>;

}

export default ContentArea;
