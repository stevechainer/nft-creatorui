# nft-creator-ui

An easy and quick way to create NFTs on Solana blockchain

## Create your own GUI

### Customizing

NFTCreator is based on [Metaplex NTFs](https://www.metaplex.com/)<br>
This UI uses [VueJS](https://vuejs.org/) and [Vuetify library](https://vuetifyjs.com/). 

### Collect referral fees

To be implemented

### Deploy to Netlify

1. Fork this repository

1. On Netlify, setup up a new project from GitHub with the following settings:

    - **Base directory:** *leave empty*
    - **Build Command:** `yarn build`
    - **Publish directory:** `dist`

2. Hit the deploy button!

## Todo

* Add advanced settings
    * Let user set is royalties basis points
    * Let user set custom properties
* Add referral fees

## Commands

### Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

### Deploy to GH Pages
```
yarn deploy
```

