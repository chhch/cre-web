package io.github.chhch.web

import io.github.chhch.cre.component.CRELog
import io.github.chhch.cre.component.ComponentLogMessage
import io.github.chhch.cre.component.LogListener
import org.springframework.context.ApplicationEventPublisher
import org.springframework.context.event.EventListener
import org.springframework.stereotype.Service
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter
import java.util.*
import java.util.concurrent.CopyOnWriteArrayList
import java.util.concurrent.TimeUnit

@Service
class ComponentLoggingService(eventPublisher: ApplicationEventPublisher) {

    private val emitters: CopyOnWriteArrayList<SseEmitter> = CopyOnWriteArrayList()

    init {
        CRELog.subscribe(Listener(eventPublisher))
    }

    fun subscribeLog(): SseEmitter {
        val emitter = SseEmitter(TimeUnit.HOURS.toMillis(24))
        emitter.onCompletion { emitters.remove(emitter) }
        emitter.onTimeout { emitters.remove(emitter) }
        emitters.add(emitter)
        return emitter
    }

    @EventListener
    fun onLogMessage(logMessage: ComponentLogMessage) {
        val deadEmitters = ArrayList<SseEmitter>()
        emitters.forEach {
            try {
                it.send(SseEmitter.event().data(logMessage))
            } catch (e: Throwable) {
                deadEmitters.add(it)
            }
        }
        emitters.removeAll(deadEmitters)
    }

    class Listener(private val eventPublisher: ApplicationEventPublisher) : LogListener {

        override fun invoke(logMessage: ComponentLogMessage) = eventPublisher.publishEvent(logMessage)

    }

}