const main = require('./Main')



function hackAssembler() {
  const args = process.argv;
  (async (args) => {
    const target = args[2];
    if (!target) throw new Error('No target file provided');
    await main(target);
    process.exit(0);
  })(args).catch((err) => {
    console.log('ERROR ENCOUNTERED');
    console.error(err);
    process.exit(1)
  })
}

process.on('uncaughtException', (err, origin) => {
  console.log(
    `Caught exception: ${err}\n` +
    `Exception origin: ${origin}`
  );
})

process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', promise, 'reason:', reason);
});

hackAssembler();
