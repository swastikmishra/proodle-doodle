import fetch from "node-fetch";

export const getCurrentRate = async (
  fromCurrency: string,
  toCurrency: string
): Promise<number | null> => {
  let rate = null;
  await fetch(
    `https://api.coinbase.com/v2/exchange-rates?currency=${fromCurrency}`
  )
    .then((res) => res.json())
    .then((res : any) => {
      rate = parseFloat(res.data.rates[toCurrency]).toFixed(2);
    });
  return rate;
};

export const convertCurrency = async (
  amount: number,
  fromCurrency: string,
  toCurrency: string
): Promise<number> => {
  let rate: number | null = await getCurrentRate(fromCurrency, toCurrency);
  if (rate) return rate * amount;
  else return amount;
};
