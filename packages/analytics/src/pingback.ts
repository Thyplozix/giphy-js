import { getPingbackId, Logger } from '@giphy/js-util'
import { debounce } from 'throttle-debounce'
import gl from './global'
import { sendPingback } from './send-pingback'
import { Pingback, PingbackEvent, PingbackGifEvent } from './types'

let queuedPingbackEvents: PingbackEvent[] = []

gl.giphyRandomId = getPingbackId()

let loggedInUserId = ''

function sendPingbacks() {
    const sendEvents = [...queuedPingbackEvents]
    queuedPingbackEvents = []
    sendPingback(sendEvents)
}

const debouncedPingbackEvent = debounce(1000, sendPingbacks)

const pingback = ({ gif, userId, eventType, actionType, attributes, queueEvents = true }: Pingback) => {
    // save the user id for whenever create session is invoked
    loggedInUserId = userId ? String(userId) : loggedInUserId

    const newEvent: PingbackEvent = {
        ts: Date.now(),
        attributes,
        action_type: actionType,
        user_id: getPingbackId(),
    }

    if (loggedInUserId) {
        newEvent.logged_in_user_id = loggedInUserId
    }

    if (gif) {
        if (!gif.analytics_response_payload) {
            Logger.debug(`no pingback for ${gif.id}, not all endpoints have ARPs`)
            // abort pingback, analytics_response_payload is required for gif events
            return
        }
        const gifEvent = newEvent as PingbackGifEvent
        gifEvent.analytics_response_payload = `${gif.analytics_response_payload}${
            Logger.ENABLED ? '&mode=verification' : ''
        }`
    }

    if (eventType) {
        newEvent.event_type = eventType
    }

    queuedPingbackEvents.push(newEvent)

    queueEvents ? debouncedPingbackEvent() : sendPingbacks()
}

export default pingback
