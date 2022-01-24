import { useRecoilValue } from 'recoil';
import { assets_data } from './atoms';
import { formatPercent } from './utils';
import { useSpring, animated } from 'react-spring';

const Item = (props) => {
    const { symbol, index } = props;
    const assetsData = useRecoilValue(assets_data);
    const { opacity } = useSpring({ opacity: 1, from: { opacity: 0.5 }, reset: true });


    const ob = assetsData[symbol];
    const once = ob.prev_price === undefined;
    const data = ob.data.market_data;
    const last1 = data.percent_change_usd_last_1_hour;
    const last24 = data.percent_change_usd_last_24_hours;
    const background = index % 2 ? '#0008' : '#0000';

    const dstyle = up => { return { color: up > 0 ? '#56BF8B' : up < 0 ? '#F4425A' : '#fff', justifySelf: 'end', opacity } }

    return (
        <div key={ob.data.symbol} className='item' style={{ background }}
            onClick={() => window.open(`https://messari.io/asset/${symbol}`, '_blank')}>
            <span>{ob.data.symbol}</span>
            <animated.span style={dstyle(once ? 0 : data.price_usd > ob.prev_price ? 1 : -1)}>{data.price_usd.toFixed(4)}</animated.span>
            <span style={dstyle(last1 > 0 ? 1 : -1)}>{formatPercent(last1 / 100)}</span>
            <span style={dstyle(last24 > 0 ? 1 : -1)}>{formatPercent(last24 / 100)}</span>
        </div>
    )
}

export default Item;