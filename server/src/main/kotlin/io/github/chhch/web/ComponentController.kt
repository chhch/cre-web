package io.github.chhch.web

import io.github.chhch.commons.Lifecycle
import io.github.chhch.cre.component.ComponentDTO
import org.slf4j.LoggerFactory
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter


/**
 * About actions and REST API:
 *   [https://www.vinaysahni.com/best-practices-for-a-pragmatic-restful-api#restful]
 */
@RestController
@RequestMapping("/api/components")
class ComponentController(private val componentService: ComponentService,
                          private val componentLoggingService: ComponentLoggingService) {

    private val log = LoggerFactory.getLogger("ComponentController")

    @GetMapping
    fun getAllComponents(): List<ComponentDTO> {
        log.info("REST request to get all Components")
        return componentService.getAllComponents()
    }

    @PostMapping
    fun handleFileUpload(@RequestParam("file") file: MultipartFile): ResponseEntity<ComponentDTO?> {
        log.info("REST request to upload Component : { }", file.originalFilename)
        return try {
            ResponseEntity.ok(componentService.createComponent(file.bytes, file.originalFilename))
        } catch (e: Exception) {
            fail<ComponentDTO>(e)
        }
    }

    @PutMapping("/{id}/start")
    fun start(@PathVariable id: String): ResponseEntity<ComponentDTO> {
        log.info("REST request to start Component : { }", id)
        return executeCommand { componentService.start(id) }
    }

    @PutMapping("/{id}/stop")
    fun stop(@PathVariable id: String): ResponseEntity<ComponentDTO> {
        log.info("REST request to stop Component : { }", id)
        return executeCommand { componentService.stop(id) }
    }

    @PutMapping("/{id}/unload")
    fun unload(@PathVariable id: String): ResponseEntity<ComponentDTO> {
        log.info("REST request to unload Component : { }", id)
        return executeCommand { componentService.unload(id) }
    }

    @PutMapping("/{id}/scope/{scope}")
    fun setScope(@PathVariable id: String, @PathVariable scope: String): ResponseEntity<ComponentDTO> {
        log.info("REST request to set scope Component : { }", id)
        return executeCommand { componentService.setScope(id, Lifecycle.valueOf(scope)) } // Jackson Enum problem?
    }

    @GetMapping("/log")
    fun subscribeLog(): SseEmitter {
        return componentLoggingService.subscribeLog()
    }

    private fun executeCommand(command: () -> ComponentDTO?): ResponseEntity<ComponentDTO> =
            try {
                command()
                        ?.let { ResponseEntity.ok(it) }
                        ?: ResponseEntity.notFound().build()
            } catch (e: Exception) {
                fail<ComponentDTO>(e)
            }

    private inline fun <reified T : Any> fail(e: Exception) =
            ResponseEntity
                    .badRequest()
                    .header("cre-cause", e.message)
                    .build<T>()

}
