const noop = () => {}

const fakeAnimation = {
  play: noop,
  stop: noop,
  pause: noop,
  setSpeed: noop,
  setDirection: noop,
  destroy: noop
}

const lottie = {
  loadAnimation: () => fakeAnimation,
  setQuality: noop,
  destroy: noop
}

export default lottie
