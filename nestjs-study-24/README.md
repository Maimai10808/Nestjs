                  AppModule
                      │
             ┌────────┴────────┐
             │                 │
             ▼                 ▼
        UsersModule       AgentsModule
             │                 │
       ┌─────┴─────┐     ┌─────┴─────┐
       │           │     │           │
       ▼           ▼     ▼           ▼
   Controller   Service Controller Service
                   │                 │
                   ▼                 ▼
               UserEntity       AgentEntity
                                     │
                                     ▼
                                 ModelEntity
