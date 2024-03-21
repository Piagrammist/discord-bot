# Discord Bot Template

## Usage

### Config

1. Rename `example.config.json` to `config.json`.
1. Get your `client id` and `bot token` from [Discord Dev Portal](https://discord.com/developers/applications/).
1. Place them in your new config file.

### Running

For **Debug** mode, run:

```shell
npm run dev
```

> This will run `ts-node` and doesn't produce any `.js` files!

For **Production** mode:

1. Comment out or remove the `noEmit` option from your `tsconfig.json` file.
1. Run the typescript transpiler:

    ```shell
    npx tsc
    ```

1. Execute the produced Javascript:

    ```shell
    node dist/index.js
    ```
