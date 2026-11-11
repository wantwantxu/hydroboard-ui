export function isDev() {
  console.log(process.env.NODE_ENV)
  return process.env.NODE_ENV === 'development'
}

export function isProd() {
  return process.env.NODE_ENV === 'production'
}
