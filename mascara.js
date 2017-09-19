const setupProvider = require('./lib/setup-provider.js')
const setupDappAutoReload = require('./lib/auto-reload.js')

module.exports = {
  createDefaultProvider
}

function createDefaultProvider (opts = {}) {
  const host = opts.host || 'https://zero.metamask.io'
  //
  // setup provider
  //

  const provider = setupProvider({
    mascaraUrl: host + '/proxy/',
  })
  instrumentForUserInteractionTriggers(provider)

  //
  // ui stuff
  //

  let shouldPop = false
  window.addEventListener('click', maybeTriggerPopup)

  return setupDappAutoReload(provider, provider.publicConfigStore)


  //
  // util
  //

  function maybeTriggerPopup(){
    if (!shouldPop || window.web3) return
    shouldPop = false
    window.open(host, '', 'width=360 height=500')
  }

  function instrumentForUserInteractionTriggers(provider){
    const _super = provider.sendAsync.bind(provider)
    provider.sendAsync = function (payload, cb) {
      if (payload.method === 'eth_sendTransaction') {
        shouldPop = true
      }
      _super(payload, cb)
    }
  }

}