import { atom } from "recoil";

export const do_refresh = atom({ key: 'do_refresh', default: true });
export const my_symbols = atom({ key: 'my_symbols', default: ['BTC', 'ETH', 'ALGO', 'ADA', 'NANO', 'CHAINLINK', 'LTC', 'XLM', 'AAVE'] });
export const assets_data = atom({ key: 'assets_data', default: {}, dangerouslyAllowMutability: true })