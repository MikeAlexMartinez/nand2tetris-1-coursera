function compose(...chain) {
  return (args) => chain.reduce((prev, current) => current(prev), args)
}

module.exports = compose;
