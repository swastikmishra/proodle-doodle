export type RequestGetNFTsQuery = { offset?: number; nextPage?: number };
export type RequestGetNFT = { id: Number };
export type RequestBodyNFTCheckout = {
  currency: string;
  email?: string;
  wallet?: string;
};
export type RequestPostNFTConfirmTransaction = { id: Number; intent: string };
export type RequestGetTransactionStatus = { id: Number };