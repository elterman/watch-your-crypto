import { atom } from "recoil";

export const my_symbols = atom({ key: 'my_symbols', default: ['BTC', 'ETH', 'ALGO', 'ADA', 'NANO', 'CHAINLINK', 'LTC', 'XLM', 'MIDAS'] });
export const assets_data = atom({ key: 'assets_data', default: {}, dangerouslyAllowMutability: true })