/**
 * Channel used to broadcast session related info.
 *
 * This one is necessary for the favorites worker
 * and the fetch transport to work in tandem when
 * reading the busmap-session-user header to
 * detect backend seassion state. There is no
 * window object to dispatch a custom event
 * against in the worker scope.
 */
const authn = new BroadcastChannel('authn')

export { authn }
