# Taste (Continuously Learned by [CommandCode][cmd])

[cmd]: https://commandcode.ai/

# architecture

- Organize CLI modules using Clean Architecture layers: domain/ (interfaces), app/ (use cases + command), infra/ (implementations). Confidence: 0.65
- Prefer constructor injection over mixin/class-extension patterns for composing dependencies. Confidence: 0.70
- Consolidate domain into a single interface per module; prefer one file per infra module with all related functions. Confidence: 0.70

# naming

- Name use case files as `{verb}-{noun}.use-case.ts`. Confidence: 0.70
- Name path constants with `PATH_` prefix in all caps (e.g., `PATH_ACADEMICS` instead of `ACADEMICS`) and always use `resolve()` for path construction. Confidence: 0.80

# code-style

- Use object parameters instead of positional parameters for interface method signatures to enforce contract adherence. Confidence: 0.75
- For pure utility/helper classes without I/O, skip the interface and use the concrete class directly as the type. Confidence: 0.70
