Backend aware Loadbalancer
===

This application is a part of academic work demonstrating a distributed system

Description
---

A simple round-robin LB. Requesing health (or other) endpoins of predefined backends and setting backends available / unavailable according to reply.

Backends are set in **servers.json** file:

    servers: [
        {"host": "<host>:<port>", "health": "/<path>"}
        ,...,
        {"host": "<host>:<port>", "health": "/<path>"}
    ]

Health-check schedule can be set with environment variable **SCHEDULE** (see below) 

Environment variables:
    
    LB_PORT=NUMBER
    LB_SCHEDULE=<CRONTAB> (for example '*/5 * * * * *' for every 5 seconds.)