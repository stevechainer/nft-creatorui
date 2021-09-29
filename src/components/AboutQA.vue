<template>
  <v-card outlined>
    <v-card-text>
      <ul>
        <li>
          <div class="font-weight-bold">
            What is an NFT?
          </div>
          <div>
            A non-fungible token (NFT) is a unit of data stored on a blockchain,
            that certifies a digital asset to be unique and therefore not interchangeable.
            You can find more information <a
              class="text-decoration-none"
              href="https://en.wikipedia.org/wiki/Non-fungible_token"
              target="_blank"
              rel="noopener noreferrer"
            >here</a>
          </div>
        </li>
        <br>
        <li>
          <div class="font-weight-bold">
            I heard that Solana transactions were almost free, why are there network fees?
          </div>
          <div>
            To create an NFT you must first create a token and then create an account that could receive this token.
            You have to deposit a minimum amount of SOL on these two accounts,
            which is where the biggest part of the network fees come from when creating an NFT.
            The fees related to the transaction itself are negligible.
          </div>
        </li>
        <br>
        <li>
          <div class="font-weight-bold">
            About Royalties
          </div>
          <div>
            This is how much of each secondary sale will be paid out to the creators.<br>
            The minimum is <code>1%</code> and the maximum is <code>50%</code><br>
            These royalties will be split in two, NFT Creator will receive <code>1%</code>
            of the resale commission while the artist/minter will receive <code>99%</code> of the resale commission.
          </div>
        </li>
        <br>
        <li>
          <div class="font-weight-bold">
            Where the images of the NFTs are stored
          </div>
          <div>
            All images are stored on the <a
              class="text-decoration-none"
              href="https://www.arweave.org/"
              target="_blank"
              rel="noopener noreferrer"
            >Arweave protocol</a>.
            It allows you to store data permanently, sustainably, with a single upfront fee.
          </div>
        </li>
        <br>
        <li>
          <div class="font-weight-bold">
            I would like to upload a file of more than 2mb.
          </div>
          <div>
            For the moment this is not possible, you can compress your file using online tools like
            <a
              class="text-decoration-none"
              href="https://squoosh.app/"
              target="_blank"
              rel="noopener noreferrer"
            >Squoosh</a>
          </div>
        </li>
        <br>
        <li>
          <div class="font-weight-bold">
            I just created my NFT, how can I send it to someone?
          </div>
          <div>
            Your NFT should be listed in your wallet as a traditional token.
            In some wallets it will be listed directly as an NFT (e.g. Phantom)
          </div>
        </li>
      </ul>
    </v-card-text>
  </v-card>
</template>

<script>
export default {

};
</script>
