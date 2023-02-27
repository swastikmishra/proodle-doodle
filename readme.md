# NFT Marketplace

### URLs:
- App: http://marketplace.swastikmishra.me/
- Github Repo: https://github.com/swastikmishra/proodle-doodle
- Solana File Wallet (Source, EQ2bqDkwX62exkHHp4sVGDJgpuyTHVgFXR9BfmU3tyA4): https://www.solaneyes.com/address/EQ2bqDkwX62exkHHp4sVGDJgpuyTHVgFXR9BfmU3tyA4
- Solana File Wallet (Dump, CecaX9w6J6KLSSA7cP2NKQATQXfBzQHPqCEyJ8msFQGY): https://www.solaneyes.com/address/CecaX9w6J6KLSSA7cP2NKQATQXfBzQHPqCEyJ8msFQGY
- Solana Dummy CandyMachine (CandyMachine V2): https://www.solaneyes.com/address/9WwdpqXgYcCGyLzvkRFVBHz1UCD6axKKniDHgNGGJRQg

### Tech Stack Used
- Deployment: The app is currently deployed on AWS Lightsaill instance.
- Database: Postgress 
- Blockchain: Solana
- IPFS: https://nft.storage/
- Backend:
	- [Prisma](https://www.prisma.io/): ORM
	- [Fastify](https://www.fastify.io/): Server
	- [Metaplex JS Foundation](https://github.com/metaplex-foundation/js): Solana SDK
- Frontend:
	- [NextJS (Experimental app/ version)](https://beta.nextjs.org/docs/getting-started)
	- [Metaplex JS Foundation](https://github.com/metaplex-foundation/js): Solana SDK
	- [TailwindCSS](https://tailwindcss.com/)
	- [Flowbite Blocks](https://flowbite.com/)
- Third-Party APIs
	- Coinbase Currency Conversion API
- Docker: for dev and deployment

### Quick Setup
- Clone the git repo.
- Enter the cloned directory.
- Run: `docker compose up -d`
- Frontend
	- To start Nextjs Server: `pm2 start yarn --name "nextjs" --interpreter bash -- start`
- Backend: 
	- Push schema to db: `yarn prisma db push`
	- To start Fastify Server: `pm2 start yarn --name "app" --interpreter bash -- ts-node app.ts`
- Importing NFTs from Wallet
	- Run the script `syncWalletNFTs.ts` inside `backend` folder.
	- Or you can import the NFTs from the `schema.sql` file present in the root folder.


https://github.com/solana-labs/wallet-adapter/issues/694

### Screenshots

Homepage
![Homepage](https://raw.githubusercontent.com/swastikmishra/proodle-doodle/master/screenshots/Homepage.png)

Homepage 2
![Homepage 2](https://raw.githubusercontent.com/swastikmishra/proodle-doodle/master/screenshots/Homepage%202.png)

Homepage Light
![Homepage Light](https://raw.githubusercontent.com/swastikmishra/proodle-doodle/master/screenshots/Homepage-Light.png)

NFT Page
![NFT page](https://raw.githubusercontent.com/swastikmishra/proodle-doodle/master/screenshots/NFT%20Page.png)

Checkout Page
![Checkout page](https://raw.githubusercontent.com/swastikmishra/proodle-doodle/master/screenshots/Checkout%20Page.png)

Transaction Confirmation
![Transaction page](https://raw.githubusercontent.com/swastikmishra/proodle-doodle/master/screenshots/Transaction.png)