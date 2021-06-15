<template>
  <v-card outlined>
    <v-card-text>
      <ul>
        <li>
          <div class="font-weight-bold">
            What is an NFT?
          </div>
          <div>
            A non-fungible token (NFT) is a unit of data stored on a digital ledger,
            called a blockchain, that certifies a digital asset to be unique and therefore not interchangeable.
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
            Can I mint new tokens after creating my NFT?
          </div>
          <div>
            No, because when the NFT was created, your mint right was revoked.
            We plan to add a feature that will allow not to revoke the mint right at creation, so the supply will not be fixed.
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
              href="https://ipfs.io/"
              target="_blank"
              rel="noopener noreferrer"
            >IPFS protocol</a>.
            It provides deduplication, high performance, and clustered persistence
          </div>
        </li>
        <br>
        <li>
          <div class="font-weight-bold">
            Can I change the name or image of my NFT?
          </div>
          <div>
            No, these are definitive fields. You must create a new NFT in this case.
          </div>
        </li>
        <br>
        <li>
          <div class="font-weight-bold">
            I just created my NFT, how can I send it to someone?
          </div>
          <div>
            You can use any traditional wallet (Sollet, Phantom, Ledger, Solong...)
            Your NFT should be listed with the mint address that was given to you when the token was created.
          </div>
        </li>
        <br>
        <li>
          <div class="font-weight-bold">
            The supply of some NFTs is higher than 1, is this normal?
          </div>
          <div>
            If the supply of an NFT is greater than 1,
            it is not really an NFT (non-fungible token) but a "semi-fungible token".
          </div>
        </li>
        <br>
        <li>
          <div class="font-weight-bold">
            Where can I find the list of all NFTs created on NFTCreator?
          </div>
          <div>
            The list of all NFTs created on NFTCreator is available at: <a
              class="text-decoration-none"
              href="https://api.nft-creator.sonar.watch/collectibles"
              target="_blank"
              rel="noopener noreferrer"
            >https://api.nft-creator.sonar.watch/collectibles</a>
          </div>
        </li>
        <br>
        <li>
          <div class="font-weight-bold">
            Why does my NFT link start with <code>ipfs://</code>?
          </div>
          <div>
            IPFS data are permanent.
            If you put a HTTP link to your asset, you run the risk of that URL not being available at some point in the future.
            We reference IPFS assets with the <code>ipfs://YOUR_CID pointer</code>.
            So it's easy to pull out the CID and load the content using a public gateway.<br>
            You can find a list of public gateways <a
              class="text-decoration-none"
              href="https://ipfs.github.io/public-gateway-checker/"
              target="_blank"
              rel="noopener noreferrer"
            >here</a>.
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
