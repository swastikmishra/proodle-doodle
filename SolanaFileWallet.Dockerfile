FROM ubuntu:latest

RUN apt-get -y update
RUN apt-get -y install curl

#Install Solana CLI
RUN sh -c "$(curl -sSfL https://release.solana.com/v1.15.2/install)"
ENV PATH="/root/.local/share/solana/install/active_release/bin:$PATH"

RUN mkdir /root/solana-file-wallet
COPY ./solana-file-wallet/config.yml /root/solana-file-wallet/config.yml
COPY ./solana-file-wallet/file-wallet.json /root/solana-file-wallet/file-wallet.json
COPY ./solana-file-wallet/dump-file-wallet.json /root/solana-file-wallet/dump-file-wallet.json

RUN mkdir /root/.config/solana/cli 
RUN cp /root/solana-file-wallet/config.yml /root/.config/solana/cli/config.yml
