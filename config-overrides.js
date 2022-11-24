const { 
  overrideDevServer,
} = require('customize-cra');

const devServerConfig = () => config => {
  const { ignored } = config.static.watch
  const new_ignored = Array.isArray(ignored) ? [...ignored] else [ignored]
  new_ignored.append(
  return {
      ...config,
  }
}

module.exports = {
  devServer: overrideDevServer(
    devServerConfig()
  )
}
