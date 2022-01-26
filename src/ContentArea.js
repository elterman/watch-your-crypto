import './App.css';
import { useRecoilState, useRecoilValue } from 'recoil';
import { my_symbols, assets_data } from './atoms';
import _ from 'lodash';
import Item from './Item';

const ContentArea = () => {
  const [assetsData, setAssetsData] = useRecoilState(assets_data);
  const symbols = useRecoilValue(my_symbols)

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
        alert(err.status || err.message || err.code);
      });
  };

  if (_.isEmpty(assetsData)) {
    doFetch();
  };

  return <div className='app'>
    <div style={{ padding: '10px', display: 'grid' }}>
      <img id='messari'  src='https://messari.io/images/Messari_icon_36x36.svg' alt='messari.io'
        onClick={() => window.open(`https://messari.io`, '_blank')}
      />
      {!_.isEmpty(assetsData) && _.map(symbols, (symbol, i) => <Item key={i} symbol={symbol} index={i} />)}
    </div>
  </div>;
}

export default ContentArea;
