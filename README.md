# Web3GG Discord Bot

A Discord bot that enables cryptocurrency wallet management and transactions directly through Discord commands. see here for the live bot: [Web3bot](https://web3bot-ui.web.app/)

## Features

- Create and manage Ethereum-compatible wallets
- Support for multiple networks (Ethereum, BSC, Polygon, Goerli)
- Send and receive tokens (ETH, BNB, MATIC)
- ERC-20 token transfers and management
- Secure password protection for wallets
- Transaction history and balance checking
- Import existing wallets using private keys

## Installation

1. Clone the repository:

```bash
git clone https://github.com/johnexzy/web3gg.git
cd web3gg
```
2. Install dependencies:

```bash
npm install
```
3. Create a `.env` file and add the following:

```bash
CLIENT_TOKEN=your_discord_bot_token
DATABASE_URL=your_postgres_database_url
ICON_URL=bot_icon_url
WEBSITE=bot_website_url
ADMIN_ROLE=admin_role_id
crypto_salt=your_encryption_salt
TETHER=tether_contract_address
```

4. Build and start the bot:

```bash
npm run build
npm start
```

2. Deploy to Heroku:

```bash
npm run deploy:test
```

## Available Commands

- `/create-wallet` - Create or import a wallet
- `/wallet` - View wallet balances
- `/import-token` - Import ERC-20 tokens
- `/send` - Send native tokens (ETH/BNB/MATIC)
- `/transfer` - Transfer ERC-20 tokens
- `/tip` - Tip native tokens to server members
- `/tip-token` - Tip ERC-20 tokens to server members
- `/address` - Get wallet address
- `/change-password` - Change wallet password
- `/reset-password` - Reset wallet password
- `/export-private-key` - Export wallet private key
- `/commands` - List all available commands

## Security Features

- Encrypted private key storage
- Password protection for transactions
- Private key recovery system
- Ephemeral responses for sensitive data

## Supported Networks

- Ethereum Mainnet
- Binance Smart Chain
- Polygon
- Goerli Testnet

## Database Schema

The application uses PostgreSQL with Sequelize ORM and includes two main models:

1. Wallet Model - Stores encrypted wallet data
2. Token Model - Tracks imported ERC-20 tokens

## Development

1. Run in development mode:

```bash
npm run build
npm start
```

2. Deploy to Heroku:

```bash
npm run deploy:test
```

## License

MIT License - see LICENSE file for details

## Author

John Oba (obajohn75@gmail.com)

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit changes using Commitizen:

```bash
npm run cz
```
4. Push to your branch
5. Open a Pull Request

## Dependencies

Key dependencies include:
- discord.js
- ethers
- sequelize
- @discordjs/builders
- crypto-js
- bcryptjs

For a complete list, see the package.json file.
