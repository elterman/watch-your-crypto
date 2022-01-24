import './App.css';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useEffect } from 'react';
import { do_refresh, my_symbols, assets_data } from './atoms';
import _ from 'lodash';
import Item from './Item';

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
          adata[symbol] = { data: d, prev_price: adata[symbol]?.data.market_data.price_usd };

          let ms = 10;

          if (i === symbols.length - 1) {
            setAssetsData({ ...adata });

            i = -1;
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

  return <div className='app'>
    <div style={{ padding: '10px' }}>
      {!_.isEmpty(assetsData) && _.map(symbols, (symbol, i) => <Item key={i} symbol={symbol} index={i} />)}
    </div>
  </div>;
}

export default ContentArea;
