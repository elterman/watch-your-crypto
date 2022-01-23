import { atom } from "recoil";

export const do_refresh = atom({ key: 'do_refresh', default: true });
export const my_assets = atom({ key: 'assets_data',
    default: { BTC: null, ETH: null, ALGO: null, ADA: null, NANO: null, CHAINLINK: null, LTC: null, XLM: null, AAVE: null, },
    dangerouslyAllowMutability: true
});