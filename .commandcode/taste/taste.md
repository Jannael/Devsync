# Taste (Continuously Learned by [CommandCode][cmd])

[cmd]: https://commandcode.ai/

# architecture
- Organize CLI modules using Clean Architecture layers: domain/ (interfaces), app/ (use cases + command), infra/ (implementations). Confidence: 0.65
- Prefer constructor injection over mixin/class-extension patterns for composing dependencies. Confidence: 0.70

# naming
- Name use case files as `{verb}-{noun}.use-case.ts`. Confidence: 0.70

# code-style
- Use object parameters instead of positional parameters for interface method signatures to enforce contract adherence. Confidence: 0.75
