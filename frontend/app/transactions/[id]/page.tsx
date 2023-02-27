import TransactionStatus from "./TransactionStatus";
export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Transaction Status",
};

async function confirmTransaction(
  transactionId: number,
  paymentIntent: string
) {
  let transaction;
  await fetch(
    `${process.env.BACKEND_URL}/transaction/${transactionId}/checkout/${paymentIntent}`,
    { method: "POST" }
  )
    .then((res) => res.json())
    .then((res) => {
      return true;
    });
  return transaction;
}

export default async function (props) {
  const {params, searchParams} = props;
  const transactionId: number = params.id;
  const paymentIntent: string = searchParams.payment_intent;
  await confirmTransaction(transactionId, paymentIntent);
  return (
    <section className="mt-6">
      <div className="gap-4 items-center py-4 px-4 mx-auto max-w-screen-xl xl:gap-8 sm:py-8 lg:px-6">
        <TransactionStatus transactionId={transactionId} />
      </div>
    </section>
  );
}
