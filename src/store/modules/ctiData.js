const ctiData = {
  state: {
    keepReady: null,
    incomingCall: false
  },
  mutations: {
    SET_KEEPREADY(state, keepReady) {
      state.keepReady = keepReady
    },
    SET_NAV_INCOMING_CALL(state, incomingCall) {
      state.incomingCall = incomingCall
    }
  },
  actions: {}
}
export default ctiData
