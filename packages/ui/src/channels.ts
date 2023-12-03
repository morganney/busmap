/**
 * Channel used by transport to communicate
 * unauthenticated status from the backend.
 * Using broadcast channels because they work
 * better than custom events across browsing contexts.
 *
 * Instantiated here to allow for calling
 * close() on the channel within the root
 * component. (React StrictMode cruft)
 */
const authn = new BroadcastChannel('authn')

export { authn }
