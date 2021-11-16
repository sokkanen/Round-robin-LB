Backend aware Loadbalancer
===

Part of academic work demonstrating a distributed system
---

A simple round-robin LB. Calling for **/actuator/health** -endpoins of predefined 
backends and setting available backends respectively. 

Health-check schedule can be set with environment variable **SCHEDULE** (see below) 

Environment variables:
    
    PORT=NUMBER
    SCHEDULE=CRONTAB (for example '*/5 * * * * *' for every 5 seconds.)

Backends are set in **servers.json** file.