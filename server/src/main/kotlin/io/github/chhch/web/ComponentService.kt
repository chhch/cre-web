package io.github.chhch.web

import io.github.chhch.commons.Lifecycle
import io.github.chhch.cre.component.*
import org.springframework.stereotype.Service

@Service
class ComponentService {

    init {
        CRECache.restore()
    }

    fun getAllComponents(): List<ComponentDTO> = CRECache.getAllComponents().toDTO()
    fun createComponent(file: ByteArray, filename: String?) =
            FileHandler.createFile(file, filename).loadComponent().toDTO()

    fun start(id: String) = CRECache.findComponent(id)?.apply { start() }?.toDTO()
    fun stop(id: String) = CRECache.findComponent(id)?.apply { stop() }?.toDTO()
    fun unload(id: String) = CRECache.findComponent(id)?.apply { unload() }?.toDTO()
    fun setScope(id: String, scope: Lifecycle) =
            CRECache.findComponent(id)?.apply { this.scope = scope }?.toDTO()

}